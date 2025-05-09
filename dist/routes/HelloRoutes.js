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
exports.helloRoutes = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.SECRET_KEY;
exports.helloRoutes = (0, express_1.Router)();
exports.helloRoutes.get("/hello", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ message: "tiene acceso enhorabuena" });
}));
exports.helloRoutes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body; // Asegúrate de usar el middleware `express.json`
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        if (username === 'admin' && password === '123') {
            const token = jsonwebtoken_1.default.sign({ username }, secretKey, { expiresIn: '1h' });
            return res.status(200).json({ token });
        }
        else {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = exports.helloRoutes;
