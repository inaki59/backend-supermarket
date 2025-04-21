import { Request, Response, NextFunction } from 'express';
import { auth, ConfigParams } from 'express-openid-connect';
require("dotenv").config()
const authConfig: ConfigParams = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || 'a long, randomly-generated string stored in env',
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:5000',
  clientID: process.env.AUTH0_CLIENT_ID || 'R5KZCSH4usyVw0nLkG8RiurVxln3SwUG',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-5jrn4zvdojuqym7q.us.auth0.com',
};

// Middleware de autenticación
export const authMiddleware = auth(authConfig);

// Controlador para la página principal
export const homeController = (req: Request, res: Response): void => {

  res.send(req.oidc?.isAuthenticated() ? 'Logged in' : 'Logged out');
};

// Controlador para el perfil del usuario (ruta protegida)
export const profileController =async (req: Request, res: Response): Promise<any> => {
  if (!req.oidc?.isAuthenticated()) {
    return res.status(401).send('Not authenticated');
  }

  res.json({
    user: req.oidc?.user,
  });
};
