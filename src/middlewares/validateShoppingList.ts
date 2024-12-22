// src/middlewares/validateShoppingList.ts
import { Request, Response, NextFunction } from 'express';

export const validateShoppingList = (req: Request, res: Response, next: NextFunction):any => {
  const { userId, productIds, name } = req.body;

  if (!userId || !productIds || !Array.isArray(productIds) || productIds.length === 0 || !name) {
    return res.status(400).json({ message: 'Faltan campos requeridos o el formato es incorrecto' });
  }

  next();
};
