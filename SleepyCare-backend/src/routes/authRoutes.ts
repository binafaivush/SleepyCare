import express, {NextFunction, Request, Response} from "express";
import {
     forgotPassword ,
      resetPassword, changePassword} from "../controllers/authController";
import checkUser from "../middlewares/checkUser";

const router = express.Router();

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;
// Define the POST route for forgot password
router.post("/forgot-password", forgotPassword as RouteHandler);//���� ���������������� ������ �������� ������������ ���������������� ���������� �������� ���� ��������
router.post("/reset-password/:token", resetPassword as RouteHandler);
//The next path for changing password after login
router.post("/change-password", checkUser as RouteHandler, changePassword as RouteHandler);

export default router;