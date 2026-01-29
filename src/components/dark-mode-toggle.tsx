'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function DarkModeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('payoff-theme');
    if (stored === 'light') {
      setDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('payoff-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('payoff-theme', 'light');
    }
  };

  return (
    <Button variant="ghost" onClick={toggle} aria-label="Toggle dark mode" className="text-xs">
      {dark ? 'Light' : 'Dark'}
    </Button>
  );
}
