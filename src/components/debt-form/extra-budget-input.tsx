'use client';

import { CurrencyInput } from '../ui/currency-input';

interface ExtraBudgetInputProps {
  value: number;
  onChange: (cents: number) => void;
}

export function ExtraBudgetInput({ value, onChange }: ExtraBudgetInputProps) {
  return (
    <div className="max-w-xs">
      <CurrencyInput
        label="Extra Monthly Budget"
        id="extra-budget"
        value={value}
        onChange={onChange}
        placeholder="$200.00"
      />
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Amount above minimums you can pay each month
      </p>
    </div>
  );
}
