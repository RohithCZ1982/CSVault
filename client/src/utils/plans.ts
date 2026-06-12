export type Plan = 'TRIAL' | 'FULL' | 'PREMIUM';

export type Feature =
  | 'lawExplorer'
  | 'practice'
  | 'documents'
  | 'studyPlanner'
  | 'compliance'
  | 'ai';

// Mirrors server/src/config/plans.ts — server is the source of truth for enforcement
export const PLAN_FEATURES: Record<Plan, Feature[]> = {
  TRIAL: ['lawExplorer', 'practice'],
  FULL: ['lawExplorer', 'practice', 'documents', 'studyPlanner', 'compliance'],
  PREMIUM: ['lawExplorer', 'practice', 'documents', 'studyPlanner', 'compliance', 'ai'],
};

export const PLAN_LABELS: Record<Plan, string> = {
  TRIAL: 'Trial',
  FULL: 'Full Access',
  PREMIUM: 'Premium + AI',
};

interface PlanUser {
  role?: string;
  plan?: string;
  planExpiresAt?: string | null;
}

export function isPlanExpired(user: PlanUser | null): boolean {
  if (!user || user.role === 'ADMIN') return false;
  if (!user.planExpiresAt) return false;
  return new Date(user.planExpiresAt).getTime() < Date.now();
}

export function hasFeature(user: PlanUser | null, feature: Feature): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  if (isPlanExpired(user)) return false;
  const plan = (user.plan || 'TRIAL') as Plan;
  return (PLAN_FEATURES[plan] || PLAN_FEATURES.TRIAL).includes(feature);
}

export function planDaysLeft(user: PlanUser | null): number | null {
  if (!user?.planExpiresAt) return null;
  return Math.ceil((new Date(user.planExpiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}
