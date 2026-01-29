'use client';

import { Card } from '../ui/card';
import type { SimulationResult, Debt } from '@/lib/types';

interface PayoffTimelineProps {
  simulation: SimulationResult;
  debts: Debt[];
}

export function PayoffTimeline({ simulation, debts }: PayoffTimelineProps) {
  const debtMap = new Map(debts.map((d) => [d.id, d]));

  // Find when each debt is paid off
  const payoffDates: { name: string; date: string; month: number }[] = [];
  for (const debtId of simulation.debtPayoffOrder) {
    const debt = debtMap.get(debtId);
    if (!debt) continue;
    const month = simulation.months.find((m) =>
      m.debts.find((d) => d.debtId === debtId && d.isPaidOff),
    );
    if (month) {
      payoffDates.push({ name: debt.name || 'Unnamed', date: month.date, month: month.month });
    }
  }

  if (payoffDates.length === 0) return null;

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Payoff Timeline</h3>
      <div className="relative flex flex-col gap-0">
        {payoffDates.map((item, idx) => (
          <div key={item.name + item.month} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`h-4 w-4 rounded-full ${idx === payoffDates.length - 1 ? 'bg-green-500' : 'bg-blue-500'}`} />
              {idx < payoffDates.length - 1 && (
                <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600" />
              )}
            </div>
            <div className="pb-6">
              <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Paid off {item.date} (month {item.month})
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
