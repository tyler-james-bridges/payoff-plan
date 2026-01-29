import type { PayoffPlan } from '../types';

const SCHEMA_VERSION = 1;

interface ExportData {
  schemaVersion: number;
  exportedAt: string;
  plan: PayoffPlan;
}

export function exportPlan(plan: PayoffPlan): string {
  const data: ExportData = {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    plan,
  };
  return JSON.stringify(data, null, 2);
}

export function triggerDownload(json: string, filename: string) {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function validateImport(raw: string): PayoffPlan | { error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: 'Invalid JSON file.' };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { error: 'File does not contain valid data.' };
  }

  const data = parsed as Record<string, unknown>;

  // Support both wrapped (ExportData) and raw (PayoffPlan) formats
  const plan = data.schemaVersion ? (data.plan as Record<string, unknown>) : data;

  if (!plan || typeof plan !== 'object') {
    return { error: 'No plan data found in file.' };
  }

  if (!Array.isArray((plan as Record<string, unknown>).debts)) {
    return { error: 'Plan must contain a debts array.' };
  }

  const debts = (plan as Record<string, unknown>).debts as Array<Record<string, unknown>>;
  for (let i = 0; i < debts.length; i++) {
    const d = debts[i];
    if (typeof d.name !== 'string') return { error: `Debt ${i + 1}: missing name.` };
    if (typeof d.balance !== 'number') return { error: `Debt ${i + 1}: balance must be a number.` };
    if (typeof d.apr !== 'number') return { error: `Debt ${i + 1}: APR must be a number.` };
    if (typeof d.minimumPayment !== 'number') return { error: `Debt ${i + 1}: minimum payment must be a number.` };
  }

  return plan as unknown as PayoffPlan;
}
