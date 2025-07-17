import { Request, Response, NextFunction } from 'express';

import { getcurrentRole, getCurrentUser } from '../services/tokenService';
import { User } from "../models/users";


//בדיקה האם המשתמש הןא משתמש יועץ
const checkCounselor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const role = getcurrentRole(req);
    const user: User | null = await getCurrentUser(req); 

    if (!user) {
        res.status(401).json({ message: "Unauthorized - user not found" });
        return;
    }

    if (role !== "counselor") {
        res.status(403).json({ message: "Forbidden - role" });
        return;
    }

    if (user.status !== "approve") {
        res.status(401).json({
            title: "Forbidden",
            message: "You are not allowed to log in. Ask the admin for permission."
        });
        return;
    }

    next();
};

export default checkCounselor;