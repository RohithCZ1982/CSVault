import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

export const adminContentRouter = Router();
const prisma = new PrismaClient();

adminContentRouter.use(authMiddleware, adminMiddleware);

const LEVELS = ['FOUNDATION', 'EXECUTIVE', 'PROFESSIONAL'] as const;

// ── Topics ─────────────────────────────────────────────────────

const topicSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  level: z.enum(LEVELS),
  subject: z.string().min(1),
  section: z.string().nullish(),
  act: z.string().nullish(),
  content: z.string().min(1),
  plainEnglish: z.string().min(1),
  keywords: z.string().min(1),
  amendment: z.string().nullish(),
});

adminContentRouter.get('/topics', async (_req: AuthRequest, res: Response) => {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: [{ subject: 'asc' }, { title: 'asc' }],
      include: { _count: { select: { questions: true, progress: true, bookmarks: true } } },
    });
    res.json(topics);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

adminContentRouter.post('/topics', async (req: AuthRequest, res: Response) => {
  try {
    const data = topicSchema.parse(req.body);
    const topic = await prisma.topic.create({ data });
    res.json(topic);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

adminContentRouter.put('/topics/:id', async (req: AuthRequest, res: Response) => {
  try {
    const data = topicSchema.parse(req.body);
    const topic = await prisma.topic.update({ where: { id: req.params.id }, data });
    res.json(topic);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

adminContentRouter.delete('/topics/:id', async (req: AuthRequest, res: Response) => {
  try {
    const questionCount = await prisma.question.count({ where: { topicId: req.params.id } });
    if (questionCount > 0) {
      return res.status(400).json({
        error: `This topic has ${questionCount} question(s) attached. Reassign or delete them first.`,
      });
    }
    // User-specific rows tied to the topic become meaningless once it's gone
    await prisma.progress.deleteMany({ where: { topicId: req.params.id } });
    await prisma.bookmark.deleteMany({ where: { topicId: req.params.id } });
    await prisma.topic.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Questions ──────────────────────────────────────────────────

const questionSchema = z
  .object({
    topicId: z.string().min(1),
    type: z.string().default('MCQ'),
    level: z.enum(LEVELS),
    subject: z.string().min(1),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2).max(6),
    answer: z.string().min(1),
    explanation: z.string().min(1),
    year: z.number().int().nullish(),
  })
  .refine(d => d.options.includes(d.answer), {
    message: 'The answer must exactly match one of the options',
    path: ['answer'],
  });

adminContentRouter.get('/questions', async (_req: AuthRequest, res: Response) => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: [{ subject: 'asc' }, { createdAt: 'desc' }],
      include: {
        topic: { select: { id: true, title: true } },
        _count: { select: { testResultItems: true } },
      },
    });
    res.json(questions);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

adminContentRouter.post('/questions', async (req: AuthRequest, res: Response) => {
  try {
    const { options, ...data } = questionSchema.parse(req.body);
    const question = await prisma.question.create({
      data: { ...data, options: JSON.stringify(options) },
    });
    res.json(question);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

adminContentRouter.put('/questions/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { options, ...data } = questionSchema.parse(req.body);
    const question = await prisma.question.update({
      where: { id: req.params.id },
      data: { ...data, options: JSON.stringify(options) },
    });
    res.json(question);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

adminContentRouter.delete('/questions/:id', async (req: AuthRequest, res: Response) => {
  try {
    const usedCount = await prisma.testResultItem.count({ where: { questionId: req.params.id } });
    if (usedCount > 0) {
      return res.status(400).json({
        error: `This question appears in ${usedCount} test answer(s). Deleting it would corrupt test history — edit it instead.`,
      });
    }
    await prisma.question.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Documents ──────────────────────────────────────────────────

const documentSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  template: z.string().min(1),
  tags: z.string().min(1),
});

adminContentRouter.get('/documents', async (_req: AuthRequest, res: Response) => {
  try {
    const documents = await prisma.document.findMany({ orderBy: { title: 'asc' } });
    res.json(documents);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

adminContentRouter.post('/documents', async (req: AuthRequest, res: Response) => {
  try {
    const data = documentSchema.parse(req.body);
    const document = await prisma.document.create({ data });
    res.json(document);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

adminContentRouter.put('/documents/:id', async (req: AuthRequest, res: Response) => {
  try {
    const data = documentSchema.parse(req.body);
    const document = await prisma.document.update({ where: { id: req.params.id }, data });
    res.json(document);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

adminContentRouter.delete('/documents/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.document.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
