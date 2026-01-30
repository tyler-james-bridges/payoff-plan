export interface Transaction {
  date: Date;
  description: string;
  amount: number; // cents, positive = charge
}

interface ColumnMapping {
  date: number;
  description: number;
  amount: number;
}

const DATE_HEADERS = ['date', 'transaction date', 'trans date', 'posting date'];
const DESC_HEADERS = ['description', 'merchant', 'name', 'memo', 'payee', 'transaction description'];
const AMOUNT_HEADERS = ['amount', 'debit', 'charge', 'debit amount'];

function detectDelimiter(firstLine: string): string {
  return firstLine.includes('\t') ? '\t' : ',';
}

function splitRow(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === delimiter && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function detectColumns(headers: string[]): ColumnMapping | null {
  const lower = headers.map((h) => h.toLowerCase().replace(/[^a-z ]/g, '').trim());

  const date = lower.findIndex((h) => DATE_HEADERS.includes(h));
  const desc = lower.findIndex((h) => DESC_HEADERS.includes(h));
  const amount = lower.findIndex((h) => AMOUNT_HEADERS.includes(h));

  if (date === -1 || desc === -1 || amount === -1) return null;
  return { date, description: desc, amount };
}

function parseDate(raw: string): Date | null {
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.\-]/g, '');
  const val = parseFloat(cleaned);
  if (isNaN(val)) return null;
  return Math.round(val * 100);
}

export function parseCSV(text: string): Transaction[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitRow(lines[0], delimiter);
  const mapping = detectColumns(headers);
  if (!mapping) return [];

  const transactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = splitRow(lines[i], delimiter);
    if (fields.length <= Math.max(mapping.date, mapping.description, mapping.amount)) continue;

    const date = parseDate(fields[mapping.date]);
    const description = fields[mapping.description];
    const amount = parseAmount(fields[mapping.amount]);

    if (!date || !description || amount === null || amount <= 0) continue;

    transactions.push({ date, description, amount });
  }

  return transactions;
}
