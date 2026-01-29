'use client';

import { Card } from '../ui/card';
import { centsToDisplay } from '@/lib/calculations/format';
import type { ComparisonResult } from '@/lib/calculations/comparison';

interface MinimumTrapProps {
  comparison: ComparisonResult;
}

export function MinimumTrap({ comparison }: MinimumTrapProps) {
  const { minimumOnly, avalanche } = comparison;
  const interestDiff = minimumOnly.totalInterest - avalanche.totalInterest;
  const monthsDiff = minimumOnly.totalMonths - avalanche.totalMonths;
  const yearsDiff = Math.floor(monthsDiff / 12);
  const remainingMonths = monthsDiff % 12;

  if (interestDiff <= 0) return null;

  const minInterestPct = minimumOnly.totalPaid > 0
    ? Math.round((minimumOnly.totalInterest / minimumOnly.totalPaid) * 100)
    : 0;

  return (
    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
      <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-200">Minimum Payment Trap</h3>
      <p className="mb-4 text-sm text-red-800 dark:text-red-300">
        Paying only minimums costs{' '}
        <span className="font-bold">{centsToDisplay(minimumOnly.totalInterest)}</span> in interest over{' '}
        <span className="font-bold">
          {yearsDiff > 0 ? `${yearsDiff} year${yearsDiff !== 1 ? 's' : ''}` : ''}
          {yearsDiff > 0 && remainingMonths > 0 ? ' and ' : ''}
          {remainingMonths > 0 ? `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''}
          {minimumOnly.totalMonths > 0 ? ` (${minimumOnly.totalMonths} months total)` : ''}
        </span>
        . That&apos;s {minInterestPct}% of every dollar going to interest.
      </p>

      {/* Bar comparison */}
      <div className="space-y-2">
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Minimum Only</span>
            <span className="font-medium text-red-700 dark:text-red-300">{centsToDisplay(minimumOnly.totalInterest)}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-3 rounded-full bg-red-500" style={{ width: '100%' }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Avalanche</span>
            <span className="font-medium text-green-700 dark:text-green-300">{centsToDisplay(avalanche.totalInterest)}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-3 rounded-full bg-green-500"
              style={{ width: `${minimumOnly.totalInterest > 0 ? (avalanche.totalInterest / minimumOnly.totalInterest) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm font-medium text-green-800 dark:text-green-300">
        You save {centsToDisplay(interestDiff)} with the avalanche strategy
      </p>
    </Card>
  );
}
