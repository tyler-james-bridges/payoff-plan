import type { Debt, SimulationResult, Strategy } from '../types';
import { runSimulation } from './simulation';

export interface ComparisonResult {
  avalanche: SimulationResult;
  snowball: SimulationResult;
  minimumOnly: SimulationResult;
  interestSaved: number; // avalanche vs minimum-only
  monthsSaved: number; // avalanche vs minimum-only
  avalancheVsSnowball: {
    interestDiff: number; // positive = avalanche saves more
    monthsDiff: number;
  };
}

export function compareStrategies(
  debts: Debt[],
  extraMonthlyBudget: number,
  startDate?: Date,
): ComparisonResult {
  const avalanche = runSimulation(debts, extraMonthlyBudget, 'avalanche', startDate);
  const snowball = runSimulation(debts, extraMonthlyBudget, 'snowball', startDate);
  const minimumOnly = runSimulation(debts, extraMonthlyBudget, 'minimum-only', startDate);

  return {
    avalanche,
    snowball,
    minimumOnly,
    interestSaved: minimumOnly.totalInterest - avalanche.totalInterest,
    monthsSaved: minimumOnly.totalMonths - avalanche.totalMonths,
    avalancheVsSnowball: {
      interestDiff: snowball.totalInterest - avalanche.totalInterest,
      monthsDiff: snowball.totalMonths - avalanche.totalMonths,
    },
  };
}
