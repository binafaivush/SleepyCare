// models/treatmentPlan.ts
import { Schema, model, Types, Document } from 'mongoose';

// Enum לסטטוס של משימה טיפולית
export enum TreatmentStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

// TypeScript Interface – מייצג את המסמך ברמת הקוד
export interface ITreatmentPlan extends Document {
  task: string;
  description?: string;
  dueDate?: Date;
  status: TreatmentStatus;
  client_id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

//   סכמת Mongoose – מגדירה כיצד הנתונים נשמרים במסד הנתונים
const treatmentPlanSchema = new Schema<ITreatmentPlan>(
  {
    task: {
      type: String,
      required: [true, 'Task is required'],
      trim: true,
      minlength: [2, 'Task must be at least 2 characters']
    },
    description: {
      type: String,
      trim: true
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          return !value || value instanceof Date;
        },
        message: 'Invalid date format'
      }
    },
    status: {
      type: String,
      enum: Object.values(TreatmentStatus),
      default: TreatmentStatus.PENDING
    },
    client_id: {
      type: Schema.Types.ObjectId,
      ref: 'clients',
      required: [true, 'Client reference is required'],
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const TreatmentPlan = model<ITreatmentPlan>('TreatmentPlan', treatmentPlanSchema);