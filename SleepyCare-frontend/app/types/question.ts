export type QuestionType = 'open' | 'yesno' | 'multiple';

export interface QuestionInput {
  type: QuestionType;
  text: string;
  options?: string[]; // חובה רק ב־multiple
  saved: boolean;
}

export interface QuestionForServer {
  id: string;
  text: string;
  type: 'text' | 'radio' | 'multiple';
  options?: string[];
}

export interface QuestionnairePayload {
  consultantId: string;
  title?: string;
  questions: QuestionForServer[];
}
