/**
 * CreditBridge Scoring Algorithm
 * Calculates a score from 300 to 900 based on alternative data.
 */

export interface ScoringData {
  incomeStability: number; // 0-100
  paymentBehavior: number; // 0-100
  spendingDiscipline: number; // 0-100
  digitalVolume: number; // 0-100
  savingsConsistency: number; // 0-100
}

export const calculateScore = (data: ScoringData): number => {
  // Weights (Total = 1.0)
  const weights = {
    incomeStability: 0.30,
    paymentBehavior: 0.25,
    spendingDiscipline: 0.15,
    digitalVolume: 0.20,
    savingsConsistency: 0.10,
  };

  const weightedScore =
    data.incomeStability * weights.incomeStability +
    data.paymentBehavior * weights.paymentBehavior +
    data.spendingDiscipline * weights.spendingDiscipline +
    data.digitalVolume * weights.digitalVolume +
    data.savingsConsistency * weights.savingsConsistency;

  // Map 0-100 scale to 300-900 scale
  // Base score 300 + (weightedScore/100 * 600)
  const score = 300 + (weightedScore / 100) * 600;

  return Math.round(score);
};

export const getScoreCategory = (score: number) => {
  if (score >= 750) return { label: 'Excellent', color: '#10B981' };
  if (score >= 650) return { label: 'Good', color: '#2563EB' };
  if (score >= 550) return { label: 'Average', color: '#F59E0B' };
  return { label: 'Poor', color: '#EF4444' };
};
