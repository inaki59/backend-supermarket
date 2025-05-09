"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.SECRET_KEY;
const verifyToken = (req, res, next) => {
    const header = req.header("Authorization") || "";
    const token = header;
    if (!token) {
        // Si no hay token, envía una respuesta de error
        res.status(401).json({ message: "Token not provided" });
        return; // Aquí simplemente termina la ejecución del middleware, no es necesario usar return para devolver algo
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secretKey);
        req.body.username = payload.username;
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Token not valid" });
    }
};
exports.verifyToken = verifyToken;
