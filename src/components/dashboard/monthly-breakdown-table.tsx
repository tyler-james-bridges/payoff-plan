'use client';

import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { centsToDisplay } from '@/lib/calculations/format';
import type { SimulationResult } from '@/lib/types';

interface MonthlyBreakdownTableProps {
  simulation: SimulationResult;
}

const INITIAL_SHOW = 12;
const TAIL_SHOW = 3;

export function MonthlyBreakdownTable({ simulation }: MonthlyBreakdownTableProps) {
  const [expanded, setExpanded] = useState(false);
  const { months } = simulation;

  if (months.length === 0) return null;

  const needsCollapse = months.length > INITIAL_SHOW + TAIL_SHOW;
  const visibleMonths = expanded || !needsCollapse
    ? months
    : [...months.slice(0, INITIAL_SHOW), ...months.slice(-TAIL_SHOW)];
  const hiddenCount = needsCollapse && !expanded ? months.length - INITIAL_SHOW - TAIL_SHOW : 0;

  return (
    <Card className="overflow-hidden p-0">
      <div className="p-6 pb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Monthly Breakdown</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <th className="px-6 py-3 font-medium">Month</th>
              <th className="px-6 py-3 font-medium">Balance</th>
              <th className="px-6 py-3 font-medium">Payment</th>
              <th className="px-6 py-3 font-medium">Interest</th>
              <th className="px-6 py-3 font-medium">Principal</th>
            </tr>
          </thead>
          <tbody>
            {visibleMonths.map((month, idx) => (
              <>
                {idx === INITIAL_SHOW && hiddenCount > 0 && (
                  <tr key="ellipsis">
                    <td colSpan={5} className="px-6 py-3 text-center">
                      <Button variant="ghost" onClick={() => setExpanded(true)} className="text-xs">
                        Show {hiddenCount} more months
                      </Button>
                    </td>
                  </tr>
                )}
                <tr
                  key={month.month}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                >
                  <td className="px-6 py-3 text-gray-900 dark:text-gray-100">{month.date}</td>
                  <td className="px-6 py-3 text-gray-900 dark:text-gray-100">{centsToDisplay(month.totalBalance)}</td>
                  <td className="px-6 py-3 text-gray-900 dark:text-gray-100">{centsToDisplay(month.totalPaid)}</td>
                  <td className="px-6 py-3 text-red-600 dark:text-red-400">{centsToDisplay(month.totalInterest)}</td>
                  <td className="px-6 py-3 text-green-600 dark:text-green-400">{centsToDisplay(month.totalPrincipal)}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
