'use client';

import { Card } from '@/components/ui/card';
import { centsToDisplay } from '@/lib/calculations/format';
import type { Subscription } from '@/lib/subscription-detector';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  selected: Set<string>;
  onToggle: (merchant: string) => void;
}

export function SubscriptionList({ subscriptions, selected, onToggle }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500 dark:text-gray-400">
        No recurring subscriptions detected. Try uploading a statement with more history.
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Detected Subscriptions
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Select subscriptions you could cancel to free up money for debt payoff.
      </p>
      {subscriptions.map((sub) => {
        const checked = selected.has(sub.merchant);
        return (
          <label
            key={sub.merchant}
            className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
              checked
                ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(sub.merchant)}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 accent-blue-600"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium capitalize text-gray-900 dark:text-gray-100 truncate">
                {sub.merchant}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {sub.occurrences} charges &middot; last{' '}
                {sub.lastCharge.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {centsToDisplay(sub.monthlyCostCents)}/mo
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {centsToDisplay(sub.annualCostCents)}/yr
              </p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
