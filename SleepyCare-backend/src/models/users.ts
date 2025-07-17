import mongoose from "mongoose";
import { ObjectId, Schema, model } from "mongoose";
import mongooseEncryption from "mongoose-encryption";

// הגדרת enum לסטטוס
export enum Status {
  APPROVE = "approve",
  UNAPPROVE = "unapprove",
  WAITING = "waiting"
}

// ממשק משתמש
export interface User {
  _id: ObjectId;
  full_name: string;
  email: string;
  password_hash: string;
  phone_number: string;
  role: 'parent' | 'counselor' | 'admin';
  created_at: Date; 
  status: Status;
}

// סכמת משתמש
const userSchema = new Schema<User>({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: {
    type: String,
    enum: ['parent', 'counselor', 'admin'],
    default: 'parent',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: function () {
      // return this.role === 'parent' ? Status.APPROVE : Status.WAITING;
      return this.role === 'parent' ? Status.APPROVE : Status.APPROVE;

    }
  },
  phone_number: { type: String }
});

// // הצפנת שדות רגישים במודל משתמש (GDPR)
// userSchema.plugin(mongooseEncryption, {
//   secret: process.env.MONGO_ENCRYPTION_KEY || 'default_key',
//   encryptedFields: ['full_name', 'email', 'phone_number']
// });

export const userModel = model<User>("user", userSchema);