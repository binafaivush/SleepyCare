import { Request, Response, NextFunction } from "express";
import mongoose, { isValidObjectId } from "mongoose";

import {appointmentModel} from "../models/appointments";
import { DailyWorkingHoursModel } from "../models/workingHours";
import {getCounselorDailyHours} from "../services/workingHours";

export const validateAppointmentParams = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try{
    const { creator_id, client_id, counselor_id, start_time, end_time, status } = req.body;

    if (!creator_id || !client_id || !counselor_id || !start_time || !end_time) {
      console.log("Headers sent:", res.headersSent);
      if (!res.headersSent)
        res.status(400).json({ title: "Missing required fields ", massage: "creator_id, client_id, counselor_id, start_time and end_time are required" });
        return;
    }

    if (!mongoose.isValidObjectId(client_id)) {
      console.log("Headers sent:", res.headersSent);
      if (!res.headersSent)
        res.status(400).json({ message: "Invalid ID format in client_id" });
        return;
    }

    if (!mongoose.isValidObjectId(creator_id)) {
      console.log("Headers sent:", res.headersSent);
      if (!res.headersSent)
        res.status(400).json({ message: "Invalid ID format in creator" });
        return;
    }

    if (!mongoose.isValidObjectId(counselor_id)) {
      console.log("Headers sent:", res.headersSent);
      if (!res.headersSent)
          res.status(400).json({ message: "Invalid ID format in counselor_id" });
        return;
    }

    const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!dateTimeRegex.test(start_time) || !dateTimeRegex.test(end_time)) {
      console.log("Headers sent:", res.headersSent);
      if (!res.headersSent)
        res.status(400).json({ message: "Invalid DateTime format. Expected YYYY-MM-DD HH:mm" });
      return;
    }
    const startTime = new Date(start_time + ':00');
    const endTime = new Date(end_time + ':00');
    console.log("start_time", start_time, "end_time", end_time);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      console.error("Invalid date format", start_time, end_time);
      console.log("Headers sent:", res.headersSent);
      if (!res.headersSent)
        res.status(400).json({ message: "start_time and end_time must be valid dates" });
      return;
    }

    if(status && status !== "pending" &&  status !== "scheduled" && status !== "completed" && status !== "canceled") {
      console.log("Headers sent:", res.headersSent);
      if (!res.headersSent)
        res.status(400).json({ message: "Invalid status. Expected 'pending', 'scheduled', 'completed', or 'canceled'" });
      return;
    }
  
    validateAppointmentTime(req, res, next);
  }
  catch (err) {
    console.error("Error in validateAppointmentParams:", err);
    console.log("Headers sent:", res.headersSent);
    if (!res.headersSent)
      res.status(500).json({ title: "Error in validateAppointmentParams", message: err instanceof Error ? err.message : err });
    return;
  }
}



export const validateUpDateAppointmentParams = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try{
    const { client_id, counselor_id, start_time, end_time, status } = req.body;

    if (client_id && !mongoose.isValidObjectId(client_id)) {
      console.log("Headers sent:", res.headersSent);
      if (!res.headersSent)
        res.status(400).json({ message: "Invalid ID format in client_id" });
        return;
    }

    if (counselor_id && !mongoose.isValidObjectId(counselor_id)) {
      console.log("Headers sent:", res.headersSent);
      if (!res.headersSent)
          res.status(400).json({ message: "Invalid ID format in counselor_id" });
        return;
    }
    if(start_time && end_time){
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!dateTimeRegex.test(start_time) || !dateTimeRegex.test(end_time)) {
      console.log("Headers sent:", res.headersSent);
      if (!res.headersSent)
        res.status(400).json({ message: "Invalid DateTime format. Expected YYYY-MM-DD HH:mm" });
      return;
    }
    
      const startTime = new Date(start_time + ':00');
      const endTime = new Date(end_time + ':00');
      console.log("start_time", start_time, "end_time", end_time);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.error("Invalid date format", start_time, end_time);
        console.log("Headers sent:", res.headersSent);
        if (!res.headersSent)
          res.status(400).json({ message: "start_time and end_time must be valid dates" });
        return;
      }
    }
    if(status && status !== "pending" && status !== "scheduled" && status !== "completed" && status !== "canceled") {
      console.log("Headers sent:", res.headersSent);
      if (!res.headersSent)
        res.status(400).json({ message: "Invalid status. Expected 'pending', 'scheduled', 'completed', or 'canceled'" });
      return;
    }
    
    if(start_time && end_time)
      validateAppointmentTime(req, res, next);
    else
      next();
  }
  catch (err) {
    console.error("Error in validateAppointmentParams:", err);
    console.log("Headers sent:", res.headersSent);
    if (!res.headersSent)
      res.status(500).json({ title: "Error in validateAppointmentParams", message: err instanceof Error ? err.message : err });
    return;
  }
}


export const validateAppointmentTime = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("welcome to validatAppointmentTime");
      const { counselor_id, client_id, start_time, end_time } = req.body;
  
      if (!counselor_id || !client_id || !start_time || !end_time) {
        console.log("Headers sent:", res.headersSent);
        if (!res.headersSent)
          res.status(400).json({ title: "Missing required fields", message: "start_time, end_time and counselor_id are required" });
        return;
      }

      const startTime = new Date(start_time + ":00");
      const endTime = new Date(end_time + ":00");

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        res.status(400).json({ message: "Invalid date format. Expected YYYY-MM-DD HH:mm" });
        return;
      }

      const date = startTime.toISOString().split("T")[0]; // YYYY-MM-DD

      const dailyHours = await getCounselorDailyHours(counselor_id, startTime);

      if (!dailyHours || !dailyHours.time_ranges || !dailyHours.time_ranges.length) {
        res.status(400).json({ message: "The counselor does not work on this day" });
        return;
      }

      // בדיקת חפיפה עם אחד מרצפי השעות
      const isWithinAvailableHours = dailyHours.time_ranges.some(
        (range) => startTime >= range.start_time && endTime <= range.end_time
      );

      if (!isWithinAvailableHours) {
        res.status(400).json({ message: "The appointment time is outside of the counselor's available hours" });
        return;
      }

      const overlappingAppointment = await appointmentModel.findOne({
        client_id: new mongoose.Types.ObjectId(client_id),
        status: "scheduled",
        $or: [
          {
            start_time: { $lt: new Date(end_time) },
            end_time: { $gt: new Date(start_time) },
          },
        ],
      });
  
      console.log("after overlappingAppointment: ", overlappingAppointment);
      if (overlappingAppointment) {
          console.error("This time slot is already taken");
          console.log("Headers sent:", res.headersSent);
          if (!res.headersSent)
            res.status(409).json({ title: "This time slot is already taken.", message: "please choose an other time to an appointment, this time is'nt available" });
          return;
        }
        console.log("after if");
      // הכל תקין - ממשיכים הלאה
      next();
      
    } catch (err) {
      console.log("Headers sent:", res.headersSent);
      if (!res.headersSent)
        res.status(500).json({ title:"Error in checkTime", message: err instanceof Error ? err.message : err });
      return;
    }
  };