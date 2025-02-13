// src/middlewares/validateShoppingList.ts
import { Request, Response, NextFunction } from 'express';

export const validateShoppingList = (req: Request, res: Response, next: NextFunction):any => {
  const {   name } = req.body;
  const {id}=req.params
  if (   !name) {
    return res.status(400).json({ message: 'Faltan campo nombre' });
  }
  if(id==undefined ) {
    return res.status(400).json({ message: 'id invalido' });
  }

  next();
};
