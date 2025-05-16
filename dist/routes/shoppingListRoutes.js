"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerList = void 0;
// src/routes/shoppingListRoutes.ts
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
exports.routerList = (0, express_1.Router)();
// Rutas para listas de compra
exports.routerList.post('/', [middlewares_1.verifyToken], controllers_1.createShoppingList);
exports.routerList.put('/leavegroup', [middlewares_1.verifyToken], controllers_1.leaveShoppingList);
exports.routerList.post('/group', [middlewares_1.verifyToken, middlewares_1.validateCode, middlewares_1.checkgroupAccess], controllers_1.joinShoppingList);
exports.routerList.post("/add-product/:id", [middlewares_1.verifyToken, middlewares_1.checkUserInShoppingList, middlewares_1.validateShoppingListProducts], controllers_1.addProductsToShoppingList);
exports.routerList.get('/group/:id', controllers_1.getShoppingLists);
exports.routerList.get('/:id', controllers_1.getShoppingListById);
exports.routerList.put('/:id', [middlewares_1.verifyToken, middlewares_1.validateShoppingList], controllers_1.updateShoppingList);
exports.routerList.delete('/:id', middlewares_1.verifyToken, controllers_1.deleteShoppingList);
exports.routerList.post('/clear-products/:id', [middlewares_1.verifyToken, middlewares_1.checkUserInShoppingList], controllers_1.clearProductsFromShoppingList);
exports.routerList.post('/remove-product/:id', [middlewares_1.verifyToken, middlewares_1.checkUserInShoppingList], controllers_1.removeProductFromShoppingList);
exports.routerList.get('/history/:listId', [middlewares_1.verifyToken], controllers_1.getMobilePurchaseHistory);
exports.routerList.put('/shopping-lists/:listId/products/:productId', [middlewares_1.verifyToken], controllers_1.updateProductInShoppingList);
