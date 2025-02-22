import { Request, Response, NextFunction } from 'express';

export const validateShoppingListProducts = (req: Request, res: Response, next: NextFunction) => {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "El campo 'products' debe ser un array y no puede estar vacío." });
  }

  for (const product of products) {
    if (typeof product !== 'object' || !product.productId || typeof product.productId !== 'string') {
      return res.status(400).json({ message: "Cada producto debe ser un objeto con un 'productId' válido." });
    }

    if (product.note && typeof product.note !== 'string') {
      return res.status(400).json({ message: "El campo 'note', si se proporciona, debe ser una cadena de texto." });
    }
  }

  next(); // Pasa la validación, continúa con el controlador
};
