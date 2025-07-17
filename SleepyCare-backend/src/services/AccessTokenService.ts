import axios from "axios";
import mongoose from "mongoose";

import { tokenModel } from "../models/accessToken"; // טבלת ה-Tokens
import { getAuthUrl } from "./OAuthCodeService"; // פונקציה ליצירת Authorization URL


interface ZoomTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

// פונקציה לקבלת ה-Access Token של יוצר הפגישה
export const getAccessToken = async (creator_id: mongoose.Types.ObjectId): Promise<any | undefined> => {
  //שליפת הטוקן של יוצר הפגישה מהדאטהבייס
  const token = await tokenModel.findOne({ user_id: creator_id });

  // אם ה-Access Token לא קיים, מפנים את המשתמש ל-Zoom
  if (!token) {
    const authUrl = getAuthUrl();
    return ({ authenticate: authUrl });
  }

  // אם ה-Access Token תקף, מחזירים אותו
  if (token && +token.expires_at > Date.now()) {
    return token.access_token;
  }

  // אם ה-Access Token פג תוקף ויש Refresh Token, מחדשים את ה-Access Token
  if (token && token.refresh_token) {
    try {
      const tokenResponse = await axios.post<ZoomTokenResponse>(
        `${process.env.ZOOM_OAUTH_ENDPOINT}/token?grant_type=refresh_token&refresh_token=${token.refresh_token}`,
        {
          "Authorization": `Basic ${Buffer.from(
            `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      );

      // עדכון ה-Tokens בדאטהבייס 
      token.user_id = new mongoose.Types.ObjectId(creator_id); // עדכון ה-user_id אם נדרש
      token.access_token = tokenResponse.data.access_token;
      token.refresh_token = tokenResponse.data.refresh_token || token.refresh_token;
      token.expires_in = tokenResponse.data.expires_in;
      token.expires_at = Date.now() + tokenResponse.data.expires_in * 1000;
      token.scope = tokenResponse.data.scope;
      token.token_type = tokenResponse.data.token_type || token.token_type; // אם לא קיים, נשמור את הישן

      await token.save();

      return (token);

    } catch (error: any) {
      // טיפול בשגיאות - אם השגיאה היא invalid_grant, מפנים את המשתמש ל-Zoom
      if (error.response.status === 400 && error.response.data.error === "invalid_grant") {
        return ({ authenticate: getAuthUrl() });
        console.error("Error refreshing access token:", error);
        throw new Error("Failed to refresh access token");
      }
    }

  }
};