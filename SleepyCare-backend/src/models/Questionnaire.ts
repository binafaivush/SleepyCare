import mongoose, { Schema, Document } from 'mongoose';

export type QuestionType = 'open' | 'yesno' | 'multiple';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // רק אם זו שאלה אמריקאית
}

export interface QuestionnaireDocument extends Document {
  consultantId: string;
  title: string;
  questions: Question[];
}

const QuestionSchema = new Schema<Question>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['open', 'yesno', 'multiple'], required: true },
  options: {
    type: [String],
    required: false,
    default: undefined, // לא יתווסף בכלל אם לא קיים
    validate: {
      validator: function(this: any, v: string[]) {
        // רק לשאלות אמריקאיות (multiple) מותר שיהיה options
        if (this.type === 'multiple') {
          return Array.isArray(v) && v.length > 0;
        } else {
          // אם זה לא multiple, options לא אמור להישלח בכלל
          return v === undefined || v.length === 0;
        }
      },
      message: 'Options must be a non-empty array only for multiple choice questions.'
    }
  }
});

const QuestionnaireSchema = new Schema<QuestionnaireDocument>({
  consultantId: { type: String, required: true },
  title: { type: String, required: true },
  questions: [QuestionSchema]
});

export const Questionnaire = mongoose.model<QuestionnaireDocument>(
  'Questionnaire',
  QuestionnaireSchema
);
