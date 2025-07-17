import { Router, Request, Response, NextFunction } from "express";

import { generateClientAnalytics,getClientAnalytics ,getLatestClientAnalytics} from "../controllers/analyticsSummaries";
import checkUser from "../middlewares/checkUser";


const router = Router();

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;

router.get("/latest/:clientId",checkUser as RouteHandler, getLatestClientAnalytics as RouteHandler);
router.get("/:clientId",checkUser as RouteHandler, getClientAnalytics as RouteHandler);
router.post("/:clientId", generateClientAnalytics as RouteHandler);


export default router;