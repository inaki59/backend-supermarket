// src/routes/userRoutes.ts
import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser,loginUser, logoutUser } from '../controllers/createUser';
import { validateUser } from '../middlewares/ValidateUser';
import { verifyToken } from '../middlewares/validatejwt'
export const routerUsers = express.Router();

// Rutas para usuarios
routerUsers.post('/',validateUser, createUser);  
routerUsers.post("/logout/:id", logoutUser);
routerUsers.get('/', validateUser,getUsers);
routerUsers.get("/login",loginUser);
routerUsers.get('/:id',verifyToken, getUserById); 
routerUsers.put('/:id',verifyToken, updateUser);  
routerUsers.delete('/:id',verifyToken, deleteUser); 


