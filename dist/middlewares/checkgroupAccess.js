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
exports.checkgroupAccess = void 0;
const ShoppingListModel_1 = __importDefault(require("../models/ShoppingListModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.SECRET_KEY;
const checkgroupAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    const header = req.header("Authorization") || "";
    const token = header;
    const payload = jsonwebtoken_1.default.verify(token, secretKey);
    const userId = payload.id;
    const shoppingList = yield ShoppingListModel_1.default.findOne({ code });
    if (!shoppingList) {
        return res.status(404).json({ message: 'Lista de compras no encontrada o código inválido' });
    }
    if (shoppingList.userIds.includes(userId)) {
        return res.status(400).json({ message: 'El usuario ya está en esta lista' });
    }
    next();
});
exports.checkgroupAccess = checkgroupAccess;
