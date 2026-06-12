import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  userId?: string;
}

// Throttle lastActiveAt writes to once per minute per user
const lastActivityWrite = new Map<string, number>();
const ACTIVITY_WRITE_INTERVAL_MS = 60_000;

function touchLastActive(userId: string) {
  const now = Date.now();
  const last = lastActivityWrite.get(userId) || 0;
  if (now - last < ACTIVITY_WRITE_INTERVAL_MS) return;
  lastActivityWrite.set(userId, now);
  prisma.user
    .update({ where: { id: userId }, data: { lastActiveAt: new Date() } })
    .catch(() => {});
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'csvault_secret') as { userId: string };
    req.userId = payload.userId;
    touchLastActive(payload.userId);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export async function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { role: true },
    });
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
    next();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
}
