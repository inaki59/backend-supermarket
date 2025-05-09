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
exports.checkUserInShoppingList = void 0;
const ShoppingListModel_1 = __importDefault(require("../models/ShoppingListModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const secretKey = process.env.SECRET_KEY;
const checkUserInShoppingList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productIds } = req.body;
        const header = req.header("Authorization") || "";
        const token = header;
        const payload = jsonwebtoken_1.default.verify(token, secretKey);
        const userId = payload.id;
        const listId = req.params.id;
        if (!listId) {
            return res.status(400).json({ message: 'El ID de la lista es obligatorio.' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(listId)) {
            return res.status(400).json({ message: 'El ID de la lista de compras no es válido.' });
        }
        // Buscar la lista de compras por `_id`
        const shoppingList = yield ShoppingListModel_1.default.findById(listId);
        if (!shoppingList) {
            return res.status(404).json({ message: 'Lista de compras no encontrada.' });
        }
        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }
        // Comprobar si el usuario está en la lista
        if (!shoppingList.userIds.includes(userId)) {
            return res.status(403).json({ message: 'No tienes permisos para modificar esta lista de compras.' });
        }
        next(); // Usuario tiene acceso, pasamos al siguiente middleware/controlador
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al comprobar acceso a la lista de compras.' });
    }
});
exports.checkUserInShoppingList = checkUserInShoppingList;
