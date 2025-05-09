"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateShoppingList = void 0;
const validateShoppingList = (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) {
        return res.status(400).json({ message: 'Faltan campo nombre' });
    }
    if (id == undefined) {
        return res.status(400).json({ message: 'id invalido' });
    }
    next();
};
exports.validateShoppingList = validateShoppingList;
