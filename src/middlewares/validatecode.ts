import { Request, Response, NextFunction } from 'express';

export const validateCode = (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.body; 

  const codeRegex = /^\d{4}-[a-zA-Z0-9]{3}$/;

  if (!code || !codeRegex.test(code)) {
    return res.status(400).json({
      error: 'El código de acceso no tiene un formato válido. Debe ser: 4 dígitos, un guion, y 3 caracteres alfanuméricos.',
    });
  }

  next(); 
};


