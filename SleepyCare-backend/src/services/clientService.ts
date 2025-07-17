import mongoose from 'mongoose';

import { clientModel } from '../models/clients'; 


//פומקציה המחזירה הערות של לקוח מסוים
export const getClientNotesByClientId = async (
    clientId: string
): Promise<any> => {

    if (!mongoose.isValidObjectId(clientId)) {
        throw new Error("Invalid client ID format");
    }

    try {
        const client = await clientModel.findById(clientId, { notes: 1 }).exec();
        if (!client) {
            throw new Error("Client not found");
        }
        return client.notes||"";
    } catch (error) {
        console.error("Error fetching client notes:", error);
        throw error;
    }
};

//פונקציה המחזירה את כל הלקוחות של יועץ מסוים לפי מזהה יועץ
export const getClientsByCounselorId = async (counselor_id: string) => {
    if (!mongoose.isValidObjectId(counselor_id)) {
        throw new Error("Invalid counselor_id");
    }

    const clients = await clientModel.find({ counselor_id });
    return clients;
};
