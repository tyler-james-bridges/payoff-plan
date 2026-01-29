'use client';

import { useMemo } from 'react';
import { usePayoffStore } from '@/lib/store';
import { compareStrategies, type ComparisonResult } from '@/lib/calculations/comparison';

export function useComparison(): ComparisonResult | null {
  const debts = usePayoffStore((s) => s.plan.debts);
  const extraBudget = usePayoffStore((s) => s.plan.extraMonthlyBudget);

  return useMemo(() => {
    if (debts.length === 0) return null;
    const hasValidDebt = debts.some((d) => d.balance > 0 && d.minimumPayment > 0);
    if (!hasValidDebt) return null;
    return compareStrategies(debts, extraBudget);
  }, [debts, extraBudget]);
}
