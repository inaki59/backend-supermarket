import { Request, Response, NextFunction } from 'express';
import ShoppingListModel from '../models/ShoppingListModel';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
const secretKey = 'tu_clave_secreta';
export const checkUserInShoppingList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productIds } = req.body;
     const header = req.header("Authorization") || "";
            const token = header
            const payload = jwt.verify(token, secretKey) as { id: string };
    
        const userId = payload.id; 
    const listId  = req.params.id

    if (!listId) {
      return res.status(400).json({ message: 'El ID de la lista es obligatorio.' });
    }
   
    // if (!productIds || !Array.isArray(productIds)) {
    //   return res.status(400).json({ message: 'Se requiere un array de productIds.' });
    // }
  
    console.log(listId)
    if (!mongoose.Types.ObjectId.isValid(listId)) {
        return res.status(400).json({ message: 'El ID de la lista de compras no es válido.' });
      }
    // Buscar la lista de compras por `_id`
    const shoppingList = await ShoppingListModel.findById(listId);
  
    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compras no encontrada.' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }

    // Comprobar si el usuario está en la lista
    if (!shoppingList.userIds.includes(userId)) {
      return res.status(403).json({ message: 'No tienes permisos para modificar esta lista de compras.' });
    }


    next(); // Usuario tiene acceso, pasamos al siguiente middleware/controlador
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al comprobar acceso a la lista de compras.' });
  }
};
