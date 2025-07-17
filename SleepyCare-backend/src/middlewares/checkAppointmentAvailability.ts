import { Request, Response, NextFunction } from "express";
import mongoose, { isValidObjectId } from "mongoose";

import {appointmentModel} from "../models/appointments";

//פונקציה שבודקת אם יש תור חופף לתור חדש שנוצר
export const validateAppointmentTime = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { counselor_id, start_time, end_time } = req.body;
  
      if (!counselor_id || !start_time || !end_time) {
        return res.status(400).json({ title: "Missing required fields", message: "start_time, end_time and counselor_id are required" });
      }
  
      const overlappingAppointment = await appointmentModel.findOne({
        counselor_id: new mongoose.Types.ObjectId(counselor_id),
        status: "scheduled",
        $or: [
          {
            start_time: { $lt: new Date(end_time) },
            end_time: { $gt: new Date(start_time) },
          },
        ],
      });
  
      if (overlappingAppointment) {
        return res
          .status(409)
          .json({ title: "This time slot is already taken.", message: "please choose an other time to an appointment, this time is'nt available" });
      }
  
      // הכל תקין - ממשיכים הלאה
      return next();
      
    } catch (err) {
      return res.status(500).json({ message: err instanceof Error ? err.message : err });
    }
  };