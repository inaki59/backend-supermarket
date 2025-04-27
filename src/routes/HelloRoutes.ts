import { Router, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { verifyToken } from "../middlewares";
const secretKey =  process.env.SECRET_KEY as string;  
export const helloRoutes = Router();


helloRoutes.get("/hello" ,async (req: Request, res: Response) => {
    res.status(200).json({ message: "tiene acceso enhorabuena" });
});

helloRoutes.post('/login', async (req: Request, res: Response):Promise<any> => {
    try {
        const { username, password } = req.body; // Asegúrate de usar el middleware `express.json`

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        if (username === 'admin' && password === '123') {
            const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});


  



export default helloRoutes;

