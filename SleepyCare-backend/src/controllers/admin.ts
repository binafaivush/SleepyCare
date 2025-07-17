import mongoose, { isValidObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";

import { userModel, Status, User } from "../models/users";


// Get all users with status "unapprove"
export const getUnapprovedUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const unapprovedUsers = await userModel.find({ status: "unapprove" });

        if (!unapprovedUsers || unapprovedUsers.length === 0) {
            return res.status(404).json({
                title: "No Users Found",
                message: "There are no users with status 'unapprove'"
            });
        }

        return res.status(200).json({
            title: "Users Found",
            users: unapprovedUsers
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({
                title: "Server Error",
                message: error.message
            });
        }
        return res.status(500).json({
            title: "Unknown Error",
            message: "An unexpected error occurred"
        });
    }
};


// Get all users with status "waiting"
export const getWaitingUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const waitingUsers = await userModel.find({ status: "waiting" });

        if (!waitingUsers || waitingUsers.length === 0) {
            return res.status(404).json({ 
                title: "No Users Found", 
                message: "There are no users with status 'waiting'" 
            });
        }

        return res.status(200).json({ 
            title: "Users Found", 
            users: waitingUsers 
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ 
                title: "Server Error", 
                message: error.message 
            });
        }
        return res.status(500).json({ 
            title: "Unknown Error", 
            message: "An unexpected error occurred" 
        });
    }
};

//פונקציה לעדכון סטטוס משתמש ע"י מנהל
export const updateUserStatusByAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { userId } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }

    if (!Object.values(Status).includes(status)) {
        res.status(400).json({ error: "Invalid status value" });
        return;
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        if (user.status === status) {
            res.status(400).json({ error: `User is already '${status}'` });
            return;
        }

        user.status = status;
        await user.save();

        res.status(200).json({ message: `User status updated to '${status}'`, user });
    } catch (err) {
        next(err);
    }
};




//פונקציה שהופכת את סטטוס היועץ ללא מאושר
export const unapproveUserByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        res.status(400).json({ title: "Invalid ID", message: "The provided ID is not a valid ObjectId" });
        return;
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            res.status(404).json({ title: "User Not Found", message: "No user found with the provided ID" });
            return;
        }

        if (user.status === Status.UNAPPROVE) {
            res.status(400).json({ title: "Already Unapproved", message: "User is already unapproved" });
            return;
        }

        user.status = Status.UNAPPROVE;
        await user.save();

        res.status(200).json({ message: "User has been unapproved successfully", user });
    } catch (error) {
        console.error("Error unapproving user:", error);
        next(error); // מעביר לשגיאה כללית של Express אם יש
    }
};


//פונקציה המאשרת יועץ
export const approveUserByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {

    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ title: "Invalid ID", message: "The provided user ID is not valid" });
    }

    try {
        // חיפוש המשתמש לפי ID
        const existingUser = await userModel.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ title: "User Not Found", message: "No user found with the provided ID" });
        }

        // אם המשתמש כבר מאושר
        if (existingUser.status === Status.APPROVE) {
            return res.status(400).json({ title: "Already Approved", message: "This user has already been approved" });
        }

        // עדכון הסטטוס ל-APPROVE
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: userId },
            { status: Status.APPROVE },
            { new: true }
        );

        return res.status(200).json({ title: "User Approved", user: updatedUser });

    } catch (e: any) {
        console.error("Error updating user:", e.message);
        return res.status(500).json({ title: "Server Error", message: "An error occurred while updating the user" });
    }
};

