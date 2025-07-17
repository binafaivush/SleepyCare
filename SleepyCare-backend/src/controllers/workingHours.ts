import { Request, Response, NextFunction } from "express";
import { DailyWorkingHoursModel } from "../models/workingHours";

export const getAllWorkingHours = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const workingHours = await DailyWorkingHoursModel.find()
    return res.status(200).json({ workingHours })
  }
  catch (err: unknown) {
    return res.status(400).json({
      title: "can`t get all",
      messege: err instanceof Error ? err.message : err
    })
  }
}




// הפונקציה שברכי כתבה ללא שינויים מצד ביני
// export const addWorkingHours = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { counselor_id, date, time_ranges } = req.body;

//     const workingHours = await DailyWorkingHoursModel.findOneAndUpdate(
//       { counselor_id, date },
//       { counselor_id, date, time_ranges },
//       { upsert: true, new: true }
//     );

//     res.status(201).json({ message: "Working hours added successfully", workingHours });
//   } catch (err) {
//     console.error("Error adding working hours:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// אני בעזרת גיפיטי כשראיתי שהתאריכים נוספים משובשים


//פונקציה המחזירה מערך של התאריכים בהם היועץ עובד

export const getWorkingDatesbyCounselor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { counselor_id } = req.params;

    if (!counselor_id) {
      res.status(400).json({ message: "Missing counselor_id" });
      return;
    }

    // תאריך של היום בפורמט YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // שליפת תאריכים עתידיים בלבד + time_ranges
    const workingHours = await DailyWorkingHoursModel.find({
      counselor_id,
      date: { $gte: today },
    }).select("date time_ranges").sort({ date: 1 });

    // עיצוב התגובה
    const availableDates = workingHours.map(item => ({
      date: item.date,                  // תאריך בפורמט YYYY-MM-DD
      time_ranges: item.time_ranges,   // מערך של start_time ו-end_time
    }));
console.log("📅 Available dates for counselor:", availableDates);

    res.status(200).json({message: "get available dates for counselor successful", availableDates} );
  } catch (err) {
    console.error("Error in getWorkingDatesbyCounselor:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const addWorkingHours = async (req: Request, res: Response): Promise<void> => {
  try {
    const { counselor_id, date, time_ranges } = req.body;

    console.log("📥 Incoming request data:");
    console.log("counselor_id:", counselor_id);
    console.log("date:", date);
    console.log("time_ranges (raw):", time_ranges);

    // פשוט נוודא שכל שעה היא Date תקני
    const parsedTimeRanges = time_ranges.map((range: any, index: number) => {
      const start = new Date(range.start_time);
      const end = new Date(range.end_time);

      console.log(`🔧 Processing time range #${index + 1}`);
      console.log(`start_time: ${start.toISOString()}`);
      console.log(`end_time:   ${end.toISOString()}`);

      return {
        start_time: start,
        end_time: end
      };
    });

    const workingHours = await DailyWorkingHoursModel.findOneAndUpdate(
      { counselor_id, date },
      { $set: { counselor_id, date, time_ranges: parsedTimeRanges } },
      { upsert: true, new: true }
    );

    console.log("✅ Final workingHours saved to DB:");
    console.log(JSON.stringify(workingHours, null, 2));

    res.status(201).json({ message: "Working hours added successfully", workingHours });

  } catch (err) {
    console.error("❌ Error adding working hours:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// TODO
// את הפונקציה הבאה לא בדקתי
// כאן אמור להיות פונקציה המחזירה מערך של הימים בהם היועץ עובד ובכל יום אובייקט של השעות הפנויות שלו מחולק לחצאי שעות
export const getCounselorWorkingDays = async (req: Request, res: Response): Promise<void> => {
  try {
    const { counselor_id } = req.params;

    const workingDays = await DailyWorkingHoursModel.find({ counselor_id });

    if (!workingDays || workingDays.length === 0) {
       res.status(404).json({ message: "No working days found for this counselor" });
       return;
    }

    res.status(200).json({ workingDays });
  } catch (err) {
    console.error("Error fetching counselor's working days:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};