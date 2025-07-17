import mongoose, { Schema, model, Types } from 'mongoose';

interface IAudio {
    client_id: Types.ObjectId;
    fileName: string;
    fileData: Buffer;
    fileType: string;
    createdAt?: Date;
    transcriptionRef?: mongoose.Types.ObjectId | null; // מפתח זר או null
}

export const AudioSchema = new Schema<IAudio>({
    client_id: {
        type: Schema.Types.ObjectId,
        ref: 'client'
    },
    fileName: {
        type: String,
        required: true
    },
    fileData: {
        type: Buffer,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    transcriptionRef: {
        type: Schema.Types.ObjectId,
        ref: 'SleepJournal',   
        default: null
    }
});

export const audioModel = model<IAudio>('ParentsAudio', AudioSchema);


