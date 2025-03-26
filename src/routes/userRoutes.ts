// src/routes/userRoutes.ts
import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser,loginUser, logoutUser, resetPassword } from '../controllers/createUser';
import { validateUser } from '../middlewares/ValidateUser';
import { verifyToken } from '../middlewares/verifyToken'
import { homeController, profileController } from '../controllers/userAuth';
import { checkEmailExists } from '../middlewares/validateEmailExist';
export const routerUsers = express.Router();

// Rutas para usuarios
routerUsers.post('/',[validateUser,checkEmailExists], createUser);
routerUsers.post("/reset-password",resetPassword)  
routerUsers.post("/logout/:id",verifyToken, logoutUser);
routerUsers.post("/login",loginUser);
routerUsers.get('/:id',verifyToken, getUserById); 
routerUsers.put('/:id',verifyToken, updateUser);  
routerUsers.delete('/:id',verifyToken, deleteUser); 
// rutas para el auth=
routerUsers.get('/', homeController); 
routerUsers.get('/profile', profileController); 



