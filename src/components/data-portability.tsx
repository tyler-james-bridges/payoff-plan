'use client';

import { useRef } from 'react';
import { Button } from './ui/button';
import { usePayoffStore } from '@/lib/store';
import { exportPlan, triggerDownload, validateImport } from '@/lib/calculations/export';

export function DataPortability() {
  const plan = usePayoffStore((s) => s.plan);
  const loadPlan = usePayoffStore((s) => s.loadPlan);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportPlan(plan);
    triggerDownload(json, `payoff-plan-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = validateImport(reader.result as string);
      if ('error' in result) {
        alert(result.error);
        return;
      }
      loadPlan(result);
    };
    reader.readAsText(file);

    // Reset so the same file can be re-imported
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="flex gap-2">
      <Button variant="ghost" onClick={handleExport} className="text-xs">
        Export
      </Button>
      <Button variant="ghost" onClick={() => fileRef.current?.click()} className="text-xs">
        Import
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
        aria-label="Import plan file"
      />
    </div>
  );
}
