'use client';

import { useEffect, useRef, useState } from 'react';
import { usePayoffStore } from '@/lib/store';
import { savePlan, loadPlan } from '@/lib/persistence';

export function usePersistence() {
  const [hydrated, setHydrated] = useState(false);
  const plan = usePayoffStore((s) => s.plan);
  const load = usePayoffStore((s) => s.loadPlan);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);

  // Load on mount
  useEffect(() => {
    loadPlan().then((saved) => {
      if (saved) load(saved);
      setHydrated(true);
      // After initial load completes, allow saves
      setTimeout(() => { isInitialLoad.current = false; }, 0);
    });
  }, [load]);

  // Debounced save on change
  useEffect(() => {
    if (!hydrated || isInitialLoad.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      savePlan(plan);
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [plan, hydrated]);

  return hydrated;
}
