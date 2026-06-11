import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const questionsRouter = Router();
const prisma = new PrismaClient();

questionsRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { level, subject, type, difficulty, limit = '20' } = req.query;
    const where: Record<string, unknown> = {};
    if (level) where.level = level;
    if (subject) where.subject = subject;
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;

    const questions = await prisma.question.findMany({
      where,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' },
    });
    res.json(questions);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

questionsRouter.get('/random', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { level, subject, count = '10' } = req.query;
    const where: Record<string, unknown> = {};
    if (level) where.level = level;
    if (subject) where.subject = subject;

    const total = await prisma.question.count({ where });
    const skip = Math.max(0, Math.floor(Math.random() * (total - parseInt(count as string))));
    const questions = await prisma.question.findMany({
      where,
      take: parseInt(count as string),
      skip,
      orderBy: { createdAt: 'asc' },
    });
    res.json(questions);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
