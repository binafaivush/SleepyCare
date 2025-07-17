import axios from "axios";
import { url } from "../constants";
import { QuestionnairePayload } from "../types/question";

const URL = `${url}questionnaire`;

export const httpGetAllQuestions = async (token: string) => {
  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const httpAddQuestion = async (question: QuestionnairePayload, token: string) => {
  try {
    const response = await axios.post(`${URL}/create`, question, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving question:", error);
    throw error;
  }
};