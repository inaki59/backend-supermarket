"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const secret = process.env.SECRET_KEY;
describe('prueba productos', () => {
    it('creación de un producto', () => __awaiter(void 0, void 0, void 0, function* () {
        const product = {
            name: `Test Product ${Date.now()}`,
            category: 'Lacteos',
            price: 5.44,
            defaultQuantity: 2
        };
        const createProducRes = yield (0, supertest_1.default)(app_1.default)
            .post("/api/products/")
            .send(product);
        expect(createProducRes.statusCode).toBe(201);
    }));
    it('filtrar productos por categoría', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/products?category=Lacteos')
            .expect(200);
        expect(response.body.products.every((p) => p.category === 'Lacteos')).toBeTruthy();
    }));
    it('actualización de un producto', () => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Crear producto
        const productData = {
            name: `Test Product ${Date.now()}`,
            category: 'Lacteos',
            price: 5.44,
            defaultQuantity: 1
        };
        // Crear directamente en la DB para asegurar el ID
        const createdProduct = yield ProductModel_1.default.create(productData);
        const productId = createdProduct._id.toString();
        console.log("el product id es ", productId);
        // 2. Actualizar producto
        const updatedData = {
            name: 'Producto Actualizado',
            category: 'Lacteos',
            price: 5.44,
            defaultQuantity: 1
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/products/${productId}`)
            .send(updatedData);
        // 3. Verificar respuesta
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedData.name);
        expect(response.body.price).toBe(updatedData.price);
        // 4. Verificar en la base de datos
        const updatedProduct = yield ProductModel_1.default.findById(productId);
        expect(updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.name).toBe(updatedData.name);
        expect(updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.price).toBe(updatedData.price);
    }));
    it('error al eliminar producto inexistente', () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = new mongoose_1.default.Types.ObjectId();
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/products/${fakeId}`)
            .expect(404);
        expect(response.body.message).toBe('Producto no encontrado');
    }));
    it('error al eliminar con ID inválido', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete('/api/products/id-invalido')
            .expect(500);
        expect(response.body.message).toBe('Error al eliminar el producto');
    }));
    it('eliminación de un producto', () => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Crear producto
        const productData = {
            name: `Test Product-delete ${Date.now()}`,
            category: 'Lacteos',
            price: 5.44,
            defaultQuantity: 1
        };
        const createRes = yield (0, supertest_1.default)(app_1.default)
            .post("/api/products/")
            .send(productData);
        expect(createRes.statusCode).toBe(201);
        // 2. Buscar el producto en la base de datos
        const createdProduct = yield ProductModel_1.default.findOne({ name: productData.name });
        expect(createdProduct).not.toBeNull(); // nos aseguramos que existe
        const productId = createdProduct._id; // el "!" indica que estamos seguros de que no es null
        // 3. Eliminar el producto
        const deleteRes = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/products/${productId}`);
        expect(deleteRes.statusCode).toBe(200); // o 204 si tu API no devuelve contenido
        // 4. Confirmar que ya no existe en base de datos
        const deletedProduct = yield ProductModel_1.default.findById(productId);
        expect(deletedProduct).toBeNull();
    }));
});
