import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import { userModel ,Status} from "../models/users";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';


// פונקציה שמחזירה טוקן של משתמש נוכחי
export const getCurrentToken = (req: Request): string | null => {
    return req.headers['authorization']?.split(' ')[1] || null;
}

// פונקציה שמקבלת טוקן ומחלצת אותו
export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;
    } catch {
        return null; // במקרה של שגיאה, מחזירים null
    }
}

// פונקציה שמקבלת id 
// של משתמש ומחזירה את המודל של המשתמש
export const getUserModelById = async (userId: string): Promise<any> => {
    try {
        const user = await userModel.findById(userId).exec();
        return user;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
}


interface UpdateUserInput {
  full_name?: string;
  email?: string;
  phone_number?: string;
  role?: 'parent' | 'counselor' | 'admin';
  status?: Status;
}

//פונקציה לעדכון משתמש לפי מזהה
export const updateUserById = async (userId: string, data: UpdateUserInput) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw { status: 400, title: "Invalid ID", message: "The provided user ID is not valid" };
  }

  const user = await userModel.findByIdAndUpdate(userId, data, { new: true });

  if (!user) {
    throw { status: 404, title: "User Not Found", message: "No user found with the provided ID" };
  }

  return user;
};