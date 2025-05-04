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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
// 1. Carga segura de variables de entorno
dotenv_1.default.config({ path: '.env.test' });
let server;
let mongooseConnection;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 3. Validaciones tipo TypeScript
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('❌ Ejecutando tests en entorno incorrecto!');
    }
    if (!((_a = process.env.MONGO_URI_TEST) === null || _a === void 0 ? void 0 : _a.includes('test-backend'))) {
        throw new Error('❌ URI de MongoDB no apunta a entorno de pruebas');
    }
    // 4. Conexión tipada correctamente con manejo de conexión existente
    try {
        if (mongoose_1.default.connection.readyState !== 0) {
            yield mongoose_1.default.disconnect();
        }
        mongooseConnection = yield mongoose_1.default.connect(process.env.MONGO_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ignoreUndefined: true,
        });
        console.log(`✅ Conectado a MongoDB: `);
    }
    catch (error) {
        console.error('🔥 Error de conexión:', error);
        throw error;
    }
    // 5. Servidor Express con tipado correcto
    const app = (0, express_1.default)();
    server = app.listen(0); // Usamos puerto 0 para asignación automática
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // Limpieza opcional (comenta si quieres conservar datos)
    // Aquí podrías limpiar colecciones si lo necesitas entre tests, pero no es necesario si lo haces en afterAll
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 6. Limpieza de colecciones después de todos los tests
    try {
        const collections = mongoose_1.default.connection.collections;
        for (const key in collections) {
            yield collections[key].deleteMany({});
        }
        // 7. Desconexión ordenada con manejo de errores
        if (((_a = mongooseConnection === null || mongooseConnection === void 0 ? void 0 : mongooseConnection.connection) === null || _a === void 0 ? void 0 : _a.readyState) === 1) {
            yield mongooseConnection.disconnect();
        }
        if (server) {
            yield new Promise((resolve, reject) => {
                server.close((err) => {
                    err ? reject(err) : resolve();
                });
            });
        }
    }
    catch (error) {
        console.error('Error en afterAll:', error);
    }
}));
