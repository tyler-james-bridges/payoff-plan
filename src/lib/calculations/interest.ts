export function calculateMonthlyInterest(balance: number, apr: number): number {
  return Math.round(balance * (apr / 12));
}
