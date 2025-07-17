import jwt, { Secret } from "jsonwebtoken";

import { User } from "../models/users";


export const generateToken = (user: Omit<User, 'password_hash'>): string => {
    const token = jwt.sign({ userId: user._id, userName: user.full_name, role: user.role },
        process.env.JWT_SECRET as Secret, { expiresIn: "1 day" });
    return token;
}