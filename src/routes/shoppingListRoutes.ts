// src/routes/shoppingListRoutes.ts
import { Router } from 'express';
import { createShoppingList, getShoppingLists, getShoppingListById, updateShoppingList, deleteShoppingList } from '../controllers';
import { validateShoppingList,verifyToken } from '../middlewares';

export const routerList = Router();

// Rutas para listas de compra
routerList.post('/', [verifyToken,validateShoppingList], createShoppingList);  
routerList.get('/', getShoppingLists);                           
routerList.get('/:id', getShoppingListById);                    
routerList.put('/:id', validateShoppingList, updateShoppingList); 
routerList.delete('/:id', deleteShoppingList);                  


