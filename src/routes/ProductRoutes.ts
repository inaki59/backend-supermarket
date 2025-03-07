import express from 'express';
import multer from 'multer';
import { fileSizeLimiter, validateProduct } from '../middlewares';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, uploadProductsCSV } from '../controllers';


export const routerProduct = express.Router();

// Rutas para productos con validación y controladores
routerProduct.post('/', validateProduct, createProduct);     
routerProduct.get('/', getProducts);                          
routerProduct.get('/:id', getProductById);                
routerProduct.put('/:id', validateProduct, updateProduct);    
routerProduct.delete('/:id', deleteProduct);               
routerProduct.post('/upload-csv',fileSizeLimiter, uploadProductsCSV
);
