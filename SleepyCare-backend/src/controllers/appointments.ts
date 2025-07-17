import mongoose, { get, isValidObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload, verify } from 'jsonwebtoken';

import { appointmentModel } from "../models/appointments";
import { createAppointemtService, updateAppointmentService } from "../services/appointments";
import { getCounselorDailyHours } from "../services/workingHours";
import { updateTimeRange } from "../services/workingHours";
import { getParentIdByClientId } from "../services/users";


export const addAppointment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const ZOOM_API_BASE_URL = process.env.ZOOM_API_BASE_URL || '';
    const { creator_id, client_id, counselor_id, start_time, end_time } = req.body;
    console.log(creator_id, client_id, counselor_id, start_time, end_time)
    try {
        console.log("welcome to addApointment in controllers");
        // בדיקה אם הפגישה נוצרה ע"י היועץ - 
        // הסטטוס יהיה "schedules"
        // אם הפגישה נוצרה ע"י ההורה - הסטטוס יהיה "pending"
        let status = "pending"; // ברירת מחדל לסטטוס הפגישה
        const parentId = await getParentIdByClientId(client_id);
        console.log("parentId in controller: ", parentId);
        if (!parentId) {
            return res.status(400).json({ message: "Parent ID not found" });
        }
        if (parentId == creator_id) {
            status = "pending";
        }
        else {
            if (counselor_id == creator_id) {
                status = "scheduled";
            }
            else
                return res.status(400).json({ massage: "Creator is not a valid user" });
        }

        console.log("status in controller: ", status);
        // שמירת הפגישה במסד הנתונים
        const newAppointment = await createAppointemtService(
            {
                creator_id,
                client_id,
                counselor_id,
                start_time,
                end_time,
                status
            }
        )

        console.log("newAppointment in controller: ", newAppointment);

        const startTime = new Date(start_time + ":00");
        const endTime = new Date(end_time + ":00");

        const dailyHours = await getCounselorDailyHours(counselor_id, startTime);

        if (!dailyHours) {
            res.status(404).json({ message: "Daily working hours not found" });
            return;
        }

        const newDailyHours = await updateTimeRange(startTime, endTime, dailyHours);
        console.log("Updated daily hours:", newDailyHours);
        console.log("Updated working hours for counselor:", counselor_id);

        //יצירת הודעה ליועץ ולהורה על יצירת הפגישה
        // let counselorNote = "dear " + counselor_id + ", a new appointment has been created with " + client_id + " on " + start_time;
        // let parentNote = "dear " + parentId + ", a new appointment has been created with " + counselor_id + " on " + start_time + ". please check your calendar.";

        // if(status == "pending") 
        //     counselorNote += ". to confirm press hear"

        // כאן להוסיף את ההודעה לטבלת ההודעות שתיווצר בהמשך


        console.log("Headers sent:", res.headersSent);
        if (!res.headersSent) {
            res.status(201).json({
                message: "Appointment created successfully",
                appointment: newAppointment
            });
            return;
        }
    }
    catch (error: any) {
        console.error("Error adding appointment:", error);
        if (!res.headersSent) {
            res.status(500).json({ title: "Error adding appointment", massage: error.message });
            return;
        }
    }
};

export const updateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { body } = req;
    const { client_id, counselor_id, start_time, end_time, status } = body;
    const appointment_id = req.params.id;

    const updateData: any = {
        start_time,
        end_time,
        status
    };

    try {

        // עדכון הפגישה במסד הנתונים
        const updatedAppointment = await updateAppointmentService(appointment_id, updateData);
        console.log("updatedAppointment in controller: ", updatedAppointment);
        if (!updatedAppointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }


        // יצירת תזכורת על שינוי הפגישה ליועץ ולהורה

        // const parentId = await getParentIdByparentId(client_id);        

        // let counselorNote = "dear " + counselor_id + ", your appointment with " + client_id + " has been updated to " + start_time;
        // let parentNote = "dear " + parentId + ", your appointment with " + counselor_id + " has been updated to " + start_time + ". please check your calendar.";

        // if(status == "pending") 
        //     counselorNote += ". to confirm press hear"

        //כאן להוסיף הודעה ליועץ וההורה בטבלת הודעות בהמשך

        // החזרת תשובה ללקוח
        res.status(200).json({
            message: "Appointment updated successfully",
            appointment: updatedAppointment
        });
    }
    catch (error) {
        console.error("Error updating appointment:", error);
        console.error("Type of error:", typeof error);
        res.status(500).json({ message: "Error updating appointment" });
    }
};


