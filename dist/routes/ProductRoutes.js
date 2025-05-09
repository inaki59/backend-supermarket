"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerProduct = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
exports.routerProduct = express_1.default.Router();
// Rutas para productos con validación y controladores
// routerProduct.post('/', [validateProduct], createProduct);     
exports.routerProduct.get('/', controllers_1.getProducts);
exports.routerProduct.get('/:id', controllers_1.getProductById);
// routerProduct.put('/:id', validateProduct, updateProduct);    
// routerProduct.delete('/:id', deleteProduct);               
exports.routerProduct.post('/upload-csv', middlewares_1.fileSizeLimiter, controllers_1.uploadProductsCSV);
