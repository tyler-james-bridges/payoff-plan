'use client';

import { useMemo } from 'react';
import { usePayoffStore } from '@/lib/store';
import { runSimulation } from '@/lib/calculations/simulation';
import { centsToDisplay } from '@/lib/calculations/format';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Subscription } from '@/lib/subscription-detector';

interface PayoffImpactProps {
  subscriptions: Subscription[];
  selected: Set<string>;
  onAddToBudget: () => void;
}

export function PayoffImpact({ subscriptions, selected, onAddToBudget }: PayoffImpactProps) {
  const debts = usePayoffStore((s) => s.plan.debts);
  const extraBudget = usePayoffStore((s) => s.plan.extraMonthlyBudget);

  const monthlySavings = useMemo(() => {
    let total = 0;
    for (const sub of subscriptions) {
      if (selected.has(sub.merchant)) total += sub.monthlyCostCents;
    }
    return total;
  }, [subscriptions, selected]);

  const { current, boosted } = useMemo(() => {
    if (debts.length === 0) return { current: null, boosted: null };
    const current = runSimulation(debts, extraBudget, 'avalanche');
    const boosted = runSimulation(debts, extraBudget + monthlySavings, 'avalanche');
    return { current, boosted };
  }, [debts, extraBudget, monthlySavings]);

  if (selected.size === 0 || !current || !boosted || debts.length === 0) {
    return null;
  }

  const monthsSaved = current.totalMonths - boosted.totalMonths;
  const interestSaved = current.totalInterest - boosted.totalInterest;

  return (
    <Card className="border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
      <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
        Payoff Impact
      </h3>
      <p className="mt-1 text-sm text-green-700 dark:text-green-300">
        Canceling {selected.size} subscription{selected.size !== 1 ? 's' : ''} frees up{' '}
        <strong>{centsToDisplay(monthlySavings)}/mo</strong>.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {monthsSaved > 0 ? `${monthsSaved} mo` : '—'}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">sooner debt-free</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {interestSaved > 0 ? centsToDisplay(interestSaved) : '—'}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">less interest</p>
        </div>
      </div>

      <Button className="mt-4 w-full" onClick={onAddToBudget}>
        Add {centsToDisplay(monthlySavings)}/mo to extra budget
      </Button>
    </Card>
  );
}
