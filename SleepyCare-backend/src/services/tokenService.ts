import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

import { User } from "../models/users"
import { userModel } from '../models/users';  


const secret = process.env.JWT_SECRET as Secret;

// פונקציה שמחזירה טוקן של משתמש נוכחי
export const getCurrentToken = (req: Request): string | null => {

    return req.headers['authorization']?.split(' ')[1] || null;
}

// פונקציה שמקבלת טוקן ומחלצת אותו
export const verifyToken = (token: string | null): JwtPayload | null => {
    try {
        if (token == null) {
            return null;
        }
        else {
            return jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;
        }
    } catch (e) {
        console.log("errror: ", e);
        return null; // במקרה של שגיאה, מחזירים null
    }
}

//פונקציה שמחזירה את התפקיד של המשתמש הנוכחי
export const getcurrentRole = (req: Request): string | null => {
    const token = getCurrentToken(req);
    if (!token) {
        return null;
    }
    const decoded = verifyToken(token);
    if (decoded == null) {
        return null;
    }
    const role = decoded.role;
    return role;
}

//פונקציה שמחזירה את המשתמש הנוכחי
export const getCurrentUser = async (req: Request): Promise<User> | null => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, secret) as { id: string };

        const user = await userModel.findById(payload.id);
        return user;
    } catch (err) {
        return null;
    }
}