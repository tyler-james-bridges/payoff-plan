import { Button } from './ui/button';

interface EmptyStateProps {
  onAddDebt: () => void;
}

export function EmptyState({ onAddDebt }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="text-5xl">📊</div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        No debts added yet
      </h2>
      <p className="max-w-md text-gray-500 dark:text-gray-400">
        Add your first debt to see your payoff timeline, total interest, and debt-free date.
      </p>
      <Button onClick={onAddDebt}>Add your first debt</Button>
    </div>
  );
}
