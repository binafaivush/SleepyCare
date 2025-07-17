import mongoose, { Schema, Document } from "mongoose";

interface ITimeRange {
  start_time: Date; // שעת התחלה בפורמט Date
  end_time: Date;   // שעת סיום בפורמט Date
}

export interface IDailyWorkingHours extends Document {
  counselor_id: mongoose.Types.ObjectId; // Foreign key to users collection
  date: string; // תאריך בפורמט YYYY-MM-DD
  time_ranges: ITimeRange[]; // מערך של רצפי שעות
}

const DailyWorkingHoursSchema = new Schema<IDailyWorkingHours>({
  counselor_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
  date: { type: String, required: true }, // תאריך
  time_ranges: [
    {
      start_time: { type: Date, required: true }, // שעת התחלה
      end_time: { type: Date, required: true },   // שעת סיום
    },
  ],
});

// יצירת אינדקסים על counselor_id ו-date
DailyWorkingHoursSchema.index({ counselor_id: 1, date: 1 }, { unique: true });

export const DailyWorkingHoursModel = mongoose.model<IDailyWorkingHours>(
  "daily_working_hours",
  DailyWorkingHoursSchema
);