import { Request, Response, NextFunction } from 'express';

export const validateProduct = (req: Request, res: Response, next: NextFunction):any => {
  const { name, category, price, defaultQuantity,observacion } = req.body;

  // Validación de campos requeridos
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'El campo "name" es obligatorio y debe ser un string.' });
  }

  if (!category || typeof category !== 'string') {
    return res.status(400).json({ message: 'El campo "category" es obligatorio y debe ser un string.' });
  }
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: 'El campo "price" es obligatorio, debe ser un número y no puede ser negativo.' });
  }
  if (defaultQuantity === undefined || typeof defaultQuantity !== 'number' || defaultQuantity < 0) {
    return res.status(400).json({ message: 'El campo "defaultQuantity" es obligatorio, debe ser un número y no puede ser negativo.' });
  }
  next();
};
