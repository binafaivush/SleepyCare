// types/express-serve-static-core/index.d.ts

import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    /** מזהה המשתמש מתוך ה-JWT */
    userId?: string;
    /** אופציונלי: תפקיד המשתמש */
    userRole?: string;
    /** אופציונלי: כל ה-payload */
    userPayload?: JwtPayload;
  }
}
