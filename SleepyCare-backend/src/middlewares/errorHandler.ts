// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { NotFoundError, ValidationError } from '../utils/error';
import { logger } from '../utils/logger';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  const errorMessage = err instanceof Error ? err.message : String(err);
  logger.error(`Unhandled error: ${errorMessage}`);

  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: err.errors });
  } else if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
};