import { Schema, model,Types } from "mongoose";

export interface IAppointment {
    creator_id: Types.ObjectId;
    client_id: Types.ObjectId;
    counselor_id: Types.ObjectId;
    start_time: Date;
    end_time: Date;
    zoom_link: String;
    start_url: String; 
    status: "scheduled" | "completed" | "cancelled" | "pending";
}

 export const appointmentSchema = new Schema<IAppointment>({
    creator_id: {type: Schema.Types.ObjectId, ref: 'client', required: true},
    client_id: {type: Schema.Types.ObjectId, ref: 'client', required: true},
    counselor_id: {type: Schema.Types.ObjectId, ref: 'client', required: true},
    start_time: Date,
    end_time: Date,
    zoom_link: {type: String, default: null},
    start_url: { type: String, default: null }, // הוספת השדה start_url
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "pending"],
      default: "pending",
    }
});

export const appointmentModel = model<IAppointment>("appointment", appointmentSchema);
