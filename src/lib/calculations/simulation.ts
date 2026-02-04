import { MAX_SIMULATION_MONTHS } from '../constants';
import type { Debt, Strategy, SimulationResult, MonthSnapshot, DebtSnapshot } from '../types';
import { calculateMonthlyInterest } from './interest';
import { orderDebts } from './strategies';
import { formatMonthLabel } from './format';

interface DebtState {
  debt: Debt;
  balance: number;
  paidOff: boolean;
}

export function runSimulation(
  debts: Debt[],
  extraMonthlyBudget: number,
  strategy: Strategy,
  startDate?: Date,
): SimulationResult {
  if (debts.length === 0) {
    return {
      strategy,
      months: [],
      totalMonths: 0,
      totalInterest: 0,
      totalPaid: 0,
      payoffDate: formatMonthLabel(0, startDate),
      debtPayoffOrder: [],
    };
  }

  const ordered = orderDebts(debts, strategy);
  const states: DebtState[] = ordered.map((d) => ({
    debt: d,
    balance: d.balance,
    paidOff: false,
  }));

  const months: MonthSnapshot[] = [];
  const payoffOrder: string[] = [];
  let totalInterestAccrued = 0;
  let totalPaidAll = 0;

  for (let month = 1; month <= MAX_SIMULATION_MONTHS; month++) {
    const activeStates = states.filter((s) => !s.paidOff);
    if (activeStates.length === 0) break;

    // Track per-debt what happens this month
    const monthDebts: Map<string, { interest: number; payment: number }> = new Map();

    // 1. Accrue interest
    for (const state of activeStates) {
      const interest = calculateMonthlyInterest(state.balance, state.debt.apr);
      state.balance += interest;
      monthDebts.set(state.debt.id, { interest, payment: 0 });
    }

    // 2. Pay minimums
    let freedPool = 0;
    for (const state of activeStates) {
      const minPayment = Math.min(state.debt.minimumPayment, state.balance);
      state.balance -= minPayment;
      monthDebts.get(state.debt.id)!.payment += minPayment;

      if (state.balance <= 0) {
        // Overpayment goes back to pool
        freedPool += -state.balance;
        state.balance = 0;
        state.paidOff = true;
        payoffOrder.push(state.debt.id);
        // Only unused portion of the minimum is available this month.
        freedPool += Math.max(0, state.debt.minimumPayment - minPayment);
      }
    }

    // 3. Apply extra budget + freed minimums to priority debts
    if (strategy !== 'minimum-only') {
      let pool = extraMonthlyBudget + freedPool;
      for (const state of states) {
        if (state.paidOff || state.balance <= 0 || pool <= 0) continue;
        const extra = Math.min(pool, state.balance);
        state.balance -= extra;
        pool -= extra;
        monthDebts.get(state.debt.id)!.payment += extra;

        if (state.balance <= 0) {
          state.balance = 0;
          if (!state.paidOff) {
            state.paidOff = true;
            payoffOrder.push(state.debt.id);
          }
        }
      }
    }

    // Build month snapshot
    let monthTotalPaid = 0;
    let monthTotalInterest = 0;
    let monthTotalPrincipal = 0;

    const debtSnapshots: DebtSnapshot[] = states.map((state) => {
      const record = monthDebts.get(state.debt.id);
      const interest = record?.interest ?? 0;
      const payment = record?.payment ?? 0;
      const principal = payment - interest;

      monthTotalPaid += payment;
      monthTotalInterest += interest;
      monthTotalPrincipal += principal;

      return {
        debtId: state.debt.id,
        balance: state.balance,
        payment,
        interest,
        principal,
        isPaidOff: state.paidOff,
      };
    });

    totalInterestAccrued += monthTotalInterest;
    totalPaidAll += monthTotalPaid;

    const totalBalance = states.reduce((sum, s) => sum + s.balance, 0);

    months.push({
      month,
      date: formatMonthLabel(month, startDate),
      debts: debtSnapshots,
      totalBalance,
      totalPaid: monthTotalPaid,
      totalInterest: monthTotalInterest,
      totalPrincipal: monthTotalPrincipal,
    });

    if (totalBalance <= 0) break;
  }

  return {
    strategy,
    months,
    totalMonths: months.length,
    totalInterest: totalInterestAccrued,
    totalPaid: totalPaidAll,
    payoffDate: months.length > 0 ? months[months.length - 1].date : formatMonthLabel(0, startDate),
    debtPayoffOrder: payoffOrder,
  };
}
