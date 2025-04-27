import { Request, Response, NextFunction } from 'express';
import ShoppingListModel from '../models/ShoppingListModel';
import jwt from 'jsonwebtoken';
const secretKey =  process.env.SECRET_KEY as string; 
export const checkgroupAccess =async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;
      const header = req.header("Authorization") || "";
        const token = header
        const payload = jwt.verify(token, secretKey) as { id: string };

    const userId = payload.id; 
    const shoppingList = await ShoppingListModel.findOne({ code });
    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compras no encontrada o código inválido' });
    }
    if (shoppingList.userIds.includes(userId)) {
      return res.status(400).json({ message: 'El usuario ya está en esta lista' });
    }
  next(); 
};
