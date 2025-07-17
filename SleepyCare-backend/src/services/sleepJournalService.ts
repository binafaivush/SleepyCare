import mongoose from "mongoose";

import { sleepJournalModel } from "../models/sleepJournals";


// פונקציה שמחזירה את כל הרשומות - ליועצים בלבד!!!
export const getAllJournals = async (): Promise<any> => {
    try {
        return await sleepJournalModel.find().exec();
    } catch (error) {
        console.error("Error fetching all journals:", error);
        throw error;
    }
}

// פונקציה שמקבלת id 
// של רשומה ומחזירה את הרשומה
export const getRecordById = async (recordId: string): Promise<any> => {
    try {
        if (!mongoose.isValidObjectId(recordId)) {
            throw new Error("invalid ID format");
        }
        const record = await sleepJournalModel.findById(recordId).exec();
        return record;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
}

// פונקציה שמקבלת id של רשומה ומחזירה את הרשומה
export const updateRecordService = async (recordId: string, updatedData: any): Promise<any> => {
    if (!mongoose.isValidObjectId(recordId)) {
        throw new Error("invalid ID format");
    }
    try {
        const record = await sleepJournalModel.findByIdAndUpdate(recordId, updatedData, { new: true }).exec();
        if (!record) {
            throw new Error("Record not found");
        }
        return record;

    }
    catch (error) {
        console.error("Error updating record:", error);
        throw error;
    }
}

// פונקציה שמוחקת רשומה לפי ID
export const deleteRecordService = async (recordId: string): Promise<any> => {
    if (!mongoose.isValidObjectId(recordId)) {
        throw new Error("invalid ID format");
    }
    try {
        const record = await sleepJournalModel.findByIdAndDelete(recordId).exec();
        if (!record) {
            throw new Error("Record not found");
        }
        return record;
    }
    catch (error) {
        console.error("Error deleting record:", error);
        throw error;
    }
}

//פונקציה שמקבלת id (אפשרות סינון ךפי תאריכים) של לקוח ומחזירה את כל היומנים של הלקוח
export const getSleepJournalsByClientId = async (
    clientId: string,
    dateRange?: { start_date?: string; end_date?: string }
): Promise<any[]> => {
    if (!mongoose.isValidObjectId(clientId)) {
        throw new Error("Invalid client ID format");
    }

    const filter: any = { client_id: clientId };

    if (dateRange?.start_date || dateRange?.end_date) {
        filter.date = {};
        if (dateRange.start_date) {
            filter.date.$gte = new Date(dateRange.start_date);
        }
        if (dateRange.end_date) {
            const end = new Date(dateRange.end_date);
            end.setHours(23, 59, 59, 999);
            filter.date.$lte = end;
        }
    }

    try {
        const sleepJournals = await sleepJournalModel.find(filter).exec();
        return sleepJournals;
    } catch (error) {
        console.error("Error fetching sleep journals:", error);
        throw error;
    }
};
