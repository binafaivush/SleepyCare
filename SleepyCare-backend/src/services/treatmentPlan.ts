// services/treatmentPlanService.ts
import mongoose from 'mongoose';
import { TreatmentPlan, ITreatmentPlan, TreatmentStatus } from '../models/treatmentPlan';
import { clientModel } from '../models/clients';
import { z } from 'zod';
import { NotFoundError, ValidationError } from '../utils/error';
import { logger } from '../utils/logger';
import { treatmentPlanSchema, updateTreatmentPlanSchema } from '../validations/treatmentPlan';

type CreateTreatmentData = z.infer<typeof treatmentPlanSchema>;
type UpdateTreatmentData = z.infer<typeof updateTreatmentPlanSchema>;

export const getAllTreatments = async (): Promise<ITreatmentPlan[]> => {
  logger.info('Fetching all treatment plans');
  return await TreatmentPlan.find().lean();
};

export const getTreatmentById = async (id: string): Promise<ITreatmentPlan> => {
  logger.info(`Fetching treatment plan with id: ${id}`);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid treatment plan ID format');
  }

  const treatment = await TreatmentPlan.findById(id).lean();
  if (!treatment) throw new NotFoundError('Treatment plan not found');

  return treatment;
};

export const getTreatmentsByClientId = async (clientId: string): Promise<ITreatmentPlan[]> => {
  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    throw new ValidationError('Invalid client ID');
  }

  const treatments = await TreatmentPlan.find({ client_id: clientId }).lean();

  return treatments;
};

export const createTreatmentPlan = async (data: CreateTreatmentData): Promise<ITreatmentPlan> => {
  if (!mongoose.Types.ObjectId.isValid(data.client_id)) {
    throw new ValidationError('Invalid client_id format');
  }

  const client = await clientModel.findById(data.client_id).lean();
  if (!client) {
    throw new NotFoundError('Client not found');
  }

  const treatmentPlan = new TreatmentPlan({
    task: data.task,
    description: data.description,
    dueDate: data.dueDate,
    status: data.status || TreatmentStatus.PENDING,
    client_id: data.client_id
  });

  logger.info(`Creating treatment plan for client_id: ${data.client_id}`);

  return await treatmentPlan.save();
};

export const updateTreatmentPlan = async (id: string, data: UpdateTreatmentData): Promise<ITreatmentPlan> => {
  logger.info(`Updating treatment plan with id: ${id}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid treatment plan ID format');
  }

  if (data.client_id) {
    if (!mongoose.Types.ObjectId.isValid(data.client_id)) {
      throw new ValidationError('Invalid client_id format');
    }
    const client = await clientModel.findById(data.client_id).lean();
    if (!client) {
      throw new NotFoundError('Client not found');
    }
  }

  const updated = await TreatmentPlan.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });

  if (!updated) {
    throw new NotFoundError('Treatment plan not found for update');
  }

  return updated;
};

export const deleteTreatmentPlan = async (id: string): Promise<ITreatmentPlan> => {
  logger.info(`Deleting treatment plan with id: ${id}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid treatment plan ID format');
  }

  const deleted = await TreatmentPlan.findByIdAndDelete(id).lean();

  if (!deleted) {
    throw new NotFoundError('Treatment plan not found for deletion');
  }

  return deleted;
};