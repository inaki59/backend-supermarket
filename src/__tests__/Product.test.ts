import app from "../app"; 
import request from 'supertest';
import mongoose from 'mongoose';
import UserModel from "../models/UserModel";
import jwt from 'jsonwebtoken';
import ProductModel from "../models/ProductModel";
const secret = process.env.SECRET_KEY as string; 

describe('prueba productos', () => {
    it('creación de un producto', async () => {
        const product={
            name: `Test Product ${Date.now()}`, 
            category: 'Lacteos',
            price: 5.44,
            defaultQuantity:2
        }
        const  createProducRes=await request(app)
        .post("/api/products/")
        .send(product)

        expect(createProducRes.statusCode).toBe(201)
    });

    
      it('filtrar productos por categoría', async () => {
        const response = await request(app)
          .get('/api/products?category=Lacteos')
          .expect(200);

        expect(response.body.products.every((p: any) => p.category === 'Lacteos')).toBeTruthy();
      }); 
      it('actualización de un producto', async () => {
        // 1. Crear producto
        const productData = {
            name: `Test Product ${Date.now()}`,
            category: 'Lacteos',
            price: 5.44,
            defaultQuantity: 1
        };
    
        // Crear directamente en la DB para asegurar el ID
        const createdProduct:any = await ProductModel.create(productData);
        const productId = createdProduct._id.toString();
        console.log("el product id es ",productId)
        // 2. Actualizar producto
        const updatedData = {
            name: 'Producto Actualizado',
            category: 'Lacteos',
            price: 5.44,
            defaultQuantity: 1
        };
    
        const response = await request(app)
            .put(`/api/products/${productId}`)
            .send(updatedData);
    
        // 3. Verificar respuesta
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedData.name);
        expect(response.body.price).toBe(updatedData.price);
    
        // 4. Verificar en la base de datos
        const updatedProduct = await ProductModel.findById(productId);
        expect(updatedProduct?.name).toBe(updatedData.name);
        expect(updatedProduct?.price).toBe(updatedData.price);
    });
      

    
      it('error al eliminar producto inexistente', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .delete(`/api/products/${fakeId}`)
          .expect(404);
    
        expect(response.body.message).toBe('Producto no encontrado');
      });
    
      it('error al eliminar con ID inválido', async () => {
        const response = await request(app)
          .delete('/api/products/id-invalido')
          .expect(500);
    
        expect(response.body.message).toBe('Error al eliminar el producto');
      });
      it('eliminación de un producto', async () => {
        // 1. Crear producto
        const productData = {
            name: `Test Product-delete ${Date.now()}`,
            category: 'Lacteos',
            price: 5.44,
            defaultQuantity: 1
        };
      
        const createRes = await request(app)
          .post("/api/products/")
          .send(productData);
      
        expect(createRes.statusCode).toBe(201);
      
        // 2. Buscar el producto en la base de datos
        const createdProduct = await ProductModel.findOne({ name: productData.name });
        expect(createdProduct).not.toBeNull(); // nos aseguramos que existe
      
        const productId = createdProduct!._id; // el "!" indica que estamos seguros de que no es null
      
        // 3. Eliminar el producto
        const deleteRes = await request(app)
          .delete(`/api/products/${productId}`);
      
        expect(deleteRes.statusCode).toBe(200); // o 204 si tu API no devuelve contenido
      
        // 4. Confirmar que ya no existe en base de datos
        const deletedProduct = await ProductModel.findById(productId);
        expect(deletedProduct).toBeNull();
      });
});

      