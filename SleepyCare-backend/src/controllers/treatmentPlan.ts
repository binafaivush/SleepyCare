import { Request, Response, NextFunction } from 'express';
import * as treatmentService from '../services/treatmentPlan';
import { treatmentPlanSchema, updateTreatmentPlanSchema } from '../validations/treatmentPlan';

export const getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await treatmentService.getAllTreatments();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const treatment = await treatmentService.getTreatmentById(req.params.id);
    if (!treatment) {
      res.status(404).json({ error: 'Treatment plan not found' });
      return;
    }
    res.json(treatment);
  } catch (err) {
    next(err);
  }
};

export const getByClientId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const clientId = req.params.clientId;
    const treatments = await treatmentService.getTreatmentsByClientId(clientId);
    res.json(treatments);
  } catch (err: unknown) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = treatmentPlanSchema.parse(req.body);
    const created = await treatmentService.createTreatmentPlan(parsed);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateTreatmentPlanSchema.parse(req.body);
    const updated = await treatmentService.updateTreatmentPlan(req.params.id, parsed);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await treatmentService.deleteTreatmentPlan(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Treatment plan not found' });
      return;
    }
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};
