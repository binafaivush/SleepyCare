import { Router, Request, Response, NextFunction } from "express";
import checkAdmin from '../middlewares/checkAdmin';
import checkUser from '../middlewares/checkUser';
import checkCounselor from '../middlewares/checkCounselor';
// import { getCalendar, addAppointment, updateAppointment, deleteAppointment } from "../controllers/appointments";
import {addWorkingHours, getAllWorkingHours, getWorkingDatesbyCounselor} from "../controllers/workingHours"
import { validateWorkingHours } from "../middlewares/checkWorkingTime";

const router = Router();

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;

router.post("/",
    // checkCounselor,
     validateWorkingHours, addWorkingHours as RouteHandler);
// router.post("/", validateWorkingHours, addWorkingHours as RouteHandler);
router.get("/",
    //  checkUser, checkAdmin, 
     getAllWorkingHours as RouteHandler);
router.get("/:counselor_id",getWorkingDatesbyCounselor as RouteHandler);
     // router.delete("/:id", deleteAppointment);

export default router;