// src/controllers/shoppingListController.ts
import { Request, Response } from 'express';
import ShoppingListModel from '../models/ShoppingListModel';
import jwt from 'jsonwebtoken';
import { generateCodelist } from '../utils/generateCodeList';
import ProductModel from '../models/ProductModel';
const secretKey = 'tu_clave_secreta';

interface JwtPayload {
  username: string;
}

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
  const { code } = req.body;  

  try {
    const header = req.header("Authorization") || "";
    const token = header
    const decoded = jwt.verify(token, 'tu_clave_secreta') as { id: string };
    const userId = decoded.id;

    // Buscamos la lista de compras por el código
    const shoppingList = await ShoppingListModel.findOne({ code });
   
    shoppingList!.userIds.push(userId);
    await shoppingList!.save();

    return res.status(200).json({ message: 'Usuario agregado exitosamente a la lista', shoppingList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al unirse a la lista de compras' });
  }
};



export const addProductsToShoppingList = async (req: Request, res: Response): Promise<any> => {
  try {
    const { productIds } = req.body;
     let shoppingListId:string = req.params.id;  
      console.log("parametros ",req.params)

    console.log("id a buscar ",shoppingListId )
    const shoppingList = await ShoppingListModel.findById(shoppingListId);

    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compras no encontrada.' });
    }

    // Buscamos los productos en la base de datos
    const products = await ProductModel.find({ '_id': { $in: productIds } });

    // Extraemos los ids de los productos encontrados
    const foundProductIds = products.map(product => product.id.toString());

    // Agregamos los ids de los productos a la lista de compras, evitando duplicados
    const updatedProductIds = [...new Set([...shoppingList.productIds, ...foundProductIds])];

    // Actualizamos la lista de compras con los nuevos ids de productos
    shoppingList.productIds = updatedProductIds;

    // Guardamos la lista de compras actualizada
    await shoppingList.save();

    return res.status(200).json({
      message: 'Productos agregados exitosamente a la lista.',
      updatedProductIds: shoppingList.productIds,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al agregar productos a la lista de compras.' });
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
    shoppingList.productIds = [];

    // Guardar la lista actualizada
    await shoppingList.save();

    return res.status(200).json({
      message: 'Todos los productos han sido eliminados de la lista.',
      updatedProductIds: shoppingList.productIds,
    });
  } catch (error) {
    console.error('Error al vaciar los productos de la lista de compras:', error);
    return res.status(500).json({ message: 'Error al vaciar los productos de la lista de compras.' });
  }
};
export const removeProductFromShoppingList = async (req: Request, res: Response): Promise<any> => {
  try {
    const shoppingListId: string = req.params.id;
    const productId: string = req.body.productId; 

    // Buscar la lista de compras
    const shoppingList = await ShoppingListModel.findById(shoppingListId);

    if (!shoppingList) {
      return res.status(404).json({ message: 'Lista de compras no encontrada.' });
    }

    // Verificar si el productId existe en la lista
    const productExists = shoppingList.productIds.some(id => id.toString() === productId);

    if (!productExists) {
      return res.status(400).json({ message: 'El producto no existe en la lista.' });
    }

    // Eliminar el productId del array
    shoppingList.productIds = shoppingList.productIds.filter(id => id.toString() !== productId);

    // Guardar la lista actualizada
    await shoppingList.save();

    return res.status(200).json({
      message: 'Producto eliminado exitosamente de la lista.',
      updatedProductIds: shoppingList.productIds,
    });
  } catch (error) {
    console.error('Error al eliminar el producto de la lista de compras:', error);
    return res.status(500).json({ message: 'Error al eliminar el producto de la lista de compras.' });
  }
};


// Obtener todas las listas de la compra
export const getShoppingLists = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Se requiere un userId' });
    }
    const shoppingLists = await ShoppingListModel.find({ userIds: id });
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
