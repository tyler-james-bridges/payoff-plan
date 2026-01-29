'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePayoffStore } from '@/lib/store';
import { parseCSV } from '@/lib/csv-parser';
import { detectSubscriptions, type Subscription } from '@/lib/subscription-detector';
import { UploadZone } from '@/components/subscriptions/upload-zone';
import { SubscriptionList } from '@/components/subscriptions/subscription-list';
import { PayoffImpact } from '@/components/subscriptions/payoff-impact';
import { Button } from '@/components/ui/button';

export default function SubscriptionsPage() {
  const router = useRouter();
  const extraBudget = usePayoffStore((s) => s.plan.extraMonthlyBudget);
  const setExtraBudget = usePayoffStore((s) => s.setExtraBudget);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hasUploaded, setHasUploaded] = useState(false);

  const handleFileRead = useCallback((text: string) => {
    const transactions = parseCSV(text);
    const subs = detectSubscriptions(transactions);
    setSubscriptions(subs);
    setSelected(new Set());
    setHasUploaded(true);
  }, []);

  const handleToggle = useCallback((merchant: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(merchant)) next.delete(merchant);
      else next.add(merchant);
      return next;
    });
  }, []);

  const handleAddToBudget = useCallback(() => {
    let savings = 0;
    for (const sub of subscriptions) {
      if (selected.has(sub.merchant)) savings += sub.monthlyCostCents;
    }
    setExtraBudget(extraBudget + savings);
    router.push('/dashboard');
  }, [subscriptions, selected, extraBudget, setExtraBudget, router]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mb-4">
          ← Back to dashboard
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Find Extra Money
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Upload a bank or credit card statement to find recurring subscriptions you could cancel.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <UploadZone onFileRead={handleFileRead} />

        {hasUploaded && (
          <>
            <SubscriptionList
              subscriptions={subscriptions}
              selected={selected}
              onToggle={handleToggle}
            />
            <PayoffImpact
              subscriptions={subscriptions}
              selected={selected}
              onAddToBudget={handleAddToBudget}
            />
          </>
        )}
      </div>
    </main>
  );
}
