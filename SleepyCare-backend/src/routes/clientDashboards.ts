import { Router, Request, Response, NextFunction } from 'express';

import { getClientDashboard } from '../controllers/clientDashboard';
import checkCounselor from '../middlewares/checkCounselor'; 

const router = Router();

// הגדרת סוגים לפונקציות
type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// ראוט לקבלת כל הדאטה ללקוח לפי clientId עם אפשרות לסינון תאריכים
router.get('/:clientId',checkCounselor,getClientDashboard as RouteHandler);

export default router;
