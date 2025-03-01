// src/routes/shoppingListRoutes.ts
import { Router } from 'express';
import { createShoppingList, updateShoppingList, deleteShoppingList
,joinShoppingList, addProductsToShoppingList, clearProductsFromShoppingList, removeProductFromShoppingList, 
getShoppingLists} from '../controllers';
import { checkgroupAccess, checkUserInShoppingList, validateCode, validateShoppingList,verifyToken,validateProduct,validateShoppingListProducts } from '../middlewares';



export const routerList = Router();

// Rutas para listas de compra
routerList.post('/', [verifyToken], createShoppingList);  
routerList.post('/group',[verifyToken,validateCode,checkgroupAccess],joinShoppingList);
routerList.post("/add-product/:id",[verifyToken,checkUserInShoppingList,validateShoppingListProducts],addProductsToShoppingList);                   
routerList.get('/', getShoppingLists);                           
routerList.get('/:id', getShoppingLists);
routerList.put('/:id', [verifyToken,validateShoppingList], updateShoppingList); 
routerList.delete('/:id',verifyToken, deleteShoppingList); 
routerList.delete('/clear-products/:id',[verifyToken,checkUserInShoppingList], clearProductsFromShoppingList);
routerList.delete('/remove-product/:id',[verifyToken,checkUserInShoppingList], removeProductFromShoppingList);                 


