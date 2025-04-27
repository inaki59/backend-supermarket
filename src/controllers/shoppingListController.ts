// src/controllers/shoppingListController.ts
import { Request, Response } from 'express';
import ShoppingListModel from '../models/ShoppingListModel';
import jwt from 'jsonwebtoken';
import { generateCodelist } from '../utils/generateCodeList';
import ProductModel from '../models/ProductModel';
import { PurchaseHistoryModel } from '../models/PurcharseHostoryDocument';

const secretKey = process.env.SECRET_KEY as string; 
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
    const productIds = req.body.productIds; // Ahora esperamos un array de IDs

    // Validar que productIds sea un array
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ message: 'productIds debe ser un array' });
    }

    // Buscar la lista de compras
    const shoppingList = await ShoppingListModel.findById(shoppingListId);
    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compras no encontrada' });
    }

    // Filtrar los productos que NO están en la lista de productIds
    shoppingList.products = shoppingList.products.filter(
      (p) => !productIds.includes(p.productId.toString())
    );

    // Guardar la lista actualizada
    await shoppingList.save();

    return res.status(200).json({ message: 'Productos eliminados', updatedProducts: shoppingList.products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar productos' });
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
        _id: p.productId._id,
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
export const updateProductInShoppingList = async (req: Request, res: Response): Promise<any> => {
  try {
    const { listId, productId } = req.params;
    const updatedProductData = req.body;

    const shoppingList = await ShoppingListModel.findOneAndUpdate(
      { _id: listId, "products.productId": productId },
      {
        $set: {
          "products.$.note": updatedProductData.note,
          // Aquí puedes añadir más campos si los quieres actualizar
        }
      },
      { new: true }
    );

    if (!shoppingList) {
      return res.status(404).json({ message: 'Producto o lista no encontrada' });
    }

    res.status(200).json(shoppingList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto en la lista de compra' });
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

    // Buscar la lista de compras
    const shoppingList = await ShoppingListModel.findById(shoppingListId);

    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compras no encontrada.' });
    }
    // Crear registro en el historial de compras antes de limpiar
    const purchaseHistoryEntry = new PurchaseHistoryModel({
      listId: shoppingList._id,
      listName: shoppingList.name,
      users: shoppingList.userIds,
      products: shoppingList.products.map(product => ({
        productId: product.productId,
        note: product.note || 'Sin nota' 
      })),
      purchasedAt: new Date()
    });

    // Guardar el historial
    await purchaseHistoryEntry.save();

    // Vaciar el array de productos
    shoppingList.products = [];

    // Guardar la lista actualizada
    await shoppingList.save();

    return res.status(200).json({
      message: 'Todos los productos han sido eliminados de la lista y guardados en el historial.',
      updatedProductIds: shoppingList.products,
      purchaseHistoryId: purchaseHistoryEntry._id
    });
  } catch (error) {
    console.error('Error al vaciar los productos de la lista de compras:', error);
    return res.status(500).json({ 
      message: 'Error al vaciar los productos de la lista de compras.',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};
export const getMobilePurchaseHistory = async (req: Request, res: Response): Promise<any> => {
  try {
    const listId = req.params.listId;

    // Validación rápida de ID


    // Consulta optimizada para móvil
    const histories = await PurchaseHistoryModel.find({ listId })
    .select('_id purchasedAt products.productId products.note') // Proyección estilo Mongoose
    .populate({
      path: 'products.productId',
      select: 'name',
      model: 'Product' // Asegúrate que coincida con tu modelo
    })
    .sort({ purchasedAt: -1 })
    .limit(50)
    .lean(); // lean() siempre al final
  
  if (!histories.length) {
    return res.status(200).json({ 
      success: true,
      data: [],
      message: 'NO_HISTORIAL'
    });
  }
  

    // Respuesta minimalista
    return res.status(200).json({
      success: true,
      data: histories.map(h => ({
        id: h._id,
        date: h.purchasedAt,
        products: h.products.map(p => ({
          id: p.productId,
          note: p.note || "NA"
        }))
      }))
    });

  } catch (error) {
    console.error('Error móvil:', error);
    return res.status(500).json({ 
      success: false,
      error: 'ERROR_SERVIDOR'
    });
  }
};