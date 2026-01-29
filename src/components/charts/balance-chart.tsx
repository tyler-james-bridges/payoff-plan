'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/card';
import type { ComparisonResult } from '@/lib/calculations/comparison';

interface BalanceChartProps {
  comparison: ComparisonResult;
}

export function BalanceChart({ comparison }: BalanceChartProps) {
  const maxLen = Math.max(
    comparison.avalanche.months.length,
    comparison.snowball.months.length,
    comparison.minimumOnly.months.length,
  );

  const data = Array.from({ length: maxLen }, (_, i) => ({
    date: comparison.avalanche.months[i]?.date
      ?? comparison.snowball.months[i]?.date
      ?? comparison.minimumOnly.months[i]?.date
      ?? '',
    avalanche: (comparison.avalanche.months[i]?.totalBalance ?? 0) / 100,
    snowball: (comparison.snowball.months[i]?.totalBalance ?? 0) / 100,
    minimumOnly: (comparison.minimumOnly.months[i]?.totalBalance ?? 0) / 100,
  }));

  // Sample data if too many points
  const sampled = data.length > 60
    ? data.filter((_, i) => i % Math.ceil(data.length / 60) === 0 || i === data.length - 1)
    : data;

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Balance Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sampled} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, '']} />
          <Legend />
          <Line type="monotone" dataKey="avalanche" name="Avalanche" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="snowball" name="Snowball" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="minimumOnly" name="Minimum Only" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
