// src/routes/shoppingListRoutes.ts
import { Router } from 'express';
import { createShoppingList, getShoppingLists, getShoppingListById, updateShoppingList, deleteShoppingList
,joinShoppingList, addProductsToShoppingList, clearProductsFromShoppingList, removeProductFromShoppingList } from '../controllers';
import { checkgroupAccess, checkUserInShoppingList, validateCode, validateShoppingList,verifyToken,validateProduct } from '../middlewares';


export const routerList = Router();

// Rutas para listas de compra
routerList.post('/', [verifyToken,validateShoppingList], createShoppingList);  
routerList.post('/group',[verifyToken,validateCode,checkgroupAccess],joinShoppingList);
routerList.post("/add-product/:id",[verifyToken,checkUserInShoppingList,validateProduct],addProductsToShoppingList);                   
routerList.get('/', getShoppingLists);                           
routerList.get('/:id', getShoppingListById);
routerList.put('/:id', validateShoppingList, updateShoppingList); 
routerList.delete('/:id', deleteShoppingList); 
routerList.delete('/clear-products/:id',[verifyToken,checkUserInShoppingList], clearProductsFromShoppingList);
routerList.delete('/remove-product/:id',[verifyToken,checkUserInShoppingList], removeProductFromShoppingList);                 


