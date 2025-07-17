import { Request, Response, NextFunction } from "express";
import axios from "axios";


// פונקציה שמביאה את קוד האישור (Authorization Code) מזום
export const getAuthUrl = async () => {
  try {
    const credentials = {
      ZOOM_OAUTH_ENDPOINT: process.env.ZOOM_OAUTH_ENDPOINT || "",
      ZOOM_CLIENT_ID: process.env.ZOOM_CLIENT_ID || "",
      ZOOM_REDIRECT_URI: process.env.ZOOM_REDIRECT_URI || ""
    };

    const authCode = await axios.get(
      `${credentials.ZOOM_OAUTH_ENDPOINT}/authorize?response_type=code&client_id=${credentials.ZOOM_CLIENT_ID}&redirect_uri=${credentials.ZOOM_REDIRECT_URI}`
    );
    return authCode.data;
  }
  catch (error) {
    console.error("Error getting auth code:", error);
    throw error;
  }
}

