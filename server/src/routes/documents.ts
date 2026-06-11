import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const documentsRouter = Router();
const prisma = new PrismaClient();

documentsRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.query;
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    const documents = await prisma.document.findMany({ where, orderBy: { title: 'asc' } });
    res.json(documents);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

documentsRouter.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const doc = await prisma.document.findUnique({ where: { id: req.params.id } });
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
