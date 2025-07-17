import mongoose from "mongoose";
import { isValidObjectId, Mongoose, Types } from "mongoose";
import { Request, Response } from "express";
import { title } from "process";

import { clientModel } from "../models/clients";
import { getClientsByCounselorId } from "../services/clientService";


// Get all clients by user_id (parent)
export const getClientsByUserID = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id } = req.params;
        if (!user_id || !isValidObjectId(user_id)) {
            res.status(400).json({ message: "Missing or invalid user_id" });
            return;
        }
        const clients = await clientModel.find({ user_id });
        if (!clients || clients.length === 0) {
            res.status(404).json({ message: "No clients found for this user_id" });
            return;
        }
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while loading clients by user_id" });
    }
};

//פונקציה להחזרת כל הלקוחות-ילדים
export const getClients = async (req: Request, res: Response): Promise<void> => {
    try {
        const clients = await clientModel.find();

        if (!clients) {
            res.status(404).json({ message: "No clients found" });
        }
        res.json(clients);
    } catch (err) {

        res.status(500).json({ title: "An error occurred while loading all clients" , message:err instanceof Error ? err.message : "Unknown error" });
    }
};

//פונקציה להוספת לקוח-ילד
export const addClient = async (req: Request, res: Response): Promise<void> => {
    try {
        let { user_id, counselor_id, child_name, child_birthdate, notes } = req.body
        if (!user_id || !counselor_id || !child_name || !child_birthdate)
            res.status(400).json({ message: "missing required fields" })

        const newClient = new clientModel({
            user_id :new mongoose.Types.ObjectId(user_id),
            counselor_id:new mongoose.Types.ObjectId(counselor_id),
            child_name,
            child_birthdate,
            notes: notes || ""
        })
        await newClient.save()
        res.status(201).json({ message: "client added succesfully", client: newClient })

    }
    catch (err) {
        res.status(400).json({ title: "an error in adding a new client" , message:err instanceof Error ? err.message : "Unknown error" });
    }
}

//פונקציה למחיקת לקוח-ילד לפי מזהה לקוח
export const deleteClient = async (req: Request, res: Response): Promise<void> => {
    let { id } = req.params;
    if (!isValidObjectId(id))
        res.status(400).json("id is not valid")
    try {
        let client = await clientModel.findById(id)
        if (!client)
            res.status(404).json({ message: "no such client" })
        let deleted = await clientModel.findByIdAndDelete(id)
        res.json(deleted)
    }
    catch (err) {
        res.status(400).json({ message: "an error in deleting a client" })
    }
}

//פונקציה לעדכון לקוח-ילד לפי מזהה לקוח
export const updateClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;  // ה-ID של הקליינט ממסלול הבקשה
        const { user_id, counselor_id, child_name, child_birthdate, notes } = req.body;

        // בודקים אם כל השדות החובה נמצאים
        if (!user_id || !counselor_id || !child_name || !child_birthdate) {
            res.status(400).json({ message: "Missing required fields" });
            return;

        }

        // מחפשים את הקליינט לפי ה-ID ומעדכנים אותו
        const updatedClient = await clientModel.findByIdAndUpdate(
            id,
            { user_id, counselor_id, child_name, child_birthdate, notes },
            { new: true }  // החזרת הקליינט המעודכן
        );

        // אם הלקוח לא נמצא
        if (!updatedClient) {
            res.status(404).json({ message: "Client not found" });
            return;
        }

        // מחזירים את הלקוח המעודכן
        res.status(200).json({ message: "Client updated successfully", client: updatedClient });

    } catch (err) {
        res.status(500).json({ message: "An error occurred while updating the client" });
    }
};

//פונקציה להחזרת כל הלקוחות של יועץ מסוים לפי מזהה יועץ
export const getClientsByCounselorID = async (req: Request, res: Response): Promise<void> => {
    try {
        const { counselor_id } = req.params;

        if (!counselor_id) {
            res.status(400).json({ message: "Missing counselor_id" });
            return;
        }

        const clients = await getClientsByCounselorId(counselor_id);

        if (!clients) {
            res.status(404).json({ message: "No clients found for this counselor_id" });
            return;
        }

        res.status(200).json(clients);
    } catch (err: any) {
        res.status(500).json({ message: err.message || "Error fetching clients by counselor_id" });
    }
};
