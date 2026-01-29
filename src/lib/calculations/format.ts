export function centsToDisplay(cents: number): string {
  const dollars = cents / 100;
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

export function displayToCents(display: string): number {
  const cleaned = display.replace(/[^0-9.-]/g, '');
  const dollars = parseFloat(cleaned);
  if (isNaN(dollars)) return 0;
  return Math.round(dollars * 100);
}

export function monthsToPayoffDate(months: number, startDate?: Date): string {
  const start = startDate ?? new Date();
  const date = new Date(start.getFullYear(), start.getMonth() + months, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatMonthLabel(monthIndex: number, startDate?: Date): string {
  const start = startDate ?? new Date();
  const date = new Date(start.getFullYear(), start.getMonth() + monthIndex, 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}
