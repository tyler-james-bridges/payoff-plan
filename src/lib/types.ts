export interface Debt {
  id: string;
  name: string;
  balance: number; // cents
  apr: number; // decimal, e.g. 0.2199
  minimumPayment: number; // cents
  createdAt: string;
  updatedAt: string;
}

export interface PayoffPlan {
  id: string;
  name: string;
  debts: Debt[];
  extraMonthlyBudget: number; // cents
  createdAt: string;
  updatedAt: string;
}

export interface DebtSnapshot {
  debtId: string;
  balance: number;
  payment: number;
  interest: number;
  principal: number;
  isPaidOff: boolean;
}

export interface MonthSnapshot {
  month: number;
  date: string; // "2026-03"
  debts: DebtSnapshot[];
  totalBalance: number;
  totalPaid: number;
  totalInterest: number;
  totalPrincipal: number;
}

export type Strategy = 'avalanche' | 'snowball' | 'minimum-only';

export interface SimulationResult {
  strategy: Strategy;
  months: MonthSnapshot[];
  totalMonths: number;
  totalInterest: number;
  totalPaid: number;
  payoffDate: string;
  debtPayoffOrder: string[];
}
