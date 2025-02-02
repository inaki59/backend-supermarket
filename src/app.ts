import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import { routerUsers, helloRoutes, routerProduct, routerList } from "./routes";
import { auth } from 'express-openid-connect';

const app = express();

// Middlewares
app.use(express.json());

app.use(cors())

// Conexion a la base de datos
connectDB();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:8081', // Frontend permitido
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
  credentials: true, // Permite cookies o autenticación
}));

// Manejo de preflight
app.options('*', cors());
app.use(cors());

// Rutas
app.use("/api", helloRoutes);
app.use("/api/users", routerUsers);
app.use("/api/products", routerProduct);
app.use("/api/list", routerList);

export default app;
