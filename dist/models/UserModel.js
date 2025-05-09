"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Definimos el esquema con los nuevos campos
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    edad: { type: Number, required: false, validate: { validator: Number.isInteger, message: "no es un número entero valido" } },
    email: { type: String, required: false },
    actividad: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'moderator'], default: 'user' },
    authProvider: { type: String, required: true, enum: ['local', 'google'] },
    status: { type: Boolean, default: true },
    lastLogin: { type: Date, required: false },
    password: { type: String, required: false },
    recoveryCode: { type: String, required: true }
}, {
    timestamps: true, // Automáticamente crea createdAt y updatedAt
});
// Creamos el modelo de usuario basado en el esquema
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.default = UserModel;
