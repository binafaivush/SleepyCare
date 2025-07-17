import mongoose, { get } from "mongoose";
import { Request, Response, NextFunction } from "express";

import { sleepJournalModel } from "../models/sleepJournals";
import {getAllJournals, getRecordById, updateRecordService, deleteRecordService} from '../services/sleepJournalService'
 

//פונקציה המחזירה את כל יומני השינה
export const getJournals = async(req: Request, res: Response, next: NextFunction): Promise<void>  => {
    try{
        const journals = await getAllJournals();
        res.status(200).json(journals); 
    }
    catch (error) {
        console.error("Error fetching journals:", error);
        res.status(500).json({ message: "Error fetching journals" });
    }
}

//פונקציה המוסיפה רשומה חדשה ליומן שינה
export const addRecord = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {client_id, bed_time, wake_time, nap_times, wake_ups_count, mood, notes} = req.body;

    if(!client_id || !bed_time || !wake_time || !nap_times || !wake_ups_count || !mood || !notes) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    if(!mongoose.isValidObjectId(client_id)) {
        res.status(400).json({ message: "Invalid ID format in client_id" });
        return;
    }
    // כאן אפשר להוסיף פונקציה שבודקת האם נשלחה הודעה קולית
    const submitted_by_voice = req.body.submitted_by_voice || false;
    try{
        const newRecord = new sleepJournalModel({...req.body, submitted_by_voice: submitted_by_voice || false});
        await newRecord.save();
        res.status(201).json(newRecord);
    }
    catch (error) {
        console.error("Error adding record:", error);
        res.status(500).json({ message: "Error adding record" });
    }
}

//פונקציה לעדכון רשומה קיימת ביומן שינה
export const updateRecord = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const { id } = req.params;
        if(!mongoose.isValidObjectId(id)) {
            res.status(400).json({ message: "Invalid ID format" });
            return;
        }
        const record = await getRecordById(id);
        if (!record) {
            res.status(404).json({ message: "Record not found" });
            return;
        }
        // יצירת אובייקט חדש עם הערכים המעודכנים
        const newRecord = {
            ...record.toObject(), 
            ...req.body 
        }
        const updatedRecord = await updateRecordService(id, newRecord);
        if (!updatedRecord) {
            res.status(404).json({ message: "Record not found" });
            return;
        }
        res.status(200).json(updatedRecord);
    }
    catch (error) {
        console.error("Error updating record:", error);
        res.status(500).json({ message: "Error updating record" });
    }
}

//פונקציה למחיקת רשומה ביומן שינה לפי מזהה
export const deleteRecord = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const { id } = req.params;
        if(!mongoose.isValidObjectId(id)) {
            res.status(400).json({ message: "Invalid ID format" });
            return;
        }
        const record = await getRecordById(id);
        if (!record) {
            res.status(404).json({ message: "Record not found" });
            return;
        }
        await deleteRecordService(id);
        res.status(200).send(record);
    }
    catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).json({ message: "Error deleting record" });
    }
}