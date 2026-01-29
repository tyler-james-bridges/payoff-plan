'use client';

import { useSyncExternalStore } from 'react';
import { Button } from './ui/button';

function getSnapshot() {
  return localStorage.getItem('payoff-theme') !== 'light';
}

function getServerSnapshot() {
  return true;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function DarkModeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    if (dark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('payoff-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('payoff-theme', 'dark');
    }
    // Trigger re-render via storage event
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Button variant="ghost" onClick={toggle} aria-label="Toggle dark mode" className="text-xs">
      {dark ? 'Light' : 'Dark'}
    </Button>
  );
}
