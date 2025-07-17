import { Router, Request, Response, NextFunction } from "express";

import { submitAnswers,getAnswersByClient,getAnswersByQuestionnaire,getAnswersByQuestionnaireAndClient} from "../controllers/answers";
import checkParent from "../middlewares/checkParent";
import checkCounselor from "../middlewares/checkCounselor";


const router = Router();

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;

// קבלת תשובות לפי שאלון ולקוח
router.get(
    "/questionnaire/:questionnaireId/client/:clientId",
    checkCounselor,
    getAnswersByQuestionnaireAndClient as RouteHandler
  );
  
// קבלת תשובות לפי לקוח
router.get("/client/:clientId", checkCounselor,getAnswersByClient as RouteHandler);

// קבלת תשובות לפי שאלון
router.get("/questionnaire/:questionnaireId",checkCounselor, getAnswersByQuestionnaire as RouteHandler);

// שמירת תשובות על שאלון מסוים על לקוח מסוים ע"י הורה מסוים
router.post("/",checkParent ,submitAnswers as RouteHandler);

export default router;
