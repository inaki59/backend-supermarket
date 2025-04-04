// src/routes/shoppingListRoutes.ts
import { Router } from 'express';
import { createShoppingList, updateShoppingList, deleteShoppingList
,joinShoppingList, addProductsToShoppingList, clearProductsFromShoppingList, removeProductFromShoppingList, 
getShoppingLists,
getShoppingListById ,getMobilePurchaseHistory,
updateProductInShoppingList} from '../controllers';
import { checkgroupAccess, checkUserInShoppingList, validateCode, validateShoppingList,verifyToken,validateProduct,validateShoppingListProducts } from '../middlewares';



export const routerList = Router();

// Rutas para listas de compra
routerList.post('/', [verifyToken], createShoppingList);  
routerList.post('/group',[verifyToken,validateCode,checkgroupAccess],joinShoppingList);
routerList.post("/add-product/:id",[verifyToken,checkUserInShoppingList,validateShoppingListProducts],addProductsToShoppingList);                   
routerList.get('/group/:id', getShoppingLists);                           
routerList.get('/:id', getShoppingListById);// obtener una unica lista id de lista
routerList.put('/:id', [verifyToken,validateShoppingList], updateShoppingList); 
routerList.delete('/:id',verifyToken, deleteShoppingList); 
routerList.post('/clear-products/:id',[verifyToken,checkUserInShoppingList], clearProductsFromShoppingList);
routerList.post('/remove-product/:id',[verifyToken,checkUserInShoppingList], removeProductFromShoppingList);           
routerList.get('/history/:listId',[verifyToken], getMobilePurchaseHistory);    
routerList.put('/shopping-lists/:listId/products/:productId',[verifyToken], updateProductInShoppingList);  


