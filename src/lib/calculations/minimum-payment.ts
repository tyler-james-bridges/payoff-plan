import { DEFAULT_MIN_FLOOR, DEFAULT_MIN_PERCENT } from '../constants';
import type { Debt } from '../types';

export function calculateMinimumPayment(debt: Debt): number {
  if (debt.balance <= 0) return 0;
  const percentBased = Math.round(debt.balance * DEFAULT_MIN_PERCENT);
  const minimum = Math.max(DEFAULT_MIN_FLOOR, percentBased);
  // Don't pay more than the balance
  return Math.min(minimum, debt.balance);
}

export function effectiveMinimum(debt: Debt): number {
  return Math.min(debt.minimumPayment, debt.balance);
}
