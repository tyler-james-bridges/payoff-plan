import { readFileSync, existsSync } from 'fs';
import { runSimulation } from '../lib/calculations/simulation';
import { centsToDisplay } from '../lib/calculations/format';
import type { Debt } from '../lib/types';

interface DataFile {
  debts: Array<{
    id?: string;
    name: string;
    balance: number;
    apr: number;
    minimumPayment: number;
  }>;
  extraMonthlyBudget?: number;
}

const dataPath = 'payoff-plan-data.json';

if (!existsSync(dataPath)) {
  console.error('No payoff-plan-data.json found. Add debts first with /payoff.');
  process.exit(1);
}

let data: DataFile;
try {
  data = JSON.parse(readFileSync(dataPath, 'utf-8'));
} catch {
  console.error('Failed to parse payoff-plan-data.json. Check that it contains valid JSON.');
  process.exit(1);
}

if (!data || typeof data !== 'object' || !Array.isArray(data.debts)) {
  console.error('Invalid data file format. Expected { debts: [...], extraMonthlyBudget?: number }.');
  process.exit(1);
}

if (!data.debts || data.debts.length === 0) {
  console.error('No debts in data file. Add debts first.');
  process.exit(1);
}

const debts: Debt[] = data.debts.map((d, i) => ({
  id: d.id ?? String(i),
  name: d.name,
  balance: d.balance,
  apr: d.apr,
  minimumPayment: d.minimumPayment,
  createdAt: '',
  updatedAt: '',
}));

const extra = data.extraMonthlyBudget ?? 0;
const allowedStrategies = ['avalanche', 'snowball', 'minimum-only'] as const;
const input = process.argv[2];
const strategy = allowedStrategies.includes(input as typeof allowedStrategies[number])
  ? (input as typeof allowedStrategies[number])
  : 'avalanche';
const result = runSimulation(debts, extra, strategy);

// Find payoff month for each debt
const payoffInfo: Record<string, string> = {};
for (const month of result.months) {
  for (const ds of month.debts) {
    if (ds.isPaidOff && !payoffInfo[ds.debtId]) {
      payoffInfo[ds.debtId] = month.date;
    }
  }
}

console.log(`\n━━━ PAYOFF PLAN (${strategy.charAt(0).toUpperCase() + strategy.slice(1)} Strategy) ━━━\n`);
console.log(`Total Debt:       ${centsToDisplay(debts.reduce((s, d) => s + d.balance, 0))}`);
console.log(`Debt-Free Date:   ${result.payoffDate} (${result.totalMonths} months)`);
console.log(`Total Interest:   ${centsToDisplay(result.totalInterest)}`);
console.log(`Total Paid:       ${centsToDisplay(result.totalPaid)}`);

console.log(`\n━━━ PAYOFF ORDER ━━━`);
result.debtPayoffOrder.forEach((id, i) => {
  const debt = debts.find((d) => d.id === id);
  console.log(`${i + 1}. ${debt?.name || id} — paid off ${payoffInfo[id] || 'N/A'}`);
});

const showMonths = Math.min(result.months.length, 6);
console.log(`\n━━━ FIRST ${showMonths} MONTHS ━━━`);
console.log('Month   | Balance      | Payment    | Interest   | Principal');
console.log('--------|-------------|------------|------------|----------');
for (let i = 0; i < showMonths; i++) {
  const m = result.months[i];
  console.log(
    `${m.date} | ${centsToDisplay(m.totalBalance).padStart(11)} | ${centsToDisplay(m.totalPaid).padStart(10)} | ${centsToDisplay(m.totalInterest).padStart(10)} | ${centsToDisplay(m.totalPrincipal).padStart(9)}`,
  );
}

if (result.months.length > showMonths) {
  console.log(`... ${result.months.length - showMonths} more months`);
}
console.log('');
