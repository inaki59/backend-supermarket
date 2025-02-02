// src/middleware/checkEmailExists.ts
import { Request, Response, NextFunction } from 'express';
import User from '../models/UserModel'; 

export const checkEmailExists = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'El campo "email" es requerido.' });
  }
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }
    next();
  } catch (error) {
    console.error('Error verificando el correo:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
