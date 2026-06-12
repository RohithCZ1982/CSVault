import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { DEFAULT_TRIAL_DAYS } from '../config/plans';

export const authRouter = Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  level: z.enum(['FOUNDATION', 'EXECUTIVE', 'PROFESSIONAL']).default('FOUNDATION'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(data.password, 12);
    const now = new Date();
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        level: data.level,
        plan: 'TRIAL',
        planStartedAt: now,
        planExpiresAt: new Date(now.getTime() + DEFAULT_TRIAL_DAYS * 24 * 60 * 60 * 1000),
      },
      select: { id: true, name: true, email: true, level: true, role: true, plan: true, planExpiresAt: true, createdAt: true },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'csvault_secret', { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    await prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'csvault_secret', { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, level: true, role: true, plan: true, planExpiresAt: true, avatarUrl: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

authRouter.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, level } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name, level },
      select: { id: true, name: true, email: true, level: true, role: true, plan: true, planExpiresAt: true, avatarUrl: true },
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});
