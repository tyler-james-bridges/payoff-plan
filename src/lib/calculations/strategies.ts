import type { Debt, Strategy } from '../types';

export function orderDebts(debts: Debt[], strategy: Strategy): Debt[] {
  const sorted = [...debts];
  switch (strategy) {
    case 'avalanche':
      // Highest APR first
      sorted.sort((a, b) => b.apr - a.apr || a.balance - b.balance);
      break;
    case 'snowball':
      // Lowest balance first
      sorted.sort((a, b) => a.balance - b.balance || b.apr - a.apr);
      break;
    case 'minimum-only':
      // No reordering needed
      break;
  }
  return sorted;
}
