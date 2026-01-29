import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Debt, PayoffPlan } from './types';

interface PayoffStore {
  plan: PayoffPlan;
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDebt: (id: string, updates: Partial<Omit<Debt, 'id' | 'createdAt'>>) => void;
  removeDebt: (id: string) => void;
  setExtraBudget: (cents: number) => void;
  loadPlan: (plan: PayoffPlan) => void;
  resetPlan: () => void;
}

function createEmptyPlan(): PayoffPlan {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    name: 'My Payoff Plan',
    debts: [],
    extraMonthlyBudget: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export const usePayoffStore = create<PayoffStore>((set) => ({
  plan: createEmptyPlan(),

  addDebt: (debt) =>
    set((state) => {
      const now = new Date().toISOString();
      return {
        plan: {
          ...state.plan,
          updatedAt: now,
          debts: [
            ...state.plan.debts,
            { ...debt, id: uuidv4(), createdAt: now, updatedAt: now },
          ],
        },
      };
    }),

  updateDebt: (id, updates) =>
    set((state) => {
      const now = new Date().toISOString();
      return {
        plan: {
          ...state.plan,
          updatedAt: now,
          debts: state.plan.debts.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: now } : d,
          ),
        },
      };
    }),

  removeDebt: (id) =>
    set((state) => ({
      plan: {
        ...state.plan,
        updatedAt: new Date().toISOString(),
        debts: state.plan.debts.filter((d) => d.id !== id),
      },
    })),

  setExtraBudget: (cents) =>
    set((state) => ({
      plan: {
        ...state.plan,
        extraMonthlyBudget: cents,
        updatedAt: new Date().toISOString(),
      },
    })),

  loadPlan: (plan) => set({ plan }),

  resetPlan: () => set({ plan: createEmptyPlan() }),
}));
