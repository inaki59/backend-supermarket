import { Request, Response, NextFunction } from 'express';

export const validatePurchaseHistory = (req: Request, res: Response, next: NextFunction):any => {
  const { listId, listName, users, products, purchasedAt } = req.body;

  if (!listId || !listName || !Array.isArray(users) || !Array.isArray(products) || !purchasedAt) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }

  const isValidProducts = products.every(
    (product: { productId: string; quantity: number }) =>
      product.productId && typeof product.quantity === 'number' && product.quantity > 0
  );

  if (!isValidProducts) {
    return res.status(400).json({ error: 'Productos inválidos en la lista' });
  }

  next();
};
