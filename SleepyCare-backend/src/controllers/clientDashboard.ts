import { Request, Response,NextFunction } from 'express';

import { getClientDashboardData } from '../services/clientDashboardService';

//פונקציה המחזירה יומני שינה,הערות,הקלטות הורים-כל המידע הדרוש ליועץ, לפי מזהה לקוח עם אפשרות לסינון לפי תאריכים
export const getClientDashboard = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  const { clientId } = req.params;
  const start_date = typeof req.query.start_date === 'string' ? req.query.start_date : undefined;
  const end_date = typeof req.query.end_date === 'string' ? req.query.end_date : undefined;
  try {
    const dashboardData = await getClientDashboardData(clientId, { start_date, end_date });
    res.status(200).json(dashboardData);
  } catch (error: any) {
    console.error('Error fetching client dashboard data:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch client dashboard data' });
  }
};
