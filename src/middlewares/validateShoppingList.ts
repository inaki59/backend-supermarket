// src/middlewares/validateShoppingList.ts
import { Request, Response, NextFunction } from 'express';

export const validateShoppingList = (req: Request, res: Response, next: NextFunction):any => {
  const {   name } = req.body;

  if (   !name) {
    return res.status(400).json({ message: 'Faltan campo nombre' });
  }

  next();
};
