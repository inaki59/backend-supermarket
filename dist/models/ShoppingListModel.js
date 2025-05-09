"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shoppingListSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    userIds: [{ type: mongoose_1.Types.ObjectId, ref: 'User', required: true }],
    products: [
        {
            productId: { type: mongoose_1.Types.ObjectId, ref: 'Product', required: true },
            note: { type: String, required: false }, // Permite agregar observaciones
        }
    ],
}, {
    timestamps: true,
});
// Creamos el modelo para la lista de la compra
const ShoppingListModel = (0, mongoose_1.model)('ShoppingList', shoppingListSchema);
exports.default = ShoppingListModel;
