import { describe, it, expect } from 'vitest';
import { runSimulation } from '@/lib/calculations/simulation';
import type { Debt } from '@/lib/types';

const startDate = new Date(2026, 0, 1); // Jan 2026

function makeDebt(overrides: Partial<Debt> & { id: string; name: string; balance: number; apr: number; minimumPayment: number }): Debt {
  return {
    createdAt: '',
    updatedAt: '',
    ...overrides,
  };
}

describe('runSimulation', () => {
  it('returns empty result for no debts', () => {
    const result = runSimulation([], 0, 'avalanche', startDate);
    expect(result.totalMonths).toBe(0);
    expect(result.months).toHaveLength(0);
  });

  it('pays off single debt with minimum payments only', () => {
    const debt = makeDebt({
      id: '1', name: 'Card', balance: 500000, apr: 0.20, minimumPayment: 10000,
    });
    const result = runSimulation([debt], 0, 'avalanche', startDate);
    // Should eventually pay off
    expect(result.totalMonths).toBeGreaterThan(0);
    expect(result.months[result.months.length - 1].totalBalance).toBe(0);
    // Total paid should exceed original balance (due to interest)
    expect(result.totalPaid).toBeGreaterThan(500000);
  });

  it('extra budget accelerates payoff', () => {
    const debt = makeDebt({
      id: '1', name: 'Card', balance: 500000, apr: 0.20, minimumPayment: 10000,
    });
    const noExtra = runSimulation([debt], 0, 'avalanche', startDate);
    const withExtra = runSimulation([debt], 20000, 'avalanche', startDate);
    expect(withExtra.totalMonths).toBeLessThan(noExtra.totalMonths);
    expect(withExtra.totalInterest).toBeLessThan(noExtra.totalInterest);
  });

  it('avalanche pays less interest than snowball on mixed debts', () => {
    const debts = [
      makeDebt({ id: 'a', name: 'High APR', balance: 300000, apr: 0.25, minimumPayment: 5000 }),
      makeDebt({ id: 'b', name: 'Low APR', balance: 500000, apr: 0.10, minimumPayment: 5000 }),
    ];
    const avalanche = runSimulation(debts, 10000, 'avalanche', startDate);
    const snowball = runSimulation(debts, 10000, 'snowball', startDate);
    expect(avalanche.totalInterest).toBeLessThanOrEqual(snowball.totalInterest);
  });

  it('all balances reach zero', () => {
    const debts = [
      makeDebt({ id: 'a', name: 'A', balance: 200000, apr: 0.18, minimumPayment: 5000 }),
      makeDebt({ id: 'b', name: 'B', balance: 300000, apr: 0.22, minimumPayment: 5000 }),
    ];
    const result = runSimulation(debts, 5000, 'avalanche', startDate);
    const lastMonth = result.months[result.months.length - 1];
    expect(lastMonth.totalBalance).toBe(0);
    for (const d of lastMonth.debts) {
      expect(d.balance).toBe(0);
      expect(d.isPaidOff).toBe(true);
    }
  });

  it('respects MAX_SIMULATION_MONTHS cap', () => {
    // Tiny minimum on large balance = effectively infinite
    const debt = makeDebt({
      id: '1', name: 'Huge', balance: 99999999, apr: 0.30, minimumPayment: 100,
    });
    const result = runSimulation([debt], 0, 'minimum-only', startDate);
    expect(result.totalMonths).toBeLessThanOrEqual(600);
  });
});
