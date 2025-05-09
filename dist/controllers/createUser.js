"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.logoutUser = exports.getUsers = exports.loginUser = exports.resetPassword = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const invalidatedTokens = new Set();
// Crear un usuario
const secret = process.env.SECRET_KEY;
const generateRecoveryCode = () => {
    const numbers = Math.floor(1000 + Math.random() * 9000).toString(); // 4 números asegurados
    const letters = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)) // Genera una letra aleatoria (A-Z)
    ).join('');
    return `${numbers}${letters}`;
};
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, edad, actividad, role, authProvider } = req.body;
        if (!email || !authProvider) {
            return res.status(400).json({ message: "El email y el tipo de autenticación son obligatorios." });
        }
        let hashedPassword = undefined;
        if (authProvider === "local") {
            if (!password) {
                return res.status(400).json({ message: "La contraseña es obligatoria." });
            }
            const salt = yield bcrypt_1.default.genSalt(10);
            hashedPassword = yield bcrypt_1.default.hash(password, salt);
        }
        // Generar matrícula de recuperación
        const recoveryCode = generateRecoveryCode();
        const user = new UserModel_1.default({
            name,
            email,
            password: hashedPassword,
            edad,
            actividad,
            role: role || "user",
            authProvider,
            recoveryCode,
        });
        yield user.save();
        return res.status(201).json({ message: "Usuario creado correctamente.", recoveryCode });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear el usuario." });
    }
});
exports.createUser = createUser;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, recoveryCode, newPassword } = req.body;
        // Buscar usuario por email
        const user = yield UserModel_1.default.findOne({ email });
        if (!user || user.recoveryCode !== recoveryCode) {
            return res.status(400).json({ message: "Correo o código de recuperación incorrecto." });
        }
        // Encriptar la nueva contraseña
        const salt = yield bcrypt_1.default.genSalt(10);
        user.password = yield bcrypt_1.default.hash(newPassword, salt);
        // Guardar los cambios en la BD
        yield user.save();
        return res.json({ message: "Contraseña cambiada correctamente." });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al resetear la contraseña." });
    }
});
exports.resetPassword = resetPassword;
// Login de usuario
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Buscar el usuario por el correo
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Comparar la contraseña encriptada con la proporcionada
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, secret, { expiresIn: '8h' });
        return res.status(200).json({ message: 'Login exitoso', token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});
exports.loginUser = loginUser;
// Obtener todos los usuarios
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserModel_1.default.find();
        return res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
});
exports.getUsers = getUsers;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const header = req.header("Authorization") || "";
        const token = header;
        let decoded;
        try {
            // Decodificar el token para obtener el userId
            decoded = jsonwebtoken_1.default.verify(token, secret); // Usa la misma clave secreta del login
        }
        catch (error) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        const userId = decoded.id; // Obtener el id del usuario desde el payload del token
        // Invalida el token agregándolo a un Set (esto simula la revocación)
        invalidatedTokens.add(token);
        // Si es un token válido, simplemente devuelve un mensaje de logout exitoso
        return res.status(200).json({ message: `Logout exitoso para el usuario ${userId}` });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al realizar el logout' });
    }
});
exports.logoutUser = logoutUser;
// Obtener un usuario por su ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findById(req.params.id).select('-_id -actividad -password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener el usuario' });
    }
});
exports.getUserById = getUserById;
// Actualizar un usuario por su ID
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});
exports.updateUser = updateUser;
// Eliminar un usuario por su ID
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});
exports.deleteUser = deleteUser;
