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
    const take = parseInt(count as string);
    const subjectWhere: Record<string, unknown> = {};
    if (subject) subjectWhere.subject = subject;

    const pickRandom = async (where: Record<string, unknown>, n: number, excludeIds: string[]) => {
      if (n <= 0) return [];
      const fullWhere = excludeIds.length ? { ...where, id: { notIn: excludeIds } } : where;
      const total = await prisma.question.count({ where: fullWhere });
      if (total === 0) return [];
      const skip = Math.max(0, Math.floor(Math.random() * Math.max(1, total - n)));
      return prisma.question.findMany({ where: fullWhere, take: n, skip, orderBy: { createdAt: 'asc' } });
    };

    // Prefer the user's level, then fill with other levels of the same subject
    const questions = await pickRandom(level ? { ...subjectWhere, level } : subjectWhere, take, []);
    if (questions.length < take) {
      const filler = await pickRandom(subjectWhere, take - questions.length, questions.map(q => q.id));
      questions.push(...filler);
    }
    res.json(questions);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
