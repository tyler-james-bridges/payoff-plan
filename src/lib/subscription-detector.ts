import type { Transaction } from './csv-parser';

export interface Subscription {
  merchant: string;
  monthlyCostCents: number;
  annualCostCents: number;
  occurrences: number;
  lastCharge: Date;
}

function normalizeMerchant(desc: string): string {
  return desc
    .replace(/\s*[*#]\s*\d+/g, '') // Strip *1234 or #5678
    .replace(/\s+\d{4,}/g, '') // Strip trailing numbers (store IDs)
    .replace(/\s+(US|CA|GB|AU|NL|DE|SE|IE)\s*$/i, '') // Strip country codes
    .replace(/\s+[A-Z]{2}\s*$/i, '') // Strip state codes
    .replace(/\s{2,}/g, ' ')
    .trim()
    .toLowerCase();
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

function hasMonthlyInterval(dates: Date[]): boolean {
  if (dates.length < 2) return false;
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  let monthlyGaps = 0;
  for (let i = 1; i < sorted.length; i++) {
    const gap = daysBetween(sorted[i - 1], sorted[i]);
    if (gap >= 25 && gap <= 35) monthlyGaps++;
  }
  // At least one monthly gap
  return monthlyGaps >= 1;
}

export function detectSubscriptions(transactions: Transaction[]): Subscription[] {
  // Group by normalized merchant
  const groups = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const key = normalizeMerchant(tx.description);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tx);
  }

  const subscriptions: Subscription[] = [];

  for (const [merchant, txs] of groups) {
    if (txs.length < 2) continue;

    const dates = txs.map((t) => t.date);
    if (!hasMonthlyInterval(dates)) continue;

    const amounts = txs.map((t) => t.amount);
    const monthlyCost = median(amounts);
    const lastCharge = new Date(Math.max(...dates.map((d) => d.getTime())));

    subscriptions.push({
      merchant,
      monthlyCostCents: monthlyCost,
      annualCostCents: monthlyCost * 12,
      occurrences: txs.length,
      lastCharge,
    });
  }

  // Sort by annual cost descending
  subscriptions.sort((a, b) => b.annualCostCents - a.annualCostCents);
  return subscriptions;
}
