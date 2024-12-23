import { Router } from 'express';
import {
  createPurchaseHistory,
  getAllPurchaseHistories,
  getPurchaseHistoryById,
  updatePurchaseHistory,
  deletePurchaseHistory,
} from '../controllers';
import { validatePurchaseHistory } from '../middlewares';

export const routerHistory = Router();

routerHistory.post('/', validatePurchaseHistory, createPurchaseHistory);
routerHistory.get('/', getAllPurchaseHistories);
routerHistory.get('/:id', getPurchaseHistoryById);
routerHistory.put('/:id', validatePurchaseHistory, updatePurchaseHistory);
routerHistory.delete('/:id', deletePurchaseHistory);

