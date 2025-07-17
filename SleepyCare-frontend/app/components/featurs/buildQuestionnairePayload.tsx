import { QuestionnairePayload, QuestionForServer,QuestionInput } from '../../types/question';
export const buildQuestionnairePayload = (
  questions: QuestionInput[],
  consultantId: string,
  title?: string
): QuestionnairePayload => {
  const payloadQuestions: QuestionForServer[] = questions.map((q, index) => {
    const baseQuestion: QuestionForServer = {
      id: `q${index + 1}`,
      text: q.text,
      type: q.type // שמור את ה-type המקורי
    };

    if (q.type === 'multiple') {
      baseQuestion.options = (q.options || []).filter(opt => opt.trim() !== '');
    }

    return baseQuestion;
  });

  return {
    consultantId,
    title,
    questions: payloadQuestions
  };
};
