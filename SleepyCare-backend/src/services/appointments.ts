import mongoose from "mongoose";
import { appointmentModel } from "../models/appointments";

export const createAppointemtService = async (appointmentData: any) => {
    try {
        const appointment = new appointmentModel(appointmentData);
        await appointment.save();
        return appointment;
    } catch (error) {
        throw new Error("Error creating appointment: " + error);
    }
}

export const getAppointmentsService = async (clientId: string) => {
    try {
        const appointments = await appointmentModel.find({ clientId });
        return appointments;
    } catch (error) {
        throw new Error("Error fetching appointments: " + error);
    }
}

export const getAppointmentsServiceById = async (id: string) => {
    try {
        const appointment = await appointmentModel.findById(id)
        if (!appointment) {
            throw new Error("Appointment not found");
        }
        return appointment;
    } catch (error) {
        throw new Error("Error fetching appointment: " + error);
    }
}

export const updateAppointmentService = async (id: string, appointmentData: any) => {
    try {
        const appointment = await appointmentModel.findByIdAndUpdate(
            id,
            {$set: appointmentData},
            { new: true }
        );
        if (!appointment) {
            throw new Error("Appointment not found");
        }
        return appointment;
    } catch (error) {
        throw new Error("Error updating appointment: " + error);
    }
}
