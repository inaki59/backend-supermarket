"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    defaultQuantity: { type: Number, required: true }
}, {
    timestamps: true // Para tener createdAt y updatedAt automáticamente
});
const ProductModel = (0, mongoose_1.model)('Product', productSchema);
exports.default = ProductModel;
