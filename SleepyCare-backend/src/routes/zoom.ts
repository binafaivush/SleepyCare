import { Router, Request, Response, NextFunction } from "express";
import checkCounselor from '../middlewares/checkCounselor';
import { createZoomToAppointment } from "../controllers/zoom";

const router = Router();

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;

router.put("/:id",checkCounselor, createZoomToAppointment as RouteHandler);


export default router;