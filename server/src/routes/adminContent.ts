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

// ── Bulk import (Excel) ────────────────────────────────────────
// All-or-nothing: every row must be valid or nothing is imported.
// Row numbers in errors are 1-based spreadsheet rows (row 1 = header).

const MAX_BULK_ROWS = 1000;

const bulkBodySchema = z.object({ rows: z.array(z.record(z.unknown())).min(1).max(MAX_BULK_ROWS) });

interface RowError {
  row: number;
  message: string;
}

function zodRowMessage(err: z.ZodError): string {
  return err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
}

function parseBulkRows<T>(
  rows: unknown[],
  schema: z.ZodType<T>
): { parsed: { row: number; data: T }[]; errors: RowError[] } {
  const parsed: { row: number; data: T }[] = [];
  const errors: RowError[] = [];
  rows.forEach((row, i) => {
    const result = schema.safeParse(row);
    if (result.success) parsed.push({ row: i + 2, data: result.data });
    else errors.push({ row: i + 2, message: zodRowMessage(result.error) });
  });
  return { parsed, errors };
}

adminContentRouter.post('/topics/bulk', async (req: AuthRequest, res: Response) => {
  try {
    const { rows } = bulkBodySchema.parse(req.body);
    const { parsed, errors } = parseBulkRows(rows, topicSchema);
    if (errors.length > 0) {
      return res.status(400).json({ error: `${errors.length} row(s) have errors — nothing was imported`, rowErrors: errors });
    }
    await prisma.topic.createMany({ data: parsed.map(p => p.data) });
    res.json({ created: parsed.length });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

const bulkQuestionRowSchema = z.object({
  topicTitle: z.string().min(1),
  level: z.enum(LEVELS),
  subject: z.string().min(1),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
  answer: z.string().min(1),
  explanation: z.string().min(1),
  year: z.number().int().nullish(),
});

// Accept the answer as exact option text, a 1-based number, or a letter (A = first option)
function resolveAnswer(answer: string, options: string[]): string | null {
  const trimmed = answer.trim();
  const exact = options.find(o => o === trimmed) || options.find(o => o.toLowerCase() === trimmed.toLowerCase());
  if (exact) return exact;
  let index = -1;
  if (/^[1-9]$/.test(trimmed)) index = parseInt(trimmed) - 1;
  else if (/^[A-Za-z]$/.test(trimmed)) index = trimmed.toUpperCase().charCodeAt(0) - 65;
  return index >= 0 && index < options.length ? options[index] : null;
}

adminContentRouter.post('/questions/bulk', async (req: AuthRequest, res: Response) => {
  try {
    const { rows } = bulkBodySchema.parse(req.body);
    const { parsed, errors } = parseBulkRows(rows, bulkQuestionRowSchema);

    const topics = await prisma.topic.findMany({ select: { id: true, title: true } });
    const topicByTitle = new Map(topics.map(t => [t.title.trim().toLowerCase(), t.id]));

    const data: {
      topicId: string; type: string; level: string; subject: string; difficulty: string;
      question: string; options: string; answer: string; explanation: string; year: number | null;
    }[] = [];
    parsed.forEach(({ row, data: q }) => {
      const topicId = topicByTitle.get(q.topicTitle.trim().toLowerCase());
      if (!topicId) {
        errors.push({ row, message: `topicTitle: no topic found with title "${q.topicTitle}"` });
        return;
      }
      const answer = resolveAnswer(q.answer, q.options);
      if (!answer) {
        errors.push({ row, message: 'answer: must match one of the options (exact text, number 1-6, or letter A-F)' });
        return;
      }
      data.push({
        topicId, type: 'MCQ', level: q.level, subject: q.subject, difficulty: q.difficulty,
        question: q.question, options: JSON.stringify(q.options), answer,
        explanation: q.explanation, year: q.year ?? null,
      });
    });

    if (errors.length > 0) {
      errors.sort((a, b) => a.row - b.row);
      return res.status(400).json({ error: `${errors.length} row(s) have errors — nothing was imported`, rowErrors: errors });
    }
    await prisma.question.createMany({ data });
    res.json({ created: data.length });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

adminContentRouter.post('/documents/bulk', async (req: AuthRequest, res: Response) => {
  try {
    const { rows } = bulkBodySchema.parse(req.body);
    const { parsed, errors } = parseBulkRows(rows, documentSchema);
    if (errors.length > 0) {
      return res.status(400).json({ error: `${errors.length} row(s) have errors — nothing was imported`, rowErrors: errors });
    }
    await prisma.document.createMany({ data: parsed.map(p => p.data) });
    res.json({ created: parsed.length });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});
