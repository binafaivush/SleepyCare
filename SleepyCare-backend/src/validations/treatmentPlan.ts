// validations/treatmentPlan.ts
import { z } from 'zod';

export const treatmentPlanSchema = z.object({
  task: z.string().min(2, 'Task must be at least 2 characters'),
  description: z.string().optional(),
  dueDate: z.preprocess(
    arg => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
    z.date().optional()
  ),
  status: z.enum(['pending', 'in_progress', 'done']).optional(),
  client_id: z.string().min(1, 'Client ID is required')
});

export const updateTreatmentPlanSchema = treatmentPlanSchema.partial();