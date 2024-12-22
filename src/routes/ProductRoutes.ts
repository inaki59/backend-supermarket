import express from 'express';

import { validateProduct } from '../middlewares';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers';


export const routerProduct = express.Router();

// Rutas para productos con validación y controladores
routerProduct.post('/', validateProduct, createProduct);      // Crear producto
routerProduct.get('/', getProducts);                          // Obtener todos los productos
routerProduct.get('/:id', getProductById);                    // Obtener producto por ID
routerProduct.put('/:id', validateProduct, updateProduct);    // Actualizar producto
routerProduct.delete('/:id', deleteProduct);                  // Eliminar producto


