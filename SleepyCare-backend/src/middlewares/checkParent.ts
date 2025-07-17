import { Request, Response, NextFunction } from 'express'

import {getCurrentToken, verifyToken, getcurrentRole} from '../services/tokenService'
import  {checkUserUtil}  from '../utils/middlewareUtils'


//בדיקה האם המשתמש הןא משתמש הורה
const checkParent = (req: Request, res: Response, next: NextFunction): void => {
        const token = getCurrentToken(req);
        if (!token || !checkUserUtil(token)) {
           res.status(401).json({ error: 'Unauthorized' });
           return;
        }
        if(getcurrentRole(req) !== "parent") {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        next();
    
}
export default checkParent;