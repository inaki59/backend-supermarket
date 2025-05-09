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
exports.getMobilePurchaseHistory = exports.clearProductsFromShoppingList = exports.getShoppingLists = exports.updateProductInShoppingList = exports.updateShoppingList = exports.deleteShoppingList = exports.getShoppingListById = exports.removeProductFromShoppingList = exports.addProductsToShoppingList = exports.joinShoppingList = exports.createShoppingList = void 0;
const ShoppingListModel_1 = __importDefault(require("../models/ShoppingListModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateCodeList_1 = require("../utils/generateCodeList");
const PurcharseHostoryDocument_1 = require("../models/PurcharseHostoryDocument");
const secretKey = process.env.SECRET_KEY;
const createShoppingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header("Authorization") || "";
        const payload = jsonwebtoken_1.default.verify(token, secretKey);
        const userId = payload.id;
        const shoppingList = new ShoppingListModel_1.default(Object.assign(Object.assign({}, req.body), { code: (0, generateCodeList_1.generateCodelist)(), userIds: [userId] }));
        yield shoppingList.save();
        return res.status(201).json(shoppingList);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la lista de compra' });
    }
});
exports.createShoppingList = createShoppingList;
const joinShoppingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header("Authorization") || "";
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        const userId = decoded.id;
        const { code } = req.body;
        const shoppingList = yield ShoppingListModel_1.default.findOne({ code });
        if (!shoppingList) {
            return res.status(404).json({ message: 'Lista de compra no encontrada' });
        }
        if (!shoppingList.userIds.includes(userId)) {
            shoppingList.userIds.push(userId);
            yield shoppingList.save();
        }
        return res.status(200).json({ message: 'Usuario agregado a la lista', shoppingList });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al unirse a la lista de compras' });
    }
});
exports.joinShoppingList = joinShoppingList;
const addProductsToShoppingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { products } = req.body;
        const shoppingListId = req.params.id;
        const shoppingList = yield ShoppingListModel_1.default.findById(shoppingListId);
        if (!shoppingList) {
            return res.status(404).json({ message: 'Lista de compras no encontrada' });
        }
        products.forEach(({ productId, note }) => {
            const existingProductIndex = shoppingList.products.findIndex(p => p.productId.toString() === productId);
            if (existingProductIndex !== -1) {
                // Actualiza la nota si ya existe el producto
                shoppingList.products[existingProductIndex].note = note;
            }
            else {
                // Añadir el producto sin _id adicional
                shoppingList.products.push({ productId, note: note || '' });
            }
        });
        yield shoppingList.save();
        return res.status(200).json({
            message: 'Productos agregados',
            updatedProducts: shoppingList.products.map(({ productId, note }) => ({ productId, note }))
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al agregar productos' });
    }
});
exports.addProductsToShoppingList = addProductsToShoppingList;
const removeProductFromShoppingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shoppingListId = req.params.id;
        const productIds = req.body.productIds; // Ahora esperamos un array de IDs
        // Validar que productIds sea un array
        if (!Array.isArray(productIds)) {
            return res.status(400).json({ message: 'productIds debe ser un array' });
        }
        // Buscar la lista de compras
        const shoppingList = yield ShoppingListModel_1.default.findById(shoppingListId);
        if (!shoppingList) {
            return res.status(404).json({ message: 'Lista de compras no encontrada' });
        }
        // Filtrar los productos que NO están en la lista de productIds
        shoppingList.products = shoppingList.products.filter((p) => !productIds.includes(p.productId.toString()));
        // Guardar la lista actualizada
        yield shoppingList.save();
        return res.status(200).json({ message: 'Productos eliminados', updatedProducts: shoppingList.products });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar productos' });
    }
});
exports.removeProductFromShoppingList = removeProductFromShoppingList;
const getShoppingListById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shoppingList = yield ShoppingListModel_1.default.findById(req.params.id)
            .populate({ path: 'userIds', select: 'name' })
            .populate({ path: 'products.productId', select: 'name category' });
        if (!shoppingList) {
            return res.status(404).json({ message: 'Lista de la compra no encontrada' });
        }
        const response = {
            name: shoppingList.name,
            createdAt: shoppingList.createdAt,
            updatedAt: shoppingList.updatedAt,
            users: shoppingList.userIds.map((user) => ({ name: user.name })),
            products: shoppingList.products.map((p) => ({
                _id: p.productId._id,
                name: p.productId.name,
                category: p.productId.category,
                note: p.note,
            })),
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la lista de la compra' });
    }
});
exports.getShoppingListById = getShoppingListById;
// Eliminar una lista de la compra por su ID
const deleteShoppingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shoppingList = yield ShoppingListModel_1.default.findByIdAndDelete(req.params.id);
        if (!shoppingList) {
            return res.status(404).json({ message: 'Lista de compra no encontrada' });
        }
        res.status(200).json({ message: 'Lista de compra eliminada correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la lista de compra' });
    }
});
exports.deleteShoppingList = deleteShoppingList;
// Actualizar una lista de la compra por su ID
const updateShoppingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shoppingList = yield ShoppingListModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!shoppingList) {
            return res.status(404).json({ message: 'Lista de compra no encontrada' });
        }
        res.status(200).json(shoppingList);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la lista de compra' });
    }
});
exports.updateShoppingList = updateShoppingList;
const updateProductInShoppingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listId, productId } = req.params;
        const updatedProductData = req.body;
        const shoppingList = yield ShoppingListModel_1.default.findOneAndUpdate({ _id: listId, "products.productId": productId }, {
            $set: {
                "products.$.note": updatedProductData.note,
                // Aquí puedes añadir más campos si los quieres actualizar
            }
        }, { new: true });
        if (!shoppingList) {
            return res.status(404).json({ message: 'Producto o lista no encontrada' });
        }
        res.status(200).json(shoppingList);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el producto en la lista de compra' });
    }
});
exports.updateProductInShoppingList = updateProductInShoppingList;
// Obtener todas las listas de la compra
const getShoppingLists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Se requiere un userId' });
        }
        // Obtener las listas de compra y poblar los productos
        const shoppingLists = yield ShoppingListModel_1.default.find({ userIds: id })
            .populate({
            path: 'products.productId',
            select: 'name category',
            populate: {
                path: 'category', // Si category es un ObjectId que referencia otro modelo
                select: 'name', // Ajusta según los campos que quieras traer
            },
        });
        res.status(200).json(shoppingLists);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las listas de compra' });
    }
});
exports.getShoppingLists = getShoppingLists;
const clearProductsFromShoppingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shoppingListId = req.params.id;
        // Buscar la lista de compras
        const shoppingList = yield ShoppingListModel_1.default.findById(shoppingListId);
        if (!shoppingList) {
            return res.status(404).json({ message: 'Lista de compras no encontrada.' });
        }
        // Crear registro en el historial de compras antes de limpiar
        const purchaseHistoryEntry = new PurcharseHostoryDocument_1.PurchaseHistoryModel({
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
        yield purchaseHistoryEntry.save();
        // Vaciar el array de productos
        shoppingList.products = [];
        // Guardar la lista actualizada
        yield shoppingList.save();
        return res.status(200).json({
            message: 'Todos los productos han sido eliminados de la lista y guardados en el historial.',
            updatedProductIds: shoppingList.products,
            purchaseHistoryId: purchaseHistoryEntry._id
        });
    }
    catch (error) {
        console.error('Error al vaciar los productos de la lista de compras:', error);
        return res.status(500).json({
            message: 'Error al vaciar los productos de la lista de compras.',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});
exports.clearProductsFromShoppingList = clearProductsFromShoppingList;
const getMobilePurchaseHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listId = req.params.listId;
        // Validación rápida de ID
        // Consulta optimizada para móvil
        const histories = yield PurcharseHostoryDocument_1.PurchaseHistoryModel.find({ listId })
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
    }
    catch (error) {
        console.error('Error móvil:', error);
        return res.status(500).json({
            success: false,
            error: 'ERROR_SERVIDOR'
        });
    }
});
exports.getMobilePurchaseHistory = getMobilePurchaseHistory;
