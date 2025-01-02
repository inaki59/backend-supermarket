// src/controllers/shoppingListController.ts
import { Request, Response } from 'express';
import ShoppingListModel from '../models/ShoppingListModel';
import jwt from 'jsonwebtoken';
import { generateCodelist } from '../utils/generateCodeList';
const secretKey = 'tu_clave_secreta';

interface JwtPayload {
  username: string;
}
// Crear una nueva lista de la compra
export const createShoppingList = async (req: Request, res: Response):Promise<any> => {
  try {
    const header = req.header("Authorization") || "";
    const token = header
    const payload = jwt.verify(token, secretKey) as { id: string };
// Obtener el id del usuario desde el payload
const userId = payload.id;
console.log(userId);
// Crear la lista de compras asociada al usuario
const shoppingList = new ShoppingListModel({
  ...req.body,
  code:generateCodelist(),
  userIds: userId, 
});

await shoppingList.save();
return res.status(201).json(shoppingList);  // Retorna la lista de compras creada
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la lista de compra' });
  }
};

export const joinShoppingList = async (req: Request, res: Response): Promise<any> => {
  const { code } = req.body;  // El código de la lista que se pasa en el body

  if (!code) {
    return res.status(400).json({ message: 'Se requiere el código de la lista' });
  }

  try {
    // Verificamos que el token esté presente en los encabezados
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    // Verificamos el token y extraemos el ID del usuario
    const decoded = jwt.verify(token, 'tu_clave_secreta') as { id: string };
    const userId = decoded.id;

    // Buscamos la lista de compras por el código
    const shoppingList = await ShoppingListModel.findOne({ code });
    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compras no encontrada o código inválido' });
    }
    if (shoppingList.userIds.includes(userId)) {
      return res.status(400).json({ message: 'El usuario ya está en esta lista' });
    }
    shoppingList.userIds.push(userId);
    await shoppingList.save();

    return res.status(200).json({ message: 'Usuario agregado exitosamente a la lista', shoppingList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al unirse a la lista de compras' });
  }
};

// Obtener todas las listas de la compra
export const getShoppingLists = async (req: Request, res: Response) => {
  try {
    const shoppingLists = await ShoppingListModel.find();
    res.status(200).json(shoppingLists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las listas de compra' });
  }
};

// Obtener una lista de la compra por su ID
export const getShoppingListById = async (req: Request, res: Response):Promise<any> => {
  try {
    const shoppingList = await ShoppingListModel.findById(req.params.id)
      .populate({
        path: 'userIds',
        select: 'name',
      })
      .populate({
        path: 'productIds',
        select: 'name category',
      });

    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de la compra no encontrada' });
    }

    const response = {
      name: shoppingList.name,
      createdAt: shoppingList.createdAt,
      updatedAt: shoppingList.updatedAt,
      users: shoppingList.userIds.map((user: any) => ({
        name: user.name,
      })),
      products: shoppingList.productIds.map((product: any) => ({
        name: product.name,
        category: product.category,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la lista de la compra' });
  }
};


// Actualizar una lista de la compra por su ID
export const updateShoppingList = async (req: Request, res: Response):Promise<any> => {
  try {
    const shoppingList = await ShoppingListModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compra no encontrada' });
    }
    res.status(200).json(shoppingList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la lista de compra' });
  }
};

// Eliminar una lista de la compra por su ID
export const deleteShoppingList = async (req: Request, res: Response):Promise<any> => {
  try {
    const shoppingList = await ShoppingListModel.findByIdAndDelete(req.params.id);
    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compra no encontrada' });
    }
    res.status(200).json({ message: 'Lista de compra eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la lista de compra' });
  }
};
