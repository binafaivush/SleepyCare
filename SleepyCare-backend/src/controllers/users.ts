import mongoose, { get, isValidObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload, verify } from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import _ from "lodash";

import { getCurrentToken, verifyToken, getUserModelById, updateUserById } from "../services/userService";
import { userModel, Status, User } from "../models/users";
import { generateToken } from "../services/token";
import { clientModel, IClient } from "../models/clients";


export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const users = await userModel.find()
    return res.status(200).json({ users })
  }
  catch (err: unknown) {
    return res.status(400).json({
      title: "can`t get all",
      messege: err instanceof Error ? err.message : err
    })
  }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ title: "Invalid ID", message: "The provided user ID is not valid" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {  
      return res.status(404).json({ title: "User Not Found", message: "No user found with the provided ID" });
    }
    const userWithoutPassword = _.omit(user.toObject(), ["password_hash"]) as Omit<User, "password_hash">;
    return res.status(200).json({
      title: "User Found",
      message: "User information retrieved successfully",
      data: userWithoutPassword
    });
  } catch (error) {
    return res.status(500).json({
      title: "Server Error",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    });
  } }
// פונקציה שמחזירה טוקן של משתמש נוכחי
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // שליפת הטוקן מההדרס
  const token = getCurrentToken(req);
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    // חילוץ הטוקן
    const decoded = verifyToken(token);
    if (decoded == null) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    const userId = decoded.userId;
    // שליפת פרטי המשתמש מהמודל
    const user = await getUserModelById(userId);
    // שליחת התגובה עם פרטי המשתמש
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }

};

//פונקציה שמבצעת התחברות למערכת
export const login = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ title: "Missing Details", message: "Email and password are required" });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ title: "Invalid Email", message: "Please enter a valid email" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ title: "User Not Found", message: "Login failed" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ title: "Incorrect Password", message: "Invalid login credentials" });
    }
    if (user.status != "approve") {
      return res.status(403).json({ title: "forbiden", message: "You are not allowed to enter. Wait for the admin to Approve your entry." });

    }
    const dataWithoutPassword = _.omit(user.toObject(), ["password_hash"]) as Omit<User, "password_hash">;
    const token = generateToken(dataWithoutPassword);
    res.setHeader("Authorization", `Bearer ${token}`);

    return res.status(200).json({ user: dataWithoutPassword, token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ title: "Server Error", message: error.message });
    }
    return res.status(500).json({ error });
  }
};

//פונקציה לרישום משתמש חדש
export const register = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ title: "Missing Details", message: "Name, email, and password are required" });
  }
  if (role !== "parent" && role !== "counselor" && role !== "admin")
    return res.status(400).json({ title: "Invalid Role", message: "Role must be either 'parent', 'counselor', or 'admin'" });

  // בדיקת סיסמה: 7-15 תווים, לפחות אות אחת ומספר אחד
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{7,15}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      title: "Weak Password",
      message: "Password must be 7-15 characters long and include letters and numbers",
    });
  }

  // בדיקת אימייל
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ title: "Invalid Email", message: "Please enter a valid email" });
  }

  try {
    console.log("Registering user:", full_name, email, role);

    const existingUser = await userModel.findOne({ email }); //unique email
    if (existingUser) {
      return res.status(400).json({ title: "User Exists", message: "A user with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({ full_name: full_name, email: email, password_hash: hashedPassword, role, phone_number: req.body.phone_number ? req.body.phone_number : "" });
    await newUser.save();

    const dataWithoutPassword = _.omit(newUser.toObject(), ["password_hash"]) as Omit<User, "password_hash">;
    const token = generateToken(dataWithoutPassword);
    res.setHeader("Authorization", `Bearer ${token}`);

    return res.status(201).json({ user: dataWithoutPassword, token });
  } catch (error: any) {
    if (error.response) {
      console.error("Error response from Zoom API:");
      console.error("Status:", error.response.status);
      console.error("Status Text:", error.response.statusText);
      console.error("Data:", error.response.data);

    } else if (error.request) {
      console.error("Request:", error.request);
    } else {
      console.error("Message:", error.message);
    }
    throw error;
  }
};

//פונקציה לקבלת כתובת האימייל של משתמש לפי מזהה 
export const getUserEmailById = async (userId: string): Promise<string | null> => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return null; // משתמש לא נמצא
    }
    return user.email; // החזרת האימייל של המשתמש
  } catch (error) {
    console.error("Error retrieving user email:", error);
    return null; // במקרה של שגיאה, מחזירים null
  }
}

export const getParentEmailByClientId = async (client_Id: string): Promise<string | undefined> => {

  try {
    type PopulatedClient = IClient & { user_id: { email: string } };
    const client = await clientModel.findById(client_Id).
      populate<PopulatedClient>("user_id").
      exec();
    if (!client) {
      console.error("Client not found");
      return undefined; // לקוח לא נמצא
    }
    if (!client.user_id || !client.user_id.email) {
      console.error("User ID or email not found in client data");
      return undefined; // אימייל לא נמצא בנתוני הלקוח

    }
    const parentEmail = client.user_id.email;
    return parentEmail; // החזרת האימייל של ההורה
  }
  catch (error) {
    console.error("Error retrieving parent email:", error);
    return undefined; // במקרה של שגיאה, מחזירים null
  }
}

  // Function to delete a user by ID
  export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ title: "Invalid ID", message: "The provided user ID is not valid" });
    }

    try {
      const user = await userModel.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({ title: "User Not Found", message: "No user found with the provided ID" });
      }

      return res.status(200).json({ title: "User Deleted", message: "User successfully deleted" });
    } catch (error) {
      return res.status(500).json({ title: "Server Error", message: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  };

  //פונקציה לעדכון פרטי משתמש לפי מזהה
  export const editUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { userId } = req.params;
    // סינון שדות מותרים בלבד
    const { full_name, email, phone_number } = req.body;
    const updateData: Record<string, string> = {};
    if (full_name) updateData.full_name = full_name;
    if (email) updateData.email = email;
    if (phone_number) updateData.phone_number = phone_number;

    try {
      const updatedUser = await updateUserById(userId, updateData);

      return res.status(200).json({
        title: "User Updated",
        message: "User information was successfully updated",
        data: updatedUser
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        title: error.title || "Server Error",
        message: error.message || "An unknown error occurred"
      });
    }
  }
