import { Router, Request, Response, NextFunction } from "express";

import { checkAdmin } from "../middlewares/checkAdmin";
import {approveUserByAdmin, unapproveUserByAdmin, updateUserStatusByAdmin, getWaitingUsers, getUnapprovedUsers} from "../controllers/admin";

const router = Router();

type RouteHandler = (req:Request, res:Response, next:NextFunction) => void;


router.get("/waiting",checkAdmin, getWaitingUsers as RouteHandler);
router.get("/unapprove",checkAdmin, getUnapprovedUsers as RouteHandler);
router.put("/approve/:userId", checkAdmin, approveUserByAdmin as RouteHandler);
router.put("/unapprove/:userId", checkAdmin, unapproveUserByAdmin as RouteHandler);
router.put("/update/status/:userId", 
    // checkAdmin,
     updateUserStatusByAdmin as RouteHandler);//כאן צריך לשלוח בבודי את הסטטוס שרוצים להחליף אליו

export default router;
