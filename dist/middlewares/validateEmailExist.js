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
exports.checkEmailExists = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const checkEmailExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'El campo "email" es requerido.' });
    }
    try {
        const existingUser = yield UserModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'El correo ya está registrado.' });
        }
        next();
    }
    catch (error) {
        console.error('Error verificando el correo:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
});
exports.checkEmailExists = checkEmailExists;
