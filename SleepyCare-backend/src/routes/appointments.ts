import { Router, Request, Response, NextFunction } from "express";
import { checkAdmin } from '../middlewares/checkAdmin';
import checkUser from '../middlewares/checkUser';
import checkCounselor from '../middlewares/checkCounselor';
// import { getCalendar, addAppointment, updateAppointment, deleteAppointment } from "../controllers/appointments";
import { addAppointment, updateAppointment, getUpcomingAppointmentsByUserId , getAppointmentsByCounselorId} from "../controllers/appointments";
import { validateAppointmentParams, validateAppointmentTime, validateUpDateAppointmentParams } from "../middlewares/checkAppointment";
import { get } from "lodash";

const router = Router();

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;

// router.get("/calendar",checkUser, getCalendar);
// router.post("/",checkCounselor, addAppointment );

router.post("/", validateAppointmentParams, addAppointment as RouteHandler);
router.put("/:id", checkUser, validateUpDateAppointmentParams, updateAppointment as RouteHandler);
router.get("/counselor/:counselor_id",
    // checkCounselor,
    getAppointmentsByCounselorId as RouteHandler);
router.get("/:user_id",
    // checkUser,
    getUpcomingAppointmentsByUserId as RouteHandler);
// router.delete("/:id", deleteAppointment);

export default router;