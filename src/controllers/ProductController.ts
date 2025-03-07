import { Request, Response } from 'express';
import ProductModel from '../models/ProductModel';
import fs from 'fs';
import csv from 'csv-parser';
import { ProductInterface } from '../interfaces/ProductInteface';
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
export const uploadProductsCSV = async (req: Request, res: Response):Promise<any> => {
  console.log("llegamos hasta el controlador")
  try {
    // Si se sube un archivo CSV
    if (req.file) {
      const products: ProductInterface[] = [];
    
      const filePath = req.file.path;
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row: Partial<ProductInterface>) => {
          const product: ProductInterface = {
            name: row.name ?? '',
            category: row.category ?? '',
            price: parseFloat(row.price?.toString() || '0'),
            defaultQuantity: parseInt(row.defaultQuantity?.toString() || '1', 10)
          };
          products.push(product);
        })
        .on('end', async () => {
          try {
            await ProductModel.insertMany(products, { ordered: false });
            res.status(201).json({ message: 'Productos importados correctamente', productos: products.length });
          } catch (error) {
            console.error('Error al guardar productos:', error);
            res.status(500).json({ message: 'Error al guardar los productos en la base de datos' });
          } finally {
            fs.unlinkSync(filePath); // Eliminar el archivo temporal
          }
        });
    } else {
      // Si no se sube un archivo CSV, crear un solo producto
      const product = new ProductModel({
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await product.save();
      res.status(201).json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
};



export const getProducts = async (req: Request, res: Response) => {
  try {
    // Obtén los parámetros de query
    const { page = 1, limit = 10, category, name } = req.query;

    // Construye el filtro dinámico
    const filter: any = {};

    // Filtro por categoría
    if (category) {
      if (Array.isArray(category)) {
        filter.category = { $in: category }; // Si 'category' es un array
      } else if (typeof category === 'string' && category.includes(',')) {
        filter.category = { $in: category.split(',') }; // Si es una cadena separada por comas
      } else {
        filter.category = category; // Si es una sola categoría
      }
    }

    // Filtro por nombre (si se pasa un nombre en la query)
    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // 'i' es para hacerlo case-insensitive
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
