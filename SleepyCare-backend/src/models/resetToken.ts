import { Schema, model } from "mongoose";

// הגדרת האינטרפייס
export interface IResetToken extends Document {
    email: string;
    token: string;
    expiresAt: Date;}

// הגדרת הסכמה
const resetTokenSchema = new Schema<IResetToken>({
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

// יצירת המודל
export const ResetTokenModel = model<IResetToken>("ResetToken", resetTokenSchema);