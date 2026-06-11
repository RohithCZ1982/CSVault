import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { topicsRouter } from './routes/topics';
import { questionsRouter } from './routes/questions';
import { aiRouter } from './routes/ai';
import { documentsRouter } from './routes/documents';
import { progressRouter } from './routes/progress';
import { testRouter } from './routes/tests';
import { studyPlanRouter } from './routes/studyPlan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/progress', progressRouter);
app.use('/api/tests', testRouter);
app.use('/api/study-plan', studyPlanRouter);

app.get('/api/health', (_, res) => res.json({ status: 'ok', version: '1.0.0' }));

app.listen(PORT, () => {
  console.log(`CS Vault server running on port ${PORT}`);
});

export default app;
