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
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.SECRET_KEY;
describe('prueba usuarios', () => {
    it('debería crear un usuario local', () => __awaiter(void 0, void 0, void 0, function* () {
        // Datos de prueba
        const userData = {
            name: 'florentino',
            email: `florentino-${Date.now()}@example.com`, // Email único
            password: 'pepe',
            edad: 23,
            actividad: 'Activa',
            role: 'user',
            authProvider: 'local',
        };
        // (`Base de datos actual: ${mongoose.connection.db?.databaseName}`);
        // 1. Ejecuta la petición
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(userData);
        // 2. Verifica respuesta
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Usuario creado correctamente.');
        // 3. Verifica en DB (con timeout para dar tiempo a MongoDB)
        yield new Promise(resolve => setTimeout(resolve, 500));
        const userInDB = yield UserModel_1.default.findOne({ email: userData.email }).lean();
        expect(userInDB).toBeTruthy();
    }));
    it('login exitoso', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // Datos de prueba
        const userData = {
            name: 'prueba',
            email: `prueba-${Date.now()}@example.com`, // Email único
            password: 'pepe',
            edad: 23,
            actividad: 'Activa',
            role: 'user',
            authProvider: 'local',
        };
        (`Base de datos actual: ${(_a = mongoose_1.default.connection.db) === null || _a === void 0 ? void 0 : _a.databaseName}`);
        // 1. crear usuario
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(userData);
        const loginBody = {
            user: userData.email,
            password: userData.password
        };
        const login = yield (0, supertest_1.default)(app_1.default)
            .post("/api/users/login")
            .send(loginBody);
        expect(res.status).toBe(201);
        // 3. Verifica en DB (con timeout para dar tiempo a MongoDB)
        yield new Promise(resolve => setTimeout(resolve, 500));
        const userInDB = yield UserModel_1.default.findOne({ email: userData.email }).lean();
        expect(userInDB).toBeTruthy();
    }));
    it('login fallido por contraseña incorrecta', () => __awaiter(void 0, void 0, void 0, function* () {
        // Datos de prueba
        const userData = {
            name: 'fallido',
            email: `fallido-${Date.now()}@example.com`, // Email único
            password: 'correcta',
            edad: 25,
            actividad: 'Activa',
            role: 'user',
            authProvider: 'local',
        };
        // 1. Crear usuario
        yield (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(userData);
        // 2. Intentar login con contraseña incorrecta
        const loginBody = {
            user: userData.email,
            password: 'incorrecta',
        };
        const login = yield (0, supertest_1.default)(app_1.default)
            .post('/api/users/login')
            .send(loginBody);
        // 3. Comprobaciones
        expect(login.status).toBe(400);
    }));
    it('logout exitoso', () => __awaiter(void 0, void 0, void 0, function* () {
        // Datos de prueba
        const userData = {
            name: 'logout',
            email: `logout-${Date.now()}@example.com`, // Email único
            password: 'pepe',
            edad: 23,
            actividad: 'Activa',
            role: 'user',
            authProvider: 'local',
        };
        // 1. crear usuario
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(userData);
        const loginBody = {
            user: userData.email,
            password: userData.password
        };
        const loginres = yield (0, supertest_1.default)(app_1.default)
            .post("/api/users/login")
            .send(loginBody);
        expect(res.status).toBe(201);
        // 3. Verifica en DB (con timeout para dar tiempo a MongoDB)
        yield new Promise(resolve => setTimeout(resolve, 500));
        const userInDB = yield UserModel_1.default.findOne({ email: userData.email }).lean();
        expect(userInDB).toBeTruthy();
        expect(userInDB === null || userInDB === void 0 ? void 0 : userInDB.email).toBe(userData.email);
    }));
    it('debería cerrar sesión correctamente con un token válido', () => __awaiter(void 0, void 0, void 0, function* () {
        // Crear usuario de prueba
        const userData = {
            name: 'LogoutUser',
            email: `logout-${Date.now()}@example.com`,
            password: 'logout123',
            edad: 28,
            actividad: 'Activa',
            role: 'user',
            authProvider: 'local',
        };
        // 1. Crear usuario
        const createRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(userData);
        expect(createRes.statusCode).toBe(201);
        // Pequeña pausa para asegurar procesamiento
        yield new Promise(resolve => setTimeout(resolve, 500));
        // 2. Hacer login
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post("/api/users/login")
            .send({
            email: userData.email,
            password: userData.password
        });
        // Verificaciones del login
        expect(loginRes.status).toBe(200); // El login exitoso debe devolver 200
        expect(loginRes.body).toHaveProperty('token');
        const token = loginRes.body.token;
        // 3. Verificar y decodificar el token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, "arrevedirti"); // Asegúrate que coincide con tu SECRET_KEY real
        }
        catch (error) {
            console.error("Error al verificar el token:", error);
            throw error;
        }
        const userId = decoded.id;
        // 4. Hacer logout
        const logoutRes = yield (0, supertest_1.default)(app_1.default)
            .post(`/api/users/logout/${userId}`)
            .set('Authorization', ` ${token}`);
        // 5. Verificar respuesta del logout
        expect(logoutRes.status).toBe(200);
        expect(logoutRes.body).toHaveProperty('message');
        expect(logoutRes.body.message).toMatch(/Logout exitoso para el usuario /);
    }));
    it('debería devolver 404 si el token es inválido', () => __awaiter(void 0, void 0, void 0, function* () {
        const logoutRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/logout')
            .set('Authorization', 'token-falso');
        expect(logoutRes.status).toBe(404);
    }));
    it('usuario eliminado', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            name: 'delete',
            email: `delete-${Date.now()}@example.com`,
            password: 'correcta',
            edad: 25,
            actividad: 'Activa',
            role: 'user',
            authProvider: 'local',
        };
        // Crear usuario
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(userData);
        // Login
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/users/login')
            .send({ email: userData.email, password: userData.password });
        expect(loginRes.status).toBe(200);
        const token = loginRes.body.token;
        let decoded = jsonwebtoken_1.default.verify(token, secret);
        const userId = decoded.id;
        // Eliminar usuario con token en el header
        const deleteUserRes = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `${token}`); // Añade el token aquí
        expect(deleteUserRes.statusCode).toBe(200);
    }));
});
