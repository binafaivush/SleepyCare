import mongoose, {  isValidObjectId, ObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { appointmentModel } from "../models/appointments";
import { clientModel, IClient } from "../models/clients";
import jwt, { Secret, JwtPayload, verify } from 'jsonwebtoken';
import { getCurrentToken, verifyToken } from "../services/tokenService";
import {createZoomAppointment} from '../services/zoomService';
import dotenv from "dotenv"
import {calculateDuration} from "../utils/dateUtils";
import { getParentEmailByClientId, getUserEmailById, getParentIdByClientId } from "../services/users";
import { title } from "process";
import { stat } from "fs";
import { updateAppointmentService, getAppointmentsServiceById } from "../services/appointments";


export const createZoomToAppointment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const ZOOM_API_BASE_URL = process.env.ZOOM_API_BASE_URL || '';
    const {id} = req.params;
    try{

        const appointment = await getAppointmentsServiceById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const zoomMeetingData = {
            topic: "Appointment Counselor with parent",
            start_time: new Date(appointment.start_time),
            duration: calculateDuration(appointment.start_time, appointment.end_time), // פונקציה לחישוב משך הפגישה
            timezone: "UTC",
            settings: {
                join_before_host: true,
                mute_upon_entry: true,
                waiting_room: true,
                // password: "123456", // סיסמה לפגישה
                host_video: true,
                participant_video: true,
                auto_recording: "cloud",
            }
        };

        const response = await createZoomAppointment(appointment.creator_id, zoomMeetingData);
        if(response.authenticate) {
            console.log("Authenticate URL: ", response.authenticate);   
            res.status(202).json({
                massage: "Redirecting to Zoom for authentication",
                authenticate: response.authenticate 
            });
            return;
        }
        if (!response) {
            res.status(500).json({ message: "Failed to create Zoom meeting" });
            return;
        }
        console.log("appointment: ", response);


        // שמירת הפגישה במסד הנתונים
        const updateppointment = updateAppointmentService(id,{
            zoom_link: response.join_url,
            start_url: response.start_url,          
        });

        // החזרת תשובה ללקוח
        res.status(201).json({
            message: "Appointment created successfully in zoom",
            appointment: updateppointment
        });
    }
    catch (error: any) {
        console.error("Error adding appointment in zoom:", error);
        res.status(500).json({ title: "Error adding appointment in zoom", massage: error.message });
    }
}

// export const updateAppointmentInZoom = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     const { body } = req;
//     const { client_id, counselor_id, start_time, end_time } = body;
//     const appointment_id = req.params.id; // מזהה הפגישה לעדכון

//     try {
//         // הכנת נתונים ליצירת פגישה בזום

//         const zoomMeetingData = {
//             topic: "Appointment with Counselor",
//             start_time: start_time,
//             duration: calculateDuration(start_time, end_time), // פונקציה לחישוב משך הפגישה
//             timezone: "UTC",
//             settings: {
//                 join_before_host: true,
//                 mute_upon_entry: true,
//                 waiting_room: true,
//                 host_video: true,
//                 participant_video: true,
//                 auto_recording: "cloud",
//                 }
//             };
    
//             // עדכון הפגישה בזום
//             const appointment = await addAppointmentService(counselor_id, zoomMeetingData);
//             console.log("appointment: ", appointment);
            
    
//             if (!appointment) {
//                 res.status(500).json({ message: "Failed to update Zoom meeting" });
//                 return;
//             }
    
//             // עדכון הפגישה במסד הנתונים
//             const updatedAppointment = await appointmentModel.findByIdAndUpdate(
//                 appointment_id,
//                 {
//                     client_id,
//                     counselor_id,
//                     date: formattedDate,
//                     start_time,
//                     end_time,
//                     zoom_link: appointment.join_url,
//                     start_url: appointment.start_url, // קישור להתחלת הפגישה
//                     status: "scheduled"
//                 },
//                 { new: true } // מחזיר את המסמך המעודכן
//             );
    
//             if (!updatedAppointment) {
//                 res.status(404).json({ message: "Appointment not found" });
//                 return;
//             }
    
//             // החזרת תשובה ללקוח
//             res.status(200).json({
//                 message: "Appointment updated successfully",
//                 appointment: updatedAppointment
//             });
//         }
//     catch (error) {
//         console.error("Error updating appointment:", error);
//         console.error("Type of error:", typeof error);
//         res.status(500).json({ message: "Error updating appointment" });
//     }
// };
