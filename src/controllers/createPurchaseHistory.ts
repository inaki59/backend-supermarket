import { Request, Response } from 'express';
import { PurchaseHistoryModel } from '../models/PurcharseHostoryDocument';

// Crear un historial de compra
export const createPurchaseHistory = async (req: Request, res: Response) => {
  try {
    const { listId, listName, users, products, purchasedAt } = req.body;

    const newHistory = new PurchaseHistoryModel({
      listId,
      listName,
      users,
      products,
      purchasedAt,
    });

    const savedHistory = await newHistory.save();
    res.status(201).json(savedHistory);
  } catch (error) {
    res.status(500).json({ error: 'Error creando el historial de compra' });
  }
};

// Obtener todos los historiales
export const getAllPurchaseHistories = async (_req: Request, res: Response) => {
  try {
    const histories = await PurchaseHistoryModel.find();
    res.status(200).json(histories);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo los historiales de compra' });
  }
};

// Obtener un historial por ID
export const getPurchaseHistoryById = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;
    const history = await PurchaseHistoryModel.findById(id);

    if (!history) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo el historial de compra' });
  }
};

// Actualizar un historial
export const updatePurchaseHistory = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedHistory = await PurchaseHistoryModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedHistory) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }

    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando el historial de compra' });
  }
};

// Eliminar un historial
export const deletePurchaseHistory = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;

    const deletedHistory = await PurchaseHistoryModel.findByIdAndDelete(id);

    if (!deletedHistory) {
      return res.status(404).json({ error: 'Historial no encontrado' });
    }

    res.status(200).json({ message: 'Historial eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando el historial de compra' });
  }
};
