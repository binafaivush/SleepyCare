import { Request, Response } from 'express';
import { Questionnaire } from '../models/Questionnaire';
import { AnsweredQuestionnaire } from '../models/AnsweredQuestionnaire';
import { verifyToken, getCurrentToken } from '../services/tokenService';
import { apiError } from '../utils/apiError';

export const createQuestionnaire = async (req: Request, res: Response) => {
  try {
    const { consultantId, title, questions } = req.body;

    // בדיקה כללית
    if (!consultantId || !Array.isArray(questions)) {
      return res.status(400).json(apiError(400, 'BadRequest', 'Missing consultantId or questions'));
    }
//זה השינוי שעשיתי כדי להוסיף בדיקה של שאלות
    // בדיקת תקינות כל שאלה
    for (const q of questions) {
      if (!q.id || !q.text || !q.type) {
        return res.status(400).json(apiError(400, 'BadRequest', 'Each question must include id, text, and type'));
      }

      if (q.type === "multiple") {
        if (!Array.isArray(q.options) || q.options.length === 0) {
          return res.status(400).json(apiError(400, 'BadRequest', 'Multiple choice question must have non-empty options array'));
        }
      } else {
        if (q.options && q.options.length > 0) {
          return res.status(400).json(apiError(400, 'BadRequest', 'Only multiple choice questions can have options'));
        }
      }
    }

    // יצירת השאלון לאחר בדיקות
    const newQ = await Questionnaire.create({ consultantId, title, questions });
    return res.status(201).json(newQ);

  } catch (err) {
    console.error(err); // חשוב כדי שתוכלי לראות את השגיאה
    return res.status(500).json(apiError(500, 'ServerError', 'Failed to create questionnaire'));
  }
};

export const updateQuestionnaire = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, questions } = req.body;
    const token = getCurrentToken(req);
    if (!token) return res.status(401).json(apiError(401, 'Unauthorized', 'No token provided'));
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return res.status(401).json(apiError(401, 'Unauthorized', 'Invalid token'));
    const questionnaire = await Questionnaire.findById(id);
    if (!questionnaire) return res.status(404).json(apiError(404, 'NotFound', 'Questionnaire not found'));
    if (questionnaire.consultantId !== decoded.userId) {
      return res.status(403).json(apiError(403, 'Forbidden', 'You are not the owner of this questionnaire'));
    }
    questionnaire.title = title;
    questionnaire.questions = questions;
    await questionnaire.save();
    res.json(questionnaire);
  } catch (err) {
    res.status(500).json(apiError(500, 'ServerError', 'Failed to update questionnaire'));
  }
};

export const submitAnswers = async (req: Request, res: Response) => {
  try {
    const { questionnaireId, clientId, answers } = req.body;
    if (!questionnaireId || !clientId || !Array.isArray(answers)) {
      return res.status(400).json(apiError(400, 'BadRequest', 'Missing fields in body'));
    }
    const questionnaire = await Questionnaire.findById(questionnaireId);
    if (!questionnaire) return res.status(404).json(apiError(404, 'NotFound', 'Questionnaire not found'));
    const validQuestionIds = questionnaire.questions.map((q: any) => q.id);
    for (const answer of answers) {
      if (!validQuestionIds.includes(answer.questionId)) {
        return res.status(400).json(apiError(400, 'BadRequest', `Invalid questionId: ${answer.questionId}`));
      }
    }
    const response = await AnsweredQuestionnaire.create({ questionnaireId, clientId, answers });
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json(apiError(500, 'ServerError', 'Failed to submit answers'));
  }
};

export const getAllQuestionnairesForConsultant = async (req: Request, res: Response) => {
  try {
    const token = getCurrentToken(req);
    if (!token) return res.status(401).json(apiError(401, 'Unauthorized', 'No token provided'));
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return res.status(401).json(apiError(401, 'Unauthorized', 'Invalid token'));
    const consultantId = decoded.userId;
    const questionnaires = await Questionnaire.find({ consultantId });
    res.json(questionnaires);
  } catch (err) {
    res.status(500).json(apiError(500, 'ServerError', 'Failed to fetch questionnaires'));
  }
};
