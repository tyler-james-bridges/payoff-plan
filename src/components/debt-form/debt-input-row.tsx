'use client';

import { Input } from '../ui/input';
import { CurrencyInput } from '../ui/currency-input';
import { Button } from '../ui/button';
import type { Debt } from '@/lib/types';

interface DebtInputRowProps {
  debt: Debt;
  onUpdate: (id: string, updates: Partial<Debt>) => void;
  onRemove: (id: string) => void;
}

export function DebtInputRow({ debt, onUpdate, onRemove }: DebtInputRowProps) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Name"
          id={`debt-name-${debt.id}`}
          value={debt.name}
          onChange={(e) => onUpdate(debt.id, { name: e.target.value })}
          placeholder="Chase Sapphire"
        />
        <CurrencyInput
          label="Balance"
          id={`debt-balance-${debt.id}`}
          value={debt.balance}
          onChange={(balance) => onUpdate(debt.id, { balance })}
          placeholder="$5,000.00"
        />
        <Input
          label="APR %"
          id={`debt-apr-${debt.id}`}
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={debt.apr > 0 ? (debt.apr * 100).toFixed(2) : ''}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onUpdate(debt.id, { apr: isNaN(val) ? 0 : val / 100 });
          }}
          placeholder="21.99"
        />
        <CurrencyInput
          label="Min Payment"
          id={`debt-min-${debt.id}`}
          value={debt.minimumPayment}
          onChange={(minimumPayment) => onUpdate(debt.id, { minimumPayment })}
          placeholder="$100.00"
        />
      </div>
      <div className="flex items-end">
        <Button variant="ghost" onClick={() => onRemove(debt.id)} aria-label={`Remove ${debt.name}`}>
          ✕
        </Button>
      </div>
    </div>
  );
}
