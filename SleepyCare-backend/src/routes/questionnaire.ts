import express, { Request, Response, NextFunction } from 'express';
import { createQuestionnaire, updateQuestionnaire, submitAnswers, getAllQuestionnairesForConsultant } from '../controllers/questionnaire';
import checkUser from '../middlewares/checkUser';
import { checkRole } from '../middlewares/checkRole';
 export const questionnaireRouter = express.Router();

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;

// עטיפת checkRole במידלוור Express תקני
const allow = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const result = checkRole(roles)(req, res, next);
  if (result instanceof Promise) {
    result.catch(next);
  }
};

questionnaireRouter.post('/create', checkUser, allow(['counselor', 'admin']), createQuestionnaire as RouteHandler);
questionnaireRouter.put('/update/:id', checkUser, allow(['counselor', 'admin']), updateQuestionnaire as RouteHandler);
questionnaireRouter.post('/submit', checkUser, allow(['parent', 'admin']), submitAnswers as RouteHandler);
questionnaireRouter.get('/', checkUser, allow(['counselor', 'admin']), getAllQuestionnairesForConsultant as RouteHandler);
// שליפת כל השאלונים של יועצת (רק למשתמש מחובר)
questionnaireRouter.get('/', checkUser as RouteHandler, getAllQuestionnairesForConsultant as RouteHandler);

