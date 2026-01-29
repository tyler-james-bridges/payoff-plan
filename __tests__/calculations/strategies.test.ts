import { describe, it, expect } from 'vitest';
import { orderDebts } from '@/lib/calculations/strategies';
import type { Debt } from '@/lib/types';

const debts: Debt[] = [
  { id: 'a', name: 'Low APR Big Balance', balance: 1000000, apr: 0.10, minimumPayment: 5000, createdAt: '', updatedAt: '' },
  { id: 'b', name: 'High APR Small Balance', balance: 200000, apr: 0.25, minimumPayment: 5000, createdAt: '', updatedAt: '' },
  { id: 'c', name: 'Mid APR Mid Balance', balance: 500000, apr: 0.18, minimumPayment: 5000, createdAt: '', updatedAt: '' },
];

describe('orderDebts', () => {
  it('avalanche: highest APR first', () => {
    const result = orderDebts(debts, 'avalanche');
    expect(result.map((d) => d.id)).toEqual(['b', 'c', 'a']);
  });

  it('snowball: lowest balance first', () => {
    const result = orderDebts(debts, 'snowball');
    expect(result.map((d) => d.id)).toEqual(['b', 'c', 'a']);
  });

  it('minimum-only: preserves order', () => {
    const result = orderDebts(debts, 'minimum-only');
    expect(result.map((d) => d.id)).toEqual(['a', 'b', 'c']);
  });
});