//פונקציה המחזירה פגישות עתידיות לפי מזהה משתמש
export const getUpcomingAppointmentsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response> => {
    console.log("welcome to getUpcomingAppointmentsByUserId function");
    try {

        // user_id חובה ב-params, date לא חובה ב-query
        const parentId = req.params.user_id as string | undefined;
        const dateStr = req.query.date as string | undefined;
        console.log("1.user_id", parentId)

        if (!parentId || !isValidObjectId(parentId)) {
            return res.status(400).json({
                title: "Missing or invalid user_id",
                message: "the user_id is missing or not in correct ObjectId format"
            });
        }

        //  בניית תאריך התחלה (או היום כברירת־מחדל)
        const fromDate = dateStr
            ? new Date(dateStr)
            : new Date();
        if (dateStr && isNaN(fromDate.getTime())) {
            return res.status(400).json({
                title: "Invalid date",
                message: "the `date` query param is not a valid ISO date string"
            });
        }
        console.log("2.user_id", parentId)

        //  המרת LIMIT לספרה עם בסיס 10
        const limit = Math.max(parseInt(process.env.LIMIT_APPOINTMENTS ?? "4", 10), 1);
        const appointments = await appointmentModel.find({
            creator_id: parentId,
            // date: { $gt: fromDate },
            // status: "scheduled",
        })
            .sort({ date: 1 }) //מיון התאריכים בסדר עולה
            // .limit(limit); //כמה פגישות להציג למשתמש

        //  מענה אם אין תוצאות
        if (appointments.length === 0) {
            return res.status(404).json({
                title: "No Appointments Found",
                message: `No upcoming appointments for user ${parentId}`
            });
        }

        //  החזרת התוצאות הטובות
        return res.status(200).json({ appointments });
    }

    catch (err) {
        return res.status(500).json({
            title: "Internal Server Error",
            message: err instanceof Error ? err.message : err
        });
    }
};



export const getAppointmentsByCounselorId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response> => {
    try {
        // קבלת counselor_id מ־params במקום query
        const counselorId = req.params.counselor_id as string | undefined;

        if (!counselorId || !isValidObjectId(counselorId)) {
            return res.status(400).json({
                title: "Missing or invalid counselor_id",
                message: "The counselor_id is missing or not a valid ObjectId"
            });
        }

        const appointments = await appointmentModel.find({ counselor_id: counselorId })
            .sort({ date: 1 });

        if (appointments.length === 0) {
            return res.status(404).json({
                title: "No Appointments Found",
                message: `No appointments found for counselor ${counselorId}`
            });
        }

        return res.status(200).json({ appointments });
    } catch (err) {
        return res.status(500).json({
            title: "Internal Server Error",
            message: err instanceof Error ? err.message : err
        });
    }
}

// פונקציה לקבלת פגישות מחר לפי מזהה משתמש
export const getTomorrowAppointmentsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response> => {
    try {
        // קבלת client_id מ־params במקום query
        const parentId = req.params.client_id as string | undefined;

        if (!parentId || !isValidObjectId(parentId)) {
            return res.status(400).json({
                title: "Missing or invalid client_id",
                message: "The client_id is missing or not a valid ObjectId"
            });
        }

        // חישוב תחילת מחר
        const now = new Date();
        const tomorrowStart = new Date(now);
        tomorrowStart.setDate(now.getDate() + 1);
        tomorrowStart.setHours(0, 0, 0, 0);

        // חישוב סוף מחר
        const tomorrowEnd = new Date(tomorrowStart);
        tomorrowEnd.setHours(23, 59, 59, 999);

        const appointments = await appointmentModel.find({
            client_id: parentId,
            date: { $gte: tomorrowStart, $lte: tomorrowEnd },
            status: "scheduled",
        }).sort({ date: 1 });

        if (appointments.length === 0) {
            return res.status(404).json({
                title: "No Appointments Found",
                message: `No appointments for ${parentId} on ${tomorrowStart.toDateString()}`
            });
        }

        return res.status(200).json({ appointments });
    } catch (err) {
        return res.status(500).json({
            title: "Internal Server Error",
            message: err instanceof Error ? err.message : err
        });
    }
};

//פונקציה לבביטול פגישה לפי מזהה פגישה
export const cancelAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response> => {
    try {
        const { _id } = req.params;


        if (!_id || !isValidObjectId(_id)) {//parentId- ולידציה ל
            return res.status(400).json({
                title: "Invalid appointment ID",
                message: "_id is missing or not a valid ObjectId"
            });
        }

        //"cancelled" עדכון הסטטוס ל־
        const appointment = await appointmentModel.findByIdAndUpdate(
            _id,
            { status: "cancelled" },
            { new: true }       // מחזיר את המסמך אחרי העדכון
        );

        //_id  -טיפול במקרה שלא נמצא מסמך עם ה
        if (!appointment) {
            return res.status(404).json({
                title: "Appointment not found",
                message: `No appointment with id ${_id}`
            });
        }

        //  החזרת המסמך המעודכן
        return res.status(200).json({ appointment });

    }
    catch (err) {
        return res.status(500).json({
            title: "Internal Server Error",
            message: err instanceof Error ? err.message : err
        });
    }
};
