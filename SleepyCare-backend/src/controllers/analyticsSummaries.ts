import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import { generateAnalyticsSummary } from "../services/analyticsSummariesService";
import { analyticsSummaryModel } from "../models/analyticsSummaries";


//פונקציה המחזירה את כל ניתוחי הנתונים של קלינט(ילד) מסוים
export const getClientAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { clientId } = req.params;

  if (!clientId || typeof clientId !== "string") {
    res.status(400).json({ message: "clientId parameter is required." });
    return;
  }

  try {
    const clientObjectId = new mongoose.Types.ObjectId(clientId);

    const summaries = await analyticsSummaryModel.find({ client_id: clientObjectId });
    if (summaries.length === 0) {
      res.status(404).json({ message: "No analytics summaries found for this client." });
      return;
    }

    res.status(200).json(summaries);
  } catch (error) {
    console.error("Error fetching analytics summaries:", error);
    res.status(500).json({ message: "Server error while fetching analytics summaries." });
  }
};

//פונקציה המחזירה את ניתןח הנתונים האחרון שנעשה על קלינט(ילד) מסוים
export const getLatestClientAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { clientId } = req.params;

  if (!clientId || typeof clientId !== "string") {
    res.status(400).json({ message: "clientId query parameter is required." });
    return;
  }

  try {
    const clientObjectId = new mongoose.Types.ObjectId(clientId.trim());

    const latestSummary = await analyticsSummaryModel.findOne({ client_id: clientObjectId })
      .sort({ end_date: -1 });

    if (!latestSummary) {
      res.status(404).json({ message: "No analytics summary found for this client." });
      return;
    }

    res.status(200).json(latestSummary);
  } catch (error) {
    console.error("Error fetching latest analytics summary:", error);
    res.status(500).json({ message: "Server error while fetching analytics summary." });
  }
};

//פונקציה היוצרת ושומרת ניתוח נתונים עבור קלינט(ילד) מסוים בטווח התאריכים המתקבל
export const generateClientAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { clientId } = req.params;
    const { start_date, end_date } = req.body;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const result = await generateAnalyticsSummary(clientId, startDate, endDate);
    if ("status" in result) {
      res.status(result.status).json({ message: result.message });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("  error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


