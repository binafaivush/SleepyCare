import { Request, Response, NextFunction } from 'express';
import { getcurrentRole } from '../services/tokenService';

/**
 * Middleware to check if the user has one of the allowed roles
 * @param allowedRoles array of allowed roles (e.g. ['admin', 'counselor'])
 */
export function checkRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = getcurrentRole(req);
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
    }
    next();
  };
}
