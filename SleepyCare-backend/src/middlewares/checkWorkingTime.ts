import { Request, Response, NextFunction } from "express";
import moment from "moment-timezone";

export const validateWorkingHours = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("welcome to validateWorkingHours");
    const { counselor_id, date, time_ranges } = req.body;

    if (!counselor_id || !date || !time_ranges || !Array.isArray(time_ranges)) {
      res.status(400).json({ message: "Missing required fields: counselor_id, date, time_ranges" });
      return;
    }

    const timeRegex = /^\d{2}:\d{2}$/;

    const formattedTimeRanges = time_ranges.map((range: { start_time: string; end_time: string }) => {
      const { start_time, end_time } = range;

      if (!start_time || !end_time) {
        throw new Error("Each time range must include start_time and end_time");
      }

      if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
        throw new Error("Invalid time format. Expected HH:mm");
      }

      const startTime = moment.tz(`${date}T${start_time}`, "YYYY-MM-DDTHH:mm", "Asia/Jerusalem").toDate();
      const endTime = moment.tz(`${date}T${end_time}`, "YYYY-MM-DDTHH:mm", "Asia/Jerusalem").toDate();

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw new Error("Invalid date-time format after combining date and time");
      }

      if (startTime >= endTime) {
        throw new Error("Invalid time range: start_time must be earlier than end_time");
      }

      return { start_time: startTime, end_time: endTime };
    });

    const sortedRanges = formattedTimeRanges.sort(
      (a, b) => {
        const aStart = moment(a.start_time).tz("Asia/Jerusalem").toDate().getTime();
        const bStart = moment(b.start_time).tz("Asia/Jerusalem").toDate().getTime();
        return aStart - bStart;
      }
    );

    for (let i = 0; i < sortedRanges.length - 1; i++) {
      const currentRange = sortedRanges[i];
      const nextRange = sortedRanges[i + 1];

      const currentEnd = moment(currentRange.end_time).tz("Asia/Jerusalem").toDate().getTime();
      const nextStart = moment(nextRange.start_time).tz("Asia/Jerusalem").toDate().getTime();

      if (currentEnd > nextStart) {
        throw new Error("Overlapping time ranges are not allowed");
      }
    }

    req.body.time_ranges = formattedTimeRanges;

    next();
  } catch (err) {
    console.error("Error in validateWorkingHours:", err);
    res.status(400).json({ message: err instanceof Error ? err.message : "Invalid working hours" });
  }
};