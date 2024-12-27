// src/routes/userRoutes.ts
import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser,loginUser } from '../controllers/createUser';
import { validateUser } from '../middlewares/ValidateUser';

export const routerUsers = express.Router();

// Rutas para usuarios
routerUsers.post('/',validateUser, createUser);  
routerUsers.get('/', validateUser,getUsers);
routerUsers.get("/login",loginUser);
routerUsers.get('/:id',validateUser, getUserById); 
routerUsers.put('/:id',validateUser, updateUser);  
routerUsers.delete('/:id',validateUser, deleteUser); 


