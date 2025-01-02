// src/middleware/validateUser.ts
import { Request, Response, NextFunction } from 'express';

export const validateUser = (req: Request, res: Response, next: NextFunction): any => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Faltan campos requeridos: name y auth0Id' });
  }

  next();
};
