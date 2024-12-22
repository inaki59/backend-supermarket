import { Router, Request, Response } from "express";

export const helloRoutes = Router();

helloRoutes.get("/hello", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello, world!" });
});


