import { answerModel } from "../models/answers";

//ממשק לתשובות הורה על לקוח מסוים ב שאלון מסוים
interface AnswerInput {
  questionnaire_id: string;
  client_id: string;
  answers: {
    question_id: string;
    answer: string;
  }[];
}

//פונקציה לשמירת תשובות הורה במסד הנתומנים
export const saveAnswers = async ({
  questionnaire_id,
  client_id,
  answers,
}: AnswerInput) => {

  const answerDocs = answers.map((item) => ({
    questionnaire_id,
    client_id,
    question_id: item.question_id,
    answer: item.answer,
  }));

  return await answerModel.insertMany(answerDocs);
};

//פונקציה לקבלת תשובות לפי לקוח
export const getAnswersByClientId = async (clientId: string) => {
    return await answerModel.find({ client_id: clientId }).lean();
  };

  //פונקציה לקבלת תשובות לפי שאלון
  export const getAnswersByQuestionnaireId = async (questionnaireId: string) => {
    return await answerModel.find({ questionnaire_id: questionnaireId }).lean();
  };

  //פונקציה לקבלת תשובות לפי מזהה שאלון ומזהה לקוח 
  export const getAnswersByQuestionnaireAndClientService = async (
    questionnaireId: string,
    clientId: string
  ) => {
    return await answerModel.find({
      questionnaire_id: questionnaireId,
      client_id: clientId,
    }).lean();
  };
  
  
  
