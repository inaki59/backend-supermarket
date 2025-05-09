"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePurchaseHistory = void 0;
const validatePurchaseHistory = (req, res, next) => {
    const { listId, listName, users, products, purchasedAt } = req.body;
    if (!listId || !listName || !Array.isArray(users) || !Array.isArray(products) || !purchasedAt) {
        return res.status(400).json({ error: 'Datos incompletos o inválidos' });
    }
    const isValidProducts = products.every((product) => product.productId && typeof product.quantity === 'number' && product.quantity > 0);
    if (!isValidProducts) {
        return res.status(400).json({ error: 'Productos inválidos en la lista' });
    }
    next();
};
exports.validatePurchaseHistory = validatePurchaseHistory;
