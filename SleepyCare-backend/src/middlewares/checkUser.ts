import { JwtPayload } from 'jsonwebtoken';

import { checkUserUtil } from '../utils/middlewareUtils';
import { Request, Response, NextFunction } from 'express'
import { verifyToken, getCurrentToken } from "../services/tokenService";

//פוקציה לבדיקה האם המשתמש הוא משתמש רשום
const checkUser = (req: Request, res: Response, next: NextFunction): void => {
    console.log("go in checkUser middleware");

    try {
        const token = getCurrentToken(req);
        const validate = checkUserUtil(token);

        if (!validate) {
            res.status(400).send("Invalid token");
            return;

        }

        const payload: JwtPayload | null = verifyToken(token);

        if (!token || !payload) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        (req as any).userId = payload.userId;
        next();

    } catch (error) {
        console.error('Error in checkUser middleware:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
       
export default checkUser;
