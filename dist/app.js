"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Conexion a la base de datos
(0, db_1.default)();
// Configuración de CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:8081', // Frontend permitido
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
    credentials: true, // Permite cookies o autenticación
}));
// Manejo de preflight
app.options('*', (0, cors_1.default)());
app.use((0, cors_1.default)());
// Rutas
app.use("/api", routes_1.helloRoutes);
app.use("/api/users", routes_1.routerUsers);
app.use("/api/products", routes_1.routerProduct);
app.use("/api/list", routes_1.routerList);
exports.default = app;
