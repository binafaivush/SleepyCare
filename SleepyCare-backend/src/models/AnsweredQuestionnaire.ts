import mongoose, { Schema, Document } from 'mongoose';

export interface Answer {
  questionId: string;
  answer: string | number | boolean;
}

export interface AnsweredQuestionnaireDocument extends Document {
  questionnaireId: string;
  clientId: string;
  answers: Answer[];
}

const AnswerSchema = new Schema<Answer>({
  questionId: { type: String, required: true },
  answer: { type: Schema.Types.Mixed, required: true }
});

const AnsweredQuestionnaireSchema = new Schema<AnsweredQuestionnaireDocument>({
  questionnaireId: { type: String, required: true },
  clientId: { type: String, required: true },
  answers: [AnswerSchema]
});

export const AnsweredQuestionnaire = mongoose.model<AnsweredQuestionnaireDocument>(
  'AnsweredQuestionnaire',
  AnsweredQuestionnaireSchema
);
