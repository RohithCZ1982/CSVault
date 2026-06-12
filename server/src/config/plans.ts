export type Plan = 'TRIAL' | 'FULL' | 'PREMIUM';

export type Feature =
  | 'lawExplorer'
  | 'practice'
  | 'documents'
  | 'studyPlanner'
  | 'compliance'
  | 'ai';

export const PLAN_FEATURES: Record<Plan, Feature[]> = {
  TRIAL: ['lawExplorer', 'practice'],
  FULL: ['lawExplorer', 'practice', 'documents', 'studyPlanner', 'compliance'],
  PREMIUM: ['lawExplorer', 'practice', 'documents', 'studyPlanner', 'compliance', 'ai'],
};

export const DEFAULT_TRIAL_DAYS = 7;
export const PAID_PLAN_DAYS = 365;

export function isValidPlan(plan: string): plan is Plan {
  return plan === 'TRIAL' || plan === 'FULL' || plan === 'PREMIUM';
}

export function planHasFeature(plan: string, feature: Feature): boolean {
  return isValidPlan(plan) && PLAN_FEATURES[plan].includes(feature);
}

export function isPlanExpired(planExpiresAt: Date | null): boolean {
  return planExpiresAt !== null && planExpiresAt.getTime() < Date.now();
}
