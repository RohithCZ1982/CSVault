import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const progressRouter = Router();
const prisma = new PrismaClient();

progressRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId: req.userId },
      include: { topic: { select: { id: true, title: true, subject: true, level: true } } },
    });
    res.json(progress);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

progressRouter.post('/:topicId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, score } = req.body;
    const progress = await prisma.progress.upsert({
      where: { userId_topicId: { userId: req.userId!, topicId: req.params.topicId } },
      update: { status, score },
      create: { userId: req.userId!, topicId: req.params.topicId, status, score },
    });
    res.json(progress);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

progressRouter.get('/summary', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const progress = await prisma.progress.findMany({ where: { userId: req.userId } });
    const total = progress.length;
    const completed = progress.filter(p => p.status === 'COMPLETED').length;
    const inProgress = progress.filter(p => p.status === 'IN_PROGRESS').length;
    const avgScore = progress.filter(p => p.score).reduce((s, p) => s + (p.score || 0), 0) / (progress.filter(p => p.score).length || 1);

    res.json({ total, completed, inProgress, notStarted: total - completed - inProgress, avgScore });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
