import { Router, Request, Response, NextFunction } from "express";

import { getOAuthCodeAndAccessToken } from "../controllers/oauthCode";


const router = Router();

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;

router.get("/", getOAuthCodeAndAccessToken as RouteHandler);

export default router;