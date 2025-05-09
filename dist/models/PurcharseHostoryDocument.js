"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseHistoryModel = void 0;
const mongoose_1 = require("mongoose");
// Creamos un esquema para los productos dentro del historial
const ProductEntrySchema = new mongoose_1.Schema({
    productId: { type: String, required: true },
    note: { type: String, required: true, min: 1 },
});
// Creamos el esquema para el historial de compras
const PurchaseHistorySchema = new mongoose_1.Schema({
    listId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ShoppingList', required: true },
    listName: { type: String, required: true },
    users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    products: { type: [ProductEntrySchema], required: true },
    purchasedAt: { type: Date, required: true },
}, { timestamps: true });
const PurchaseHistoryModel = (0, mongoose_1.model)('PurchaseHistory', PurchaseHistorySchema);
exports.PurchaseHistoryModel = PurchaseHistoryModel;
