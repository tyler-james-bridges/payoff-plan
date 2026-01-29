'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/card';
import type { SimulationResult } from '@/lib/types';

interface InterestPrincipalChartProps {
  simulation: SimulationResult;
}

export function InterestPrincipalChart({ simulation }: InterestPrincipalChartProps) {
  const raw = simulation.months.map((m) => ({
    date: m.date,
    interest: m.totalInterest / 100,
    principal: m.totalPrincipal / 100,
  }));

  // Sample if too many months
  const data = raw.length > 36
    ? raw.filter((_, i) => i % Math.ceil(raw.length / 36) === 0 || i === raw.length - 1)
    : raw;

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Interest vs Principal</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis tickFormatter={(v) => `$${v.toFixed(0)}`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, '']} />
          <Legend />
          <Bar dataKey="interest" name="Interest" fill="#ef4444" stackId="a" />
          <Bar dataKey="principal" name="Principal" fill="#22c55e" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
