import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from './auth';
import { Feature, planHasFeature, isPlanExpired } from '../config/plans';

const prisma = new PrismaClient();

async function getPlanInfo(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, plan: true, planExpiresAt: true },
  });
}

// Blocks the request if the user's plan has expired. Admins bypass.
export async function requireActivePlan(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await getPlanInfo(req.userId!);
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (user.role === 'ADMIN') return next();
    if (isPlanExpired(user.planExpiresAt)) {
      return res.status(403).json({ error: 'Your plan has expired. Contact the administrator.', code: 'PLAN_EXPIRED' });
    }
    next();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
}

// Blocks the request unless the user's active plan includes the feature. Admins bypass.
export function requireFeature(feature: Feature) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await getPlanInfo(req.userId!);
      if (!user) return res.status(401).json({ error: 'User not found' });
      if (user.role === 'ADMIN') return next();
      if (isPlanExpired(user.planExpiresAt)) {
        return res.status(403).json({ error: 'Your plan has expired. Contact the administrator.', code: 'PLAN_EXPIRED' });
      }
      if (!planHasFeature(user.plan, feature)) {
        return res.status(403).json({ error: 'This feature is not included in your plan.', code: 'PLAN_UPGRADE_REQUIRED' });
      }
      next();
    } catch {
      res.status(500).json({ error: 'Server error' });
    }
  };
}
