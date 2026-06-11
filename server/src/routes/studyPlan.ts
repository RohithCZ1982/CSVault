import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const studyPlanRouter = Router();
const prisma = new PrismaClient();

studyPlanRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { week } = req.query;
    const startDate = week ? new Date(week as string) : new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const plans = await prisma.studyPlan.findMany({
      where: { userId: req.userId, date: { gte: startDate, lt: endDate } },
      orderBy: { date: 'asc' },
    });
    res.json(plans);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

studyPlanRouter.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { subject, day, duration, date } = req.body;
    const plan = await prisma.studyPlan.create({
      data: { userId: req.userId!, subject, day, duration, date: new Date(date) },
    });
    res.json(plan);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

studyPlanRouter.put('/:id/complete', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const plan = await prisma.studyPlan.update({
      where: { id: req.params.id },
      data: { completed: true },
    });
    res.json(plan);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

studyPlanRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.studyPlan.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
