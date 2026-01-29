'use client';

import { Card } from '../ui/card';
import { centsToDisplay } from '@/lib/calculations/format';
import type { SimulationResult } from '@/lib/types';

interface SummaryCardsProps {
  simulation: SimulationResult;
  totalDebt: number;
}

export function SummaryCards({ simulation, totalDebt }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Debt</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {centsToDisplay(totalDebt)}
        </p>
      </Card>
      <Card>
        <p className="text-sm text-gray-500 dark:text-gray-400">Debt-Free Date</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          {simulation.payoffDate}
        </p>
        <p className="text-xs text-gray-500">{simulation.totalMonths} months</p>
      </Card>
      <Card>
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Interest</p>
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
          {centsToDisplay(simulation.totalInterest)}
        </p>
      </Card>
    </div>
  );
}
