import { Router, Request, Response, NextFunction } from "express";
import { verifyToken, getCurrentToken } from "../services/tokenService";

export const checkUserUtil = (token: string | null): any => {
  console.log("token: ", token);
  console.log("verifyToken(token) : ", verifyToken(token));

  // פונקציה לבדוק אם הטוקן בתוקף
  if (!token || !verifyToken(token)) {
    return false;

  }
  return true;


}
