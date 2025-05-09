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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const secretKey = process.env.SECRET_KEY;
let codeList = "";
describe(' pruebas de la lista', () => {
    it('crear lista de la compra', () => __awaiter(void 0, void 0, void 0, function* () {
        // Datos de prueba
        const userData = {
            name: 'prueba',
            email: `lista-${Date.now()}@example.com`, // Email único
            password: 'pepe',
            edad: 23,
            actividad: 'Activa',
            role: 'user',
            authProvider: 'local',
        };
        // (`Base de datos actual: ${mongoose.connection.db?.databaseName}`);
        // 1. crear usuario
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(userData);
        const loginBody = {
            user: userData.email,
            password: userData.password
        };
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post("/api/users/login")
            .send(loginBody);
        expect(res.status).toBe(201);
        const token = loginRes.body.token;
        const listRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/list')
            .set('Authorization', `${token}`)
            .send({
            name: "Lista Test"
        });
        codeList = listRes.body.code;
        expect(listRes.status).toBe(201);
    }));
    it('debería crear usuarios, lista grupal y unirse correctamente', () => __awaiter(void 0, void 0, void 0, function* () {
        // Datos de prueba
        // Datos de prueba
        const userData = {
            name: 'prueba',
            email: `goku-${Date.now()}@example.com`, // Email único
            password: 'dragonball',
            edad: 23,
            actividad: 'Activa',
            role: 'user',
            authProvider: 'local',
        };
        // (`Base de datos actual: ${mongoose.connection.db?.databaseName}`);
        // 1. crear usuario
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(userData);
        expect(res.status).toBe(201);
        yield new Promise(resolve => setTimeout(resolve, 700));
        const loginBody = {
            email: userData.email,
            password: userData.password
        };
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post("/api/users/login")
            .send(loginBody);
        expect(loginRes.status).toBe(200);
        console.log(loginRes.body);
        expect(loginRes.body.token).toBeDefined();
        expect(loginRes.body).toHaveProperty('token');
        const token = loginRes.body.token;
        const joinRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/list/group')
            .set('Authorization', ` ${token}`)
            .send({ code: codeList });
        console.log(joinRes.body);
        expect(joinRes.status).toBe(200);
    }));
});
