import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const topicsRouter = Router();
const prisma = new PrismaClient();

topicsRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { level, subject, search } = req.query;
    const where: Record<string, unknown> = {};
    if (level) where.level = level;
    if (subject) where.subject = subject;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { keywords: { contains: search as string } },
        { section: { contains: search as string } },
      ];
    }

    const topics = await prisma.topic.findMany({
      where,
      select: { id: true, title: true, description: true, level: true, subject: true, section: true, act: true, keywords: true, amendment: true },
      orderBy: { title: 'asc' },
    });
    res.json(topics);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

topicsRouter.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const topic = await prisma.topic.findUnique({ where: { id: req.params.id } });
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    // Fetch user progress for this topic
    const progress = await prisma.progress.findUnique({
      where: { userId_topicId: { userId: req.userId!, topicId: req.params.id } },
    });

    res.json({ ...topic, userProgress: progress?.status || 'NOT_STARTED' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

topicsRouter.post('/:id/bookmark', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.bookmark.findUnique({
      where: { userId_topicId: { userId: req.userId!, topicId: req.params.id } },
    });
    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      res.json({ bookmarked: false });
    } else {
      await prisma.bookmark.create({ data: { userId: req.userId!, topicId: req.params.id } });
      res.json({ bookmarked: true });
    }
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

topicsRouter.get('/bookmarks/all', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.userId },
      include: { topic: { select: { id: true, title: true, subject: true, level: true, section: true } } },
    });
    res.json(bookmarks.map(b => b.topic));
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
