import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';
import { DEFAULT_TRIAL_DAYS, PAID_PLAN_DAYS } from '../config/plans';

export const adminRouter = Router();
const prisma = new PrismaClient();

adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const now = Date.now();
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers, activeToday, activeWeek, newThisWeek, totalTests, totalTopics] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { lastActiveAt: { gte: dayAgo } } }),
      prisma.user.count({ where: { lastActiveAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.testResult.count(),
      prisma.topic.count(),
    ]);

    res.json({ totalUsers, activeToday, activeWeek, newThisWeek, totalTests, totalTopics });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

const assignPlanSchema = z.object({
  plan: z.enum(['TRIAL', 'FULL', 'PREMIUM']),
  trialDays: z.number().int().min(1).max(365).optional(),
  startDate: z.string().datetime().optional(),
});

adminRouter.put('/users/:id/plan', async (req: AuthRequest, res: Response) => {
  try {
    const data = assignPlanSchema.parse(req.body);
    const start = data.startDate ? new Date(data.startDate) : new Date();
    const days = data.plan === 'TRIAL' ? (data.trialDays ?? DEFAULT_TRIAL_DAYS) : PAID_PLAN_DAYS;
    const expires = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { plan: data.plan, planStartedAt: start, planExpiresAt: expires },
      select: { id: true, email: true, plan: true, planStartedAt: true, planExpiresAt: true },
    });
    res.json(user);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

adminRouter.get('/users', async (_req: AuthRequest, res: Response) => {
  try {
    const totalTopics = await prisma.topic.count();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        level: true,
        role: true,
        plan: true,
        planStartedAt: true,
        planExpiresAt: true,
        createdAt: true,
        lastActiveAt: true,
        progress: { select: { status: true } },
        testResults: { select: { score: true } },
      },
    });

    res.json(
      users.map(({ progress, testResults, ...user }) => {
        const completed = progress.filter(p => p.status === 'COMPLETED').length;
        const inProgress = progress.filter(p => p.status === 'IN_PROGRESS').length;
        const scores = testResults.map(t => t.score);
        return {
          ...user,
          topicsCompleted: completed,
          topicsInProgress: inProgress,
          totalTopics,
          testsTaken: scores.length,
          avgScore: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
          bestScore: scores.length ? Math.max(...scores) : null,
        };
      })
    );
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
