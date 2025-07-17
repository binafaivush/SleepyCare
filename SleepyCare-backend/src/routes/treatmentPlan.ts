// routes/treatmentPlanRoutes.ts
import express from 'express';
import { getAll, getById, create, update, remove, getByClientId } from '../controllers/treatmentPlan';
import { logger } from '../utils/logger';
import { errorHandler } from '../middlewares/errorHandler';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);
router.get('/by-client/:clientId', getByClientId);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

// טיפול בשגיאות ספציפי לראוטר הזה בלבד

router.use(errorHandler);

// router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   logger.error(`Error in TreatmentPlanRouter: ${err.stack || err.message}`);
//   res.status(500).json({ error: 'Something went wrong in treatment plan routes' });
// });

export default router;
