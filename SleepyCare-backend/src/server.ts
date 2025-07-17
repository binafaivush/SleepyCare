
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import appointmentRouter from "./routes/appointments";
import OAuthRouter from "./routes/OAuthCode";
import journalRouter from "./routes/sleepJournals";
import userRouter from "./routes/users";
import adminRouter from "./routes/admin";
import analyticsRouter from "./routes/analyticsSummaries";
import audioRouter from './routes/parentsAudios';
import clientDashboardRoter from './routes/clientDashboards';
import answersarouter from './routes/answers';
import clientRouter from "./routes/clients";
import passwordRouter from "./routes/authRoutes";
import workingHours from "./routes/workingHours";
import {connectDB} from "./config/DB";
import {questionnaireRouter} from "./routes/questionnaire";
dotenv.config();
const app = express();
connectDB();
app.use(cors() as unknown as (req: Request, res: Response, next: NextFunction) => void);
app.use(express.json());

app.use("/api/working-hours", workingHours);
app.use("/api/appointment", appointmentRouter);
app.use("/api/client", clientRouter);
app.use("/api/user", userRouter);
app.use("/auth/zoom/callback", OAuthRouter);
app.use("/api/sleep-journals", journalRouter);
app.use('/api/audio', audioRouter);
app.use("/api/analytic", analyticsRouter);
app.use("/api/admin", adminRouter);
app.use('/api/parents-audios', audioRouter);
app.use("/api/client-dashboard", clientDashboardRoter);
app.use("/api/answer", answersarouter);
app.use("/api/auth", passwordRouter)
app.use("/api/questionnaire",questionnaireRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});