import { Schema, model,Types } from "mongoose";
import mongooseEncryption from "mongoose-encryption";

interface SleepJournal {
    client_id: {type: Types.ObjectId, ref: 'client'};
    date: Date;
    bed_time: string;
    wake_time: string;
    nap_times: number;
    wake_ups_count: number;
    mood: string;
    notes: string;
    submitted_by_voice: boolean;
}

 export const sleepJournalSchema = new Schema<SleepJournal>({
    client_id: {type: Schema.Types.ObjectId, ref: 'client'},
    date: Date,
    bed_time: String,
    wake_time: String,
    nap_times: Number,
    wake_ups_count: Number,
    mood: String,
    notes: String,
    submitted_by_voice: Boolean
});

// הצפנת שדות רגישים ביומן שינה
sleepJournalSchema.plugin(mongooseEncryption, {
  secret: process.env.MONGO_ENCRYPTION_KEY || 'default_key',
  encryptedFields: ['mood', 'notes', 'bed_time', 'wake_time']
});

export const sleepJournalModel = model<SleepJournal>("journal", sleepJournalSchema);
