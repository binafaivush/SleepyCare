import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import cors from 'cors';
import resourceRouter from './src/routes/resources';
import userRouter from './src/routes/users';
import journalRouter from './src/routes/sleepJournals';
import passwordRouter from './src/routes/authRoutes';
import appointmentRouter from './src/routes/authRoutes';
import clientRouter from './src/routes/clients';
import adminRouter from './src/routes/admin';
import audioRouter from './src/routes/parentsAudios';
import OAuthRouter from './src/routes/OAuthCode';
import clientDashboardRouter from './src/routes/clientDashboards';
import { connectDB } from './src/config/DB';

import { questionnaireRouter } from './src/routes/questionnaire';
// import { connectToDB } from "./src/config/DB";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import treatmentPlanRoutes from './src/routes/treatmentPlan';

const app = express();

// התחברות לדאטהבייס (רק פעם אחת!)
// connectToDB();

connectDB();

app.use(express.json());
app.use(cors());
app.use(helmet());

// הגבלת קצב (rate limiting) לכל הבקשות
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 דקות
  max: 100, // עד 100 בקשות לכל IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/appointments', appointmentRouter);
app.use('/api/clients', clientRouter);
app.use('/api/admin', adminRouter);
app.use('/api/parents-audios', audioRouter);
app.use('/auth/zoom/callback', OAuthRouter);
app.use('/api/audio', audioRouter);
app.use('/api/client-dashboard', clientDashboardRouter);
// app.use("/api/resource", resourceRouter);
app.use('/api/sleep-journals', journalRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', passwordRouter);
app.use('/api/treatmentPlans', treatmentPlanRoutes);

let port: number = parseInt(process.env.PORT as string, 10)|| 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`app is runing on port ${port}`);
})
// נתיבים עיקריים
app.use('/api/questionnaire', questionnaireRouter);
 // app.use("/api/user", userRouter);

// טיפול ב-404 (נתיב לא קיים)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// טיפול בשגיאות גלובלי (שדרוג מומלץ)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export { app };

if (require.main === module) {
  const port: number = parseInt(process.env.PORT as string, 10) || 4000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`app is runing on port ${port}`);
  });
}
// דוגמה להוספת swagger:
// npm install swagger-ui-express yamljs
// import swaggerUi from 'swagger-ui-express';
// import YAML from 'yamljs';
// const swaggerDocument = YAML.load('./swagger.yaml');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
