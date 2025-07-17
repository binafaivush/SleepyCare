import mongoose from "mongoose";
import { DailyWorkingHoursModel, IDailyWorkingHours } from "../models/workingHours";



export const getCounselorDailyHours = async (counselorId: string, date1: Date) => {
    try {


        const dailyHours = await DailyWorkingHoursModel.findOne({
            counselor_id: new mongoose.Types.ObjectId(counselorId),
            date: date1.toISOString().split("T")[0], // YYYY-MM-DD
        });
        if (!dailyHours) {
            throw new Error("Daily working hours not found");
        }
        return dailyHours;
    } catch (error) {
        console.error("Error fetching counselor's daily hours:", error);
        throw new Error("Error fetching counselor's daily hours");
    }

}

export const updateTimeRange = async (startTime: Date, endTime: Date, dailyHours: IDailyWorkingHours) => {
    try {
            {
                const updatedTimeRanges = dailyHours.time_ranges
                .flatMap((range) => {
                    // אם הפגישה חופפת לרצף השעות הזה, נעדכן אותו
                    if (startTime >= range.start_time && endTime <= range.end_time) {
                        const newRanges = [];
                        if (startTime > range.start_time) {
                            newRanges.push({ start_time: range.start_time, end_time: startTime });
                        }
                        if (endTime < range.end_time) {
                            newRanges.push({ start_time: endTime, end_time: range.end_time });
                        }
                        return newRanges;
                    }
                    // אם אין חפיפה, נשאיר את הרצף כפי שהוא
                    return [range];
                });
                // עדכון השעות הפנויות במסד הנתונים
                dailyHours.time_ranges = updatedTimeRanges;
                await dailyHours.save();
                return dailyHours;
            }
        }
    catch (error) {
        console.error("Error updating time ranges:", error);
        throw new Error("Error updating time ranges");
    }
}
