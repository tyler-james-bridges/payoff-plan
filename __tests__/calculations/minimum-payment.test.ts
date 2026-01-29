import { describe, it, expect } from 'vitest';
import { calculateMinimumPayment } from '@/lib/calculations/minimum-payment';
import type { Debt } from '@/lib/types';

function makeDebt(balance: number): Debt {
  return {
    id: '1',
    name: 'Test',
    balance,
    apr: 0.20,
    minimumPayment: 10000,
    createdAt: '',
    updatedAt: '',
  };
}

describe('calculateMinimumPayment', () => {
  it('returns floor for small balances', () => {
    // $1,000 = 100000 cents. 1% = 1000, floor = 2500. Max(2500,1000) = 2500
    expect(calculateMinimumPayment(makeDebt(100000))).toBe(2500);
  });

  it('returns percent-based for large balances', () => {
    // $50,000 = 5000000 cents. 1% = 50000, floor = 2500. Max(2500,50000) = 50000
    expect(calculateMinimumPayment(makeDebt(5000000))).toBe(50000);
  });

  it('returns 0 for zero balance', () => {
    expect(calculateMinimumPayment(makeDebt(0))).toBe(0);
  });

  it('caps at balance when balance is less than floor', () => {
    // Balance $10 = 1000 cents. Min(2500, 1000) = 1000
    expect(calculateMinimumPayment(makeDebt(1000))).toBe(1000);
  });
});
