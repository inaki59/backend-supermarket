"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const validateUser = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Faltan campos requeridos: name y auth0Id' });
    }
    next();
};
exports.validateUser = validateUser;
