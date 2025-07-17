import mongoose from "mongoose";

import { sleepJournalModel } from "../models/sleepJournals";
import { analyticsSummaryModel } from "../models/analyticsSummaries";


// פונקציה המחשבת ניתוח נתונים עבור קלינט(ילד) מסוים בטווח התאריכים המתקבל
export const generateAnalyticsSummary = async (
  clientId: string,
  startDate: Date,
  endDate: Date
): Promise<
  | {
    message: string;
    average_sleep_hours: string;
    average_nap_count: string;
    summary_text: string
  }
  | {
    status: number;
    message: string;
  }
> => {
  try {
    const clientObjectId = new mongoose.Types.ObjectId(clientId);
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);
    
    const journals = await sleepJournalModel.find({
      client_id: clientObjectId,
      date:{$gte:startDate, $lte: adjustedEndDate}
    });

    if (journals.length === 0) {
      console.log("No sleep journals found for the given date range." )
      return { status: 404, message: "No sleep journals found for the given date range." };
    }

    let totalSleepHours = 0;
    let totalNaps = 0;
    const notesSummary: string[] = [];

    for (const journal of journals) {
      let bedH = 0, bedM = 0, wakeH = 0, wakeM = 0;

      try {
        if (typeof journal.bed_time === "string" && /^\d{1,2}:\d{2}$/.test(journal.bed_time)) {
          const [h, m] = journal.bed_time.split(":").map(Number);
          if (!isNaN(h) && !isNaN(m)) {
            bedH = h;
            bedM = m;
          }
        }

        if (typeof journal.wake_time === "string" && /^\d{1,2}:\d{2}$/.test(journal.wake_time)) {
          const [h, m] = journal.wake_time.split(":").map(Number);
          if (!isNaN(h) && !isNaN(m)) {
            wakeH = h;
            wakeM = m;
          }
        }
      } catch (timeErr) {
        console.warn(`Invalid time format in journal on ${journal.date}:`, timeErr);
        continue; // דלג על היומן הנוכחי אם יש בעיה בפורמט השעות
      }

      let sleepTime = (wakeH + wakeM / 60) - (bedH + bedM / 60);
      if (sleepTime < 0) sleepTime += 24;

      totalSleepHours += sleepTime;
      totalNaps += journal.nap_times ?? 0;

      notesSummary.push(
        `🗓 ${journal.date.toDateString()} -  mood: ${journal.mood}, notes: ${journal.notes}`
      );
    }

    const avgSleep = totalSleepHours / journals.length;
    const avgNaps = totalNaps / journals.length;

    await analyticsSummaryModel.findOneAndUpdate(
      {
        client_id: clientObjectId,
        start_date: startDate,
        end_date: endDate,
      },
      {
        client_id: clientObjectId,
        start_date: startDate,
        end_date: endDate,
        avg_sleep_hours: avgSleep,
        avg_nap_count: avgNaps,
        summary_text: notesSummary.join("\n"),
      },
      { upsert: true, new: true }
    );

    return {
      message: "Sleep analytics summary saved successfully.",
      average_sleep_hours: avgSleep.toFixed(2),
      average_nap_count: avgNaps.toFixed(2),
      summary_text: notesSummary.join("\n"),
    };
  } catch (err) {
    console.error("Error in generateAnalyticsSummary:", err);
    return {
      status: 500,
      message: "Internal error occurred while generating analytics summary.",
    };
  }
};

