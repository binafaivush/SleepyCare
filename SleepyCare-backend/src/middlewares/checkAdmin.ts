import { Request, Response, NextFunction } from 'express'

import { getcurrentRole, getCurrentToken } from '../services/tokenService'
import { checkUserUtil } from '../utils/middlewareUtils'

//בדיקה האם המשתמש הןא משתמש מנהל
export const checkAdmin = (req: Request, res: Response, next: NextFunction): void => {

    const token = getCurrentToken(req);
    console.log("token: ", token);

    if (!token || !checkUserUtil(token)) {
        console.log("checkUserUtil: ", checkUserUtil(token));

        res.status(401).json({ error: 'Unauthorized' });
    }
    if (getcurrentRole(req) !== "admin") {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    next();
}

export default checkAdmin;
