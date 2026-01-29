'use client';

import { useState, useCallback, type FocusEvent } from 'react';
import { Input } from './input';
import { centsToDisplay, displayToCents } from '@/lib/calculations/format';

interface CurrencyInputProps {
  value: number; // cents
  onChange: (cents: number) => void;
  label?: string;
  id?: string;
  error?: string;
  placeholder?: string;
}

export function CurrencyInput({ value, onChange, label, id, error, placeholder }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(() =>
    value > 0 ? (value / 100).toFixed(2) : '',
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const cents = displayToCents(e.target.value);
      onChange(cents);
      setDisplayValue(cents > 0 ? (cents / 100).toFixed(2) : '');
    },
    [onChange],
  );

  return (
    <div className="relative">
      <Input
        id={id}
        label={label}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={(e) => setDisplayValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder ?? '$0.00'}
        error={error}
        className="pl-7"
      />
      <span className="pointer-events-none absolute bottom-2.5 left-3 text-sm text-gray-400">$</span>
    </div>
  );
}
