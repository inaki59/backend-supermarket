export interface ShoppingListInterface {
    name: string;  // Nombre de la lista (por ejemplo, "Semana 1")
    userIds: string[];  // IDs de los usuarios asociados a la lista
    productIds: string[];  // IDs de los productos que están en la lista
    createdAt?: Date;  // Fecha de creación de la lista (opcional, puede ser manejado por Mongoose)
    updatedAt?: Date;  // Fecha de la última actualización (opcional, también por Mongoose)
  }
  // src/controllers/shoppingListController.ts
import { Request, Response } from 'express';
import ShoppingListModel from '../models/ShoppingListModel';

// Crear una nueva lista de la compra
export const createShoppingList = async (req: Request, res: Response) => {
  try {
    const shoppingList = new ShoppingListModel(req.body);
    await shoppingList.save();
    res.status(201).json(shoppingList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la lista de compra' });
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
export const getShoppingListById = async (req: Request, res: Response) => {
  try {
    const shoppingList = await ShoppingListModel.findById(req.params.id);
    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compra no encontrada' });
    }
    res.status(200).json(shoppingList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la lista de compra' });
  }
};

// Actualizar una lista de la compra por su ID
export const updateShoppingList = async (req: Request, res: Response) => {
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
export const deleteShoppingList = async (req: Request, res: Response) => {
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
