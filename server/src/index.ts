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
import { adminRouter } from './routes/admin';
import { adminContentRouter } from './routes/adminContent';
import { authMiddleware } from './middleware/auth';
import { requireActivePlan, requireFeature } from './middleware/plan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRouter);
app.use('/api/topics', authMiddleware, requireActivePlan, topicsRouter);
app.use('/api/questions', authMiddleware, requireActivePlan, questionsRouter);
app.use('/api/ai', authMiddleware, requireFeature('ai'), aiRouter);
app.use('/api/documents', authMiddleware, requireFeature('documents'), documentsRouter);
app.use('/api/progress', authMiddleware, requireActivePlan, progressRouter);
app.use('/api/tests', authMiddleware, requireActivePlan, testRouter);
app.use('/api/study-plan', authMiddleware, requireFeature('studyPlanner'), studyPlanRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin/content', adminContentRouter);

app.get('/api/health', (_, res) => res.json({ status: 'ok', version: '1.0.0' }));

app.listen(PORT, () => {
  console.log(`CS Vault server running on port ${PORT}`);
});

export default app;
