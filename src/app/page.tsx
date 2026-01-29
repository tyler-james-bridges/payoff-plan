'use client';

import { usePayoffStore } from '@/lib/store';
import { usePersistence } from '@/hooks/use-persistence';
import { useSimulation } from '@/hooks/use-simulation';
import { DebtForm } from '@/components/debt-form/debt-form';
import { EmptyState } from '@/components/empty-state';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { MonthlyBreakdownTable } from '@/components/dashboard/monthly-breakdown-table';
import { PayoffTimeline } from '@/components/dashboard/payoff-timeline';

export default function Home() {
  const hydrated = usePersistence();
  const debts = usePayoffStore((s) => s.plan.debts);
  const addDebt = usePayoffStore((s) => s.addDebt);
  const simulation = useSimulation();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
      </div>
    );
  }

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const hasDebts = debts.length > 0;
  const hasValidSimulation = simulation && simulation.totalMonths > 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Payoff Plan</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your debt-free date, calculated locally.
        </p>
      </header>

      {!hasDebts ? (
        <EmptyState onAddDebt={() => addDebt({ name: '', balance: 0, apr: 0, minimumPayment: 0 })} />
      ) : (
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <DebtForm />
          </div>
          <div className="flex flex-col gap-6">
            {hasValidSimulation && (
              <>
                <SummaryCards simulation={simulation} totalDebt={totalDebt} />
                <PayoffTimeline simulation={simulation} debts={debts} />
                <MonthlyBreakdownTable simulation={simulation} />
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
