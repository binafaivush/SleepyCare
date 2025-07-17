import { Schema, model, Types } from "mongoose";

interface Answer {
    questionnaire_id: Types.ObjectId;
    client_id: Types.ObjectId;
    question_id: string;
    answer: string | number | string[] | boolean | Date;
    submitted_at: Date;
}

export const answerSchema = new Schema<Answer>({
    questionnaire_id: {
        type: Schema.Types.ObjectId, ref: 'questionnaire',
        required: true
    },
    client_id: {
        type: Schema.Types.ObjectId, ref: 'client',
        required: true
    },
    question_id: {
        type: String,
        required: true
    },
    answer: {
        type: Schema.Types.Mixed,
        required: true
    },
    submitted_at: {
        type: Date,
        default: Date.now
    }
});

export const answerModel = model<Answer>("answer", answerSchema);
