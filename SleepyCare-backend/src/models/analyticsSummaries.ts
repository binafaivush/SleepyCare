import { Schema, model, Types } from "mongoose";

export interface AnalyticsSummary {
    client_id: Types.ObjectId;
    start_date: Date;
    end_date: Date;
    avg_sleep_hours: number;
    avg_nap_count: number;
    summary_text: string;
}

const analyticsSummarySchema = new Schema<AnalyticsSummary>({
    client_id: { type: Schema.Types.ObjectId, ref: 'client', required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    avg_sleep_hours: { type: Number, required: true },
    avg_nap_count: { type: Number, required: true },
    summary_text: { type: String }
});

export const analyticsSummaryModel = model<AnalyticsSummary>("AnalyticsSummary", analyticsSummarySchema);
