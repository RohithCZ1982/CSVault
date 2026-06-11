import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const testRouter = Router();
const prisma = new PrismaClient();

testRouter.post('/submit', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { subject, level, answers, timeTaken } = req.body;
    // answers: [{questionId, userAnswer}]
    const questionIds = answers.map((a: { questionId: string }) => a.questionId);
    const questions = await prisma.question.findMany({ where: { id: { in: questionIds } } });

    let correct = 0;
    const items = answers.map((a: { questionId: string; userAnswer: string }) => {
      const q = questions.find(q => q.id === a.questionId);
      const isCorrect = q?.answer === a.userAnswer;
      if (isCorrect) correct++;
      return { questionId: a.questionId, userAnswer: a.userAnswer, isCorrect: !!isCorrect };
    });

    const score = (correct / answers.length) * 100;
    const testResult = await prisma.testResult.create({
      data: {
        userId: req.userId!,
        subject,
        level,
        totalQ: answers.length,
        correctQ: correct,
        score,
        timeTaken,
        items: { create: items },
      },
      include: { items: { include: { question: true } } },
    });

    res.json({ ...testResult, score });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

testRouter.get('/history', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const results = await prisma.testResult.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json(results);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

testRouter.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const results = await prisma.testResult.findMany({ where: { userId: req.userId } });
    const totalTests = results.length;
    const avgScore = totalTests > 0 ? results.reduce((s, r) => s + r.score, 0) / totalTests : 0;
    const bestScore = totalTests > 0 ? Math.max(...results.map(r => r.score)) : 0;
    const subjectStats = results.reduce((acc: Record<string, number[]>, r) => {
      if (!acc[r.subject]) acc[r.subject] = [];
      acc[r.subject].push(r.score);
      return acc;
    }, {});

    res.json({ totalTests, avgScore, bestScore, subjectStats });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
