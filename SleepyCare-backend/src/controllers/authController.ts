import { Request, Response } from "express";
import { Document } from "mongoose";
import { v4 as uuidv4, validate } from "uuid";
import bcryptjs from "bcryptjs";

import { ResetTokenModel } from "../models/resetToken";
import { User, userModel } from "../models/users";
import { sendResetPasswordEmail } from "../utils/sendResetEmail"
// ;את הפונקציה הזו צריך להחזיר חזרה כשמטפלים בשכחת ססמא ושליחת מייל


//פונקציה לאיפוס סיסמה
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {

    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ title: "missing details", message: "Token and new password are required" });
    }

    try {
        const resetTokens = await ResetTokenModel.find({});


        let validateToken = null
        for (const oneToken of resetTokens) {
            const isMatch = await bcryptjs.compare(token, oneToken.token);
            if (isMatch) {
                validateToken = oneToken;
            }
        }

        if (!validateToken) {
            return res.status(400).json({ message: "Invalid token" });
        }

        if (validateToken.expiresAt < new Date()) {
            return res.status(400).json({ message: "Token expired" });
        }
        const user = await userModel.findOne({ email: validateToken.email }) as Document<any, any, User> & User;
        if (!user) {
            return res.status(404).json({ message: " User not found" })
        }
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password_hash = hashedPassword;
        await user.save();

        // מחיקת הטוקן לאחר שימוש
        await ResetTokenModel.deleteOne({ _id: validateToken._id })
        return res.status(200).json({ message: "Password reset successfully" });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ title: "Internal server error", message: error instanceof Error ? error.message : error });

    }
}

// את הפונקציה הזו צריך להחזיר חזרה כשמטפלים בשכחת ססמא ושליחת מייל
// פונקציה ליצירת סיסמה חדשה ע"י שליחת מייל 
export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;
    console.log("go in function 'forgotPassword'");


    // Validate input
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete previous tokens
        await ResetTokenModel.deleteMany({ userId: user._id });

        // Generate a unique token
        const token = uuidv4();
        const hashedToken = await bcryptjs.hash(token, 10);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

        // Save the token in the database
        const resetToken = new ResetTokenModel({
            userId: user._id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt,
            email
        });
        await resetToken.save();

        // Create the reset password link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        // Send the reset email
        await sendResetPasswordEmail(email, resetLink);//אני שמתי בהערה- להפוך בחזרה לבלי הערה 

        // Respond to the client
        return res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// שינוי סיסמה לאחר התחברות
//אמור לקבל ססמא חדשה וישנה
export const changePassword = async (req: Request, res: Response): Promise<Response> => {
    console.log("go in changePasssword");
    
    const { currentPassword, newPassword } = req.body;

    // בדיקה שהשדות מולאו
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "currentPassword and newPassword are required" });
    }

    try {
        const userId = (req as any).userId; // הגיע מה-middleware דרך הטוקן

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcryptjs.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
        user.password_hash = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.error("Error in changePassword:", error);
        return res.status(500).json({ title: "Internal server error", message: error instanceof Error ? error.message : error });   
    }
};
