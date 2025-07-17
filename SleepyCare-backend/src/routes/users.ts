import { Router, Request, Response, NextFunction } from "express";
// import { checkAdmin, checkMiddleware } from "../middlewares/checkAdmin";
import { getCurrentUser, getAllUsers, deleteUser, editUser, login, register , getUserById} from "../controllers/users";
import checkUser from "../middlewares/checkUser";
// import { getCurrentUser, register, login} from "../controllers/users";


const router = Router();

// הגדרת סוגים לפונקציות
type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;
router.get("/:userId", getUserById as RouteHandler);
router.get("/", getAllUsers as RouteHandler);
router.get("/auth/me", checkUser as RouteHandler, getCurrentUser as RouteHandler);
router.post('/auth/login', login as RouteHandler);
router.post("/auth/register", register as RouteHandler);
router.delete("/:userId", deleteUser as RouteHandler);
router.put("/:userId", editUser as RouteHandler);

export default router;