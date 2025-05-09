"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerUsers = void 0;
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const createUser_1 = require("../controllers/createUser");
const ValidateUser_1 = require("../middlewares/ValidateUser");
const verifyToken_1 = require("../middlewares/verifyToken");
const userAuth_1 = require("../controllers/userAuth");
const validateEmailExist_1 = require("../middlewares/validateEmailExist");
exports.routerUsers = express_1.default.Router();
// Rutas para usuarios
exports.routerUsers.post('/', [ValidateUser_1.validateUser, validateEmailExist_1.checkEmailExists], createUser_1.createUser);
exports.routerUsers.post("/reset-password", createUser_1.resetPassword);
exports.routerUsers.post("/logout/:id", verifyToken_1.verifyToken, createUser_1.logoutUser);
exports.routerUsers.post("/login", createUser_1.loginUser);
exports.routerUsers.get('/:id', verifyToken_1.verifyToken, createUser_1.getUserById);
exports.routerUsers.put('/:id', verifyToken_1.verifyToken, createUser_1.updateUser);
exports.routerUsers.delete('/:id', verifyToken_1.verifyToken, createUser_1.deleteUser);
// rutas para el auth=
exports.routerUsers.get('/', userAuth_1.homeController);
exports.routerUsers.get('/profile', userAuth_1.profileController);
