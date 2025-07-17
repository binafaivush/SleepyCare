import { Request, Response } from "express";

import { saveAnswers,getAnswersByClientId,getAnswersByQuestionnaireId,getAnswersByQuestionnaireAndClientService} from "../services/answerersService";
import { answerInputSchema } from "../validations/answer";


//פונקציה לשמירת תשובות של הורה על לקוח מסוים ב שאלון מסוים
export const submitAnswers = async (req: Request, res: Response) => {
  try {
    const { error } = answerInputSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    await saveAnswers(req.body);
    res.status(201).json({ message: "Answers saved successfully" });
  } catch (error: any) {
    console.error("Error saving answers:", error);
    res.status(400).json({ message: error.message || "Failed to save answers" });
  }
};

//פונקציה לקבלת תשובות לפי מזהה לקוח
export const getAnswersByClient = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const answers = await getAnswersByClientId(clientId);
    res.status(200).json(answers);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to get answers" });
  }
};

//פונקציה לקבלת תשובות לפי מזהה שאלון
export const getAnswersByQuestionnaire = async (req: Request, res: Response) => {
    try {
      const { questionnaireId } = req.params;
      const answers = await getAnswersByQuestionnaireId(questionnaireId);
      res.status(200).json(answers);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get answers" });
    }
  };

  //פונקציה לקבלת התשובות לפי מזהה שאלון ומזהה לקוח
  export const getAnswersByQuestionnaireAndClient = async (req: Request, res: Response) => {
    try {
      const { questionnaireId, clientId } = req.params;
      const answers = await getAnswersByQuestionnaireAndClientService(questionnaireId, clientId);
      res.status(200).json(answers);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get answers" });
    }
  };