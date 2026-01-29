'use client';

import { useState } from 'react';
import { Card } from '../ui/card';
import { centsToDisplay } from '@/lib/calculations/format';
import type { ComparisonResult } from '@/lib/calculations/comparison';
import type { Strategy } from '@/lib/types';

interface StrategyComparisonProps {
  comparison: ComparisonResult;
}

const tabs: { key: Strategy; label: string }[] = [
  { key: 'avalanche', label: 'Avalanche' },
  { key: 'snowball', label: 'Snowball' },
  { key: 'minimum-only', label: 'Minimum Only' },
];

function getResult(comparison: ComparisonResult, strategy: Strategy) {
  switch (strategy) {
    case 'avalanche': return comparison.avalanche;
    case 'snowball': return comparison.snowball;
    case 'minimum-only': return comparison.minimumOnly;
  }
}

export function StrategyComparison({ comparison }: StrategyComparisonProps) {
  const [active, setActive] = useState<Strategy>('avalanche');
  const result = getResult(comparison, active);

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Strategy Comparison</h3>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active === tab.key
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active strategy stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Months</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{result.totalMonths}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Interest</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{centsToDisplay(result.totalInterest)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{centsToDisplay(result.totalPaid)}</p>
        </div>
      </div>

      {/* Savings callout */}
      {active === 'avalanche' && comparison.avalancheVsSnowball.interestDiff > 0 && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
          Avalanche saves {centsToDisplay(comparison.avalancheVsSnowball.interestDiff)} and{' '}
          {comparison.avalancheVsSnowball.monthsDiff} month{comparison.avalancheVsSnowball.monthsDiff !== 1 ? 's' : ''}{' '}
          vs Snowball
        </div>
      )}
    </Card>
  );
}
