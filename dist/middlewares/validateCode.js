"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCode = void 0;
const validateCode = (req, res, next) => {
    const { code } = req.body;
    const codeRegex = /^\d{4}-[a-zA-Z0-9]{3}$/;
    if (!code || !codeRegex.test(code)) {
        return res.status(400).json({
            error: 'El código de acceso no tiene un formato válido. Debe ser: 4 dígitos, un guion, y 3 caracteres alfanuméricos.',
        });
    }
    next();
};
exports.validateCode = validateCode;
