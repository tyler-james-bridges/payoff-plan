'use client';

import { usePayoffStore } from '@/lib/store';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { DebtInputRow } from './debt-input-row';
import { ExtraBudgetInput } from './extra-budget-input';

export function DebtForm() {
  const debts = usePayoffStore((s) => s.plan.debts);
  const extraBudget = usePayoffStore((s) => s.plan.extraMonthlyBudget);
  const addDebt = usePayoffStore((s) => s.addDebt);
  const updateDebt = usePayoffStore((s) => s.updateDebt);
  const removeDebt = usePayoffStore((s) => s.removeDebt);
  const setExtraBudget = usePayoffStore((s) => s.setExtraBudget);

  const handleAddDebt = () => {
    addDebt({ name: '', balance: 0, apr: 0, minimumPayment: 0 });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Debts</h2>
        <Button onClick={handleAddDebt} variant="secondary">
          + Add Debt
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {debts.map((debt) => (
          <DebtInputRow
            key={debt.id}
            debt={debt}
            onUpdate={updateDebt}
            onRemove={removeDebt}
          />
        ))}
      </div>

      {debts.length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
          <ExtraBudgetInput value={extraBudget} onChange={setExtraBudget} />
        </div>
      )}
    </Card>
  );
}
