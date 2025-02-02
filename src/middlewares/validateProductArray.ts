import { Request, Response, NextFunction } from 'express';

export const validateProductIsArray=async (req: Request, res: Response, next: NextFunction)=>{
    try{
    const { productIds } = req.body;
      if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ message: 'Se requiere un array de productIds.' });
    }
    next();
}catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Error introducir  los productos.' });
}
}