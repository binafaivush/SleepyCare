import {Request, Response, NextFunction } from "express";


// פונקציה שמביאה את קוד האישור (Authorization Code) מזום
// אם הקוד לא קיים במטמון או פג תוקף שלו, היא מחזירה את הקוד הקיים
export const getOAuthCodeAndAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<string | unknown> => {
  const authorizationCode = req.params.code; // קוד האישור שנשלח מהזום

  if (!authorizationCode) {
    return res.status(400).send("Authorization code is missing");
  }

  console.log("Authorization Code:", authorizationCode);
  return authorizationCode; // מחזירים את קוד האישור
};