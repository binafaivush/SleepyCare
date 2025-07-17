// GET /sleep-journal – קבלת יומנים
// POST /sleep-journal – הוספת רשומה
// PUT /sleep-journal/{id} – עדכון רשומה
// DELETE /sleep-journal/{id} – מחיקה

import { Router, Request, Response, NextFunction } from "express";
import {checkAdmin} from '../middlewares/checkAdmin';
// import { checkAdmin, checkMiddleware } from "../middlewares/checkAdmin";
import { getJournals, addRecord, updateRecord, deleteRecord} from "../controllers/sleepJournals";

const router = Router();

// הגדרת סוגים לפונקציות
type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;

router.get("/",checkAdmin ,getJournals as RouteHandler);
router.post("/", addRecord as RouteHandler);
router.put("/:id", updateRecord as RouteHandler);
router.delete("/:id", deleteRecord as RouteHandler);

export default router;
