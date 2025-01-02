import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const invalidatedTokens: Set<string> = new Set();
// Crear un usuario
export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    // Verificamos si la contraseña está presente en el cuerpo de la solicitud
    const { name, email, password, edad, actividad, role ,auth0Id} = req.body;

    if (!password || !auth0Id || !email) {
      return res.status(400).json({ message: 'La contraseña, auth0Id, email es requerida' });
    }

    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario con la contraseña encriptada
    const user = new UserModel({
      name,
      email,
      auth0Id,
      password: hashedPassword,
      edad,
      actividad,
      role,
    });
    // evita duplicados
    const existemail=await UserModel.findOne({ email });
    const existAuth=await UserModel.findOne({ auth0Id });
    if (existAuth || existemail) {
      return res.status(404).json({ message: 'mail o auth ya creados' });
    }
    await user.save();
    return res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

// Login de usuario
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    
    // Buscar el usuario por el correo
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña encriptada con la proporcionada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear un JWT (Json Web Token) para el usuario
    const token = jwt.sign(
      { id: user._id, email: user.email },
      'tu_clave_secreta',  // Aquí va tu clave secreta
      { expiresIn: '1h' }  // Opcional, establece un tiempo de expiración para el token
    );

    return res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};


// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await UserModel.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};
export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const header = req.header("Authorization") || "";
    const token = header

    let decoded: any;

    try {
      // Decodificar el token para obtener el userId
      decoded = jwt.verify(token, 'tu_clave_secreta'); // Usa la misma clave secreta del login
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    const userId = decoded.id; // Obtener el id del usuario desde el payload del token

    // Invalida el token agregándolo a un Set (esto simula la revocación)
    invalidatedTokens.add(token);

    // Si es un token válido, simplemente devuelve un mensaje de logout exitoso
    return res.status(200).json({ message: `Logout exitoso para el usuario ${userId}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al realizar el logout' });
  }
};
// Obtener un usuario por su ID
export const getUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

// Actualizar un usuario por su ID
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

// Eliminar un usuario por su ID
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};
