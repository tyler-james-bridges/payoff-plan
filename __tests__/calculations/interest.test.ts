import { describe, it, expect } from 'vitest';
import { calculateMonthlyInterest } from '@/lib/calculations/interest';

describe('calculateMonthlyInterest', () => {
  it('calculates monthly interest for $5,000 at 20% APR', () => {
    // $5,000 = 500000 cents, 20% APR → monthly rate = 0.20/12
    // 500000 * 0.20 / 12 = 8333.33 → rounds to 8333
    expect(calculateMonthlyInterest(500000, 0.20)).toBe(8333);
  });

  it('returns 0 for zero balance', () => {
    expect(calculateMonthlyInterest(0, 0.20)).toBe(0);
  });

  it('returns 0 for zero APR', () => {
    expect(calculateMonthlyInterest(500000, 0)).toBe(0);
  });

  it('calculates correctly for $10,000 at 24.99% APR', () => {
    // 1000000 * 0.2499 / 12 = 20825
    expect(calculateMonthlyInterest(1000000, 0.2499)).toBe(20825);
  });
});
