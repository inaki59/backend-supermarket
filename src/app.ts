import express from "express";
import connectDB from "./config/db";
import { routerUsers,helloRoutes,routerProduct,routerList } from "./routes";

const app = express();

// Middlewares
app.use(express.json());

//conexion
connectDB();

// Rutas
app.use("/api", helloRoutes);
app.use("/api/users",routerUsers)
app.use("/api/products",routerProduct)
app.use("/api/list",routerList)
export default app;
