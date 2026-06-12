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
    const [progress, topics] = await Promise.all([
      prisma.progress.findMany({
        where: { userId: req.userId },
        include: { topic: { select: { subject: true } } },
      }),
      prisma.topic.groupBy({ by: ['subject'], _count: { id: true } }),
    ]);
    const total = progress.length;
    const completed = progress.filter(p => p.status === 'COMPLETED').length;
    const inProgress = progress.filter(p => p.status === 'IN_PROGRESS').length;
    const avgScore = progress.filter(p => p.score).reduce((s, p) => s + (p.score || 0), 0) / (progress.filter(p => p.score).length || 1);

    const bySubject = topics.map(t => {
      const subjectProgress = progress.filter(p => p.topic.subject === t.subject);
      const subjectCompleted = subjectProgress.filter(p => p.status === 'COMPLETED').length;
      return {
        subject: t.subject,
        totalTopics: t._count.id,
        completed: subjectCompleted,
        inProgress: subjectProgress.filter(p => p.status === 'IN_PROGRESS').length,
        percent: Math.round((subjectCompleted / t._count.id) * 100),
      };
    });

    res.json({ total, completed, inProgress, notStarted: total - completed - inProgress, avgScore, bySubject });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
