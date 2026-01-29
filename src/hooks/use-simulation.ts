'use client';

import { useMemo } from 'react';
import { usePayoffStore } from '@/lib/store';
import { runSimulation } from '@/lib/calculations/simulation';
import type { SimulationResult } from '@/lib/types';

export function useSimulation(): SimulationResult | null {
  const debts = usePayoffStore((s) => s.plan.debts);
  const extraBudget = usePayoffStore((s) => s.plan.extraMonthlyBudget);

  return useMemo(() => {
    if (debts.length === 0) return null;
    return runSimulation(debts, extraBudget, 'avalanche');
  }, [debts, extraBudget]);
}
