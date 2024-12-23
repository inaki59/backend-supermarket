import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Tu clave secreta
const secretKey = 'tu_clave_secreta';

interface JwtPayload {
  username: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.header("Authorization") || "";
  const token = header
  if (!token) {
    // Si no hay token, envía una respuesta de error
    res.status(401).json({ message: "Token not provided" });
    return; // Aquí simplemente termina la ejecución del middleware, no es necesario usar return para devolver algo
  }

  try {
    const payload = jwt.verify(token, secretKey) as JwtPayload;
    req.body.username = payload.username;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token not valid" });
  }
};
