// src/controllers/shoppingListController.ts
import { Request, Response } from 'express';
import ShoppingListModel from '../models/ShoppingListModel';
import jwt from 'jsonwebtoken';
import { generateCodelist } from '../utils/generateCodeList';
import ProductModel from '../models/ProductModel';
const secretKey = 'tu_clave_secreta';

interface JwtPayload {
  id: string;
}

export const createShoppingList = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.header("Authorization") || "";
    const payload = jwt.verify(token, secretKey) as JwtPayload;
    const userId = payload.id;

    const shoppingList = new ShoppingListModel({
      ...req.body,
      code: generateCodelist(),
      userIds: [userId],
    });

    await shoppingList.save();
    return res.status(201).json(shoppingList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la lista de compra' });
  }
};

export const joinShoppingList = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.header("Authorization") || "";
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    const userId = decoded.id;
    const { code } = req.body;

    const shoppingList = await ShoppingListModel.findOne({ code });
    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compra no encontrada' });
    }

    if (!shoppingList.userIds.includes(userId)) {
      shoppingList.userIds.push(userId);
      await shoppingList.save();
    }

    return res.status(200).json({ message: 'Usuario agregado a la lista', shoppingList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al unirse a la lista de compras' });
  }
};

export const addProductsToShoppingList = async (req: Request, res: Response): Promise<any> => {
  try {
    const { products } = req.body; 
    const shoppingListId = req.params.id;

    const shoppingList = await ShoppingListModel.findById(shoppingListId);
    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compras no encontrada' });
    }

    products.forEach(({ productId, note }: { productId: string; note?: string }) => {
      const existingProductIndex = shoppingList.products.findIndex(p => p.productId.toString() === productId);
      if (existingProductIndex !== -1) {
        // Actualiza la nota si ya existe el producto
        shoppingList.products[existingProductIndex].note = note;
      } else {
        // Añadir el producto sin _id adicional
        shoppingList.products.push({ productId, note: note || '' });
      }
    });

    await shoppingList.save();
    return res.status(200).json({ 
      message: 'Productos agregados', 
      updatedProducts: shoppingList.products.map(({ productId, note }) => ({ productId, note })) 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al agregar productos' });
  }
};



export const removeProductFromShoppingList = async (req: Request, res: Response): Promise<any> => {
  try {
    const shoppingListId = req.params.id;
    const productId = req.body.productId;

    const shoppingList = await ShoppingListModel.findById(shoppingListId);
    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compras no encontrada' });
    }

    shoppingList.products = shoppingList.products.filter(p => p.productId.toString() !== productId);
    await shoppingList.save();

    return res.status(200).json({ message: 'Producto eliminado', updatedProducts: shoppingList.products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar producto' });
  }
};

export const getShoppingListById = async (req: Request, res: Response): Promise<any> => {
  try {
    const shoppingList = await ShoppingListModel.findById(req.params.id)
      .populate({ path: 'userIds', select: 'name' })
      .populate({ path: 'products.productId', select: 'name category' });

    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de la compra no encontrada' });
    }

    const response = {
      name: shoppingList.name,
      createdAt: shoppingList.createdAt,
      updatedAt: shoppingList.updatedAt,
      users: shoppingList.userIds.map((user: any) => ({ name: user.name })),
      products: shoppingList.products.map((p: any) => ({
        name: p.productId.name,
        category: p.productId.category,
        note: p.note,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la lista de la compra' });
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
}
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
// Obtener todas las listas de la compra
export const getShoppingLists = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Se requiere un userId' });
    }

    // Obtener las listas de compra y poblar los productos
    const shoppingLists = await ShoppingListModel.find({ userIds: id })
    .populate({
      path: 'products.productId',
      select: 'name category',
      populate: {
        path: 'category', // Si category es un ObjectId que referencia otro modelo
        select: 'name', // Ajusta según los campos que quieras traer
      },
    });

    res.status(200).json(shoppingLists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las listas de compra' });
  }
};
export const clearProductsFromShoppingList = async (req: Request, res: Response): Promise<any> => {
  try {
    const shoppingListId: string = req.params.id;

    console.log("ID de la lista a limpiar:", shoppingListId);

    // Buscar la lista de compras
    const shoppingList = await ShoppingListModel.findById(shoppingListId);

    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compras no encontrada.' });
    }

    // Vaciar el array de productIds
    shoppingList.products = [];

    // Guardar la lista actualizada
    await shoppingList.save();

    return res.status(200).json({
      message: 'Todos los productos han sido eliminados de la lista.',
      updatedProductIds: shoppingList.products,
    });
  } catch (error) {
    console.error('Error al vaciar los productos de la lista de compras:', error);
    return res.status(500).json({ message: 'Error al vaciar los productos de la lista de compras.' });
  }
};