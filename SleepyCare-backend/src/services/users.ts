import mongoose from "mongoose";
import { clientModel, IClient } from "../models/clients";
import { userModel } from "../models/users";

export const getParentIdByClientId = async (client_Id: mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId | undefined> => {
    try {
        const clientDoc = await clientModel.findById(client_Id).exec();
        const parentId = clientDoc ? clientDoc.user_id : null; 
        if(!parentId) {
            console.error("Parent ID not found for client ID:", client_Id);
            return undefined; // במקרה של שגיאה, מחזירים null
        }
        console.log("parentId", parentId);
        //@ts-ignore
        return parentId ; // מחזירים את ה-ID של ההורה
    }   
    catch (error) {
        console.error("Error retrieving parent ID:", error);
        return undefined; // במקרה של שגיאה, מחזירים null
    }
}

export const getUserEmailById = async (userId: mongoose.Types.ObjectId): Promise<string | null> => {
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

export const getUserIdByEmail = async (email: string): Promise<string | null> => {
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return null; // משתמש לא נמצא
        }
        return user._id.toString(); // החזרת ה-ID של המשתמש כמחרוזת
    } catch (error) {
        console.error("Error retrieving user ID:", error);
        return null; // במקרה של שגיאה, מחזירים null
    }   
};

export const getParentEmailByClientId = async (client_Id: string): Promise<String | undefined> => {
     
    try{
        console.log("welcome to getParentEmailByClientId function");
        if(!client_Id) {
            console.error("Client ID is missing");
            return undefined; // מזהה הלקוח חסר
        }
        console.log("client_Id", client_Id);
        
        // שליפת פרטי הלקוח מהמודל
        type PopulatedClient = IClient & { user_id: {
            _id: mongoose.Types.ObjectId,
            full_name: String,
            email: String,
            password_hash: String,
            role: {
                type: String,
                enum: ['parent', 'counselor', 'admin'], // אפשרויות תפקידים
                default: 'parent' 
            },
            phone_number: String
            } };
        console.log("after PopulatedClient");
        
        const client = await clientModel.findById(client_Id).
        populate<PopulatedClient>("user_id").
        exec();
        if (!client) {
            console.error("Client not found");
            return undefined; // לקוח לא נמצא
        }
        console.log("client", client);
        
        if (!client.user_id || !client.user_id.email) {
            console.error("User ID or email not found in client data");
            return undefined; // אימייל לא נמצא בנתוני הלקוח

        }
        const parentEmail = client.user_id.email;
        return parentEmail; // החזרת האימייל של ההורה
        }
        catch(error){
            console.error("Error retrieving parent email:", error);
            return undefined; // במקרה של שגיאה, מחזירים null
        }
}


