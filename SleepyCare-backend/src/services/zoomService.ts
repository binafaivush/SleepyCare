import mongoose from "mongoose";
import { Schema, model,Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import dotenv from "dotenv"
import axios from "axios";
import { error } from "console";
import { getAccessToken } from "./getAccessTokenService";

interface ZoomMeetingData {
    
  }

// פונקציה שיוצרת פגישה בזום
export const createZoomAppointment = async (creator_id: mongoose.Types.ObjectId, zoomMeetingData: ZoomMeetingData): Promise<any> => {
    try {
      const ZOOM_API_BASE_URL = process.env.ZOOM_API_BASE_URL || '';
  
      // קבלת Access Token
      // getAccessToken מחזירה את ה-Access Token או URL לאימות
      // כלומר: {access_token: 123, refresh_token: 112 ...} / {authenticate: Url}
      const source = "createMeeting"
      let response = await getAccessToken(creator_id, source);
      console.log("accessToken in service: ", response);
      console.log("type of accessToken: ", typeof response);
      
    
      // אם לא נמצא access token
      // אם קיים URL לאימות, מחזירים אותו
      // אחרת זורקים שגיאה
      if (!response) {
        if(response.authenticate) {
          return response; // מחזירים את ה-URL לאימות
        }
        throw new Error("Failed to retrieve access token");
      }

      console.log("zoomMeetingData: ", zoomMeetingData);
      
      // אם ה-Access Token קיים, נבצע את הבקשה ליצירת הפגישה
      const request = await axios.post(
        `${ZOOM_API_BASE_URL}/users/me/meetings`,
        zoomMeetingData,{
         headers : { "Authorization": `Bearer ${response}`} 
        }
      );
      if (!request || !request.data) {
        console.error("Failed to create Zoom meeting:", request.data);
        throw new Error("Failed to create Zoom meeting");
        
      }
      return request.data;
    }
    catch (error: any){
        if (error.isAxiosError) {
          if (error.response) {
            // שגיאה שהתקבלה מהשרת של Zoom
            console.error("Error response from Zoom API:", {
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data,
            });
          } else if (error.request) {
            // הבקשה נשלחה אבל לא התקבלה תגובה
            console.error("No response received from Zoom API:", error.request);
          } else {
            // שגיאה בהגדרת הבקשה
            console.error("Error setting up request to Zoom API:", error.message);
          }
        } else {
          // שגיאה כללית שאינה קשורה ל-Axios
          console.error("Unexpected error:", error);
        }
        throw error;
    }
  };
  
  


