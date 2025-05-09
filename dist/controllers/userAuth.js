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
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileController = exports.homeController = exports.authMiddleware = void 0;
const express_openid_connect_1 = require("express-openid-connect");
require("dotenv").config();
const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET || 'a long, randomly-generated string stored in env',
    baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:5000',
    clientID: process.env.AUTH0_CLIENT_ID || 'R5KZCSH4usyVw0nLkG8RiurVxln3SwUG',
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-5jrn4zvdojuqym7q.us.auth0.com',
};
// Middleware de autenticación
exports.authMiddleware = (0, express_openid_connect_1.auth)(authConfig);
// Controlador para la página principal
const homeController = (req, res) => {
    var _a;
    res.send(((_a = req.oidc) === null || _a === void 0 ? void 0 : _a.isAuthenticated()) ? 'Logged in' : 'Logged out');
};
exports.homeController = homeController;
// Controlador para el perfil del usuario (ruta protegida)
const profileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!((_a = req.oidc) === null || _a === void 0 ? void 0 : _a.isAuthenticated())) {
        return res.status(401).send('Not authenticated');
    }
    res.json({
        user: (_b = req.oidc) === null || _b === void 0 ? void 0 : _b.user,
    });
});
exports.profileController = profileController;
