import { Request, Response } from 'express';
import ProductModel from '../models/ProductModel';

// Crear un producto
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
};


export const getProducts = async (req: Request, res: Response) => {
  try {
    // Obtén los parámetros de query
    const { page = 1, limit = 10, category } = req.query;

    // Construye el filtro dinámico
    const filter: any = {};
    if (category) {
      filter.category = category; // Filtra por categoría si está presente
    }

    // Calcula el índice de inicio para la paginación
    const skip = (Number(page) - 1) * Number(limit);

    // Obtén los productos con filtro y paginación
    const products = await ProductModel.find(filter).skip(skip).limit(Number(limit));

    // Cuenta el total de productos que coinciden con el filtro
    const totalProducts = await ProductModel.countDocuments(filter);

    // Responde con los datos filtrados y paginados
    res.status(200).json({
      total: totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};



// Obtener un producto por su ID
export const getProductById = async (req: Request, res: Response):Promise<any> => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

// Actualizar un producto por su ID
export const updateProduct = async (req: Request, res: Response):Promise<any> => {
  try {
    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto por su ID
export const deleteProduct = async (req: Request, res: Response):Promise<any> => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};
