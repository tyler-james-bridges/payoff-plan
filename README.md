# Payoff Plan

Local-first debt payoff planner. See your debt-free date with avalanche strategy, total interest, and monthly breakdown. All data stays in your browser.

## Features

- Add debts with balance, APR, and minimum payment
- Set extra monthly budget above minimums
- Avalanche strategy simulation (highest APR first)
- Monthly breakdown table with interest/principal split
- Payoff timeline showing when each debt hits $0
- IndexedDB persistence — data survives browser restarts
- Claude Code `/payoff` skill for CLI-based debt intake and simulation

## Getting Started

```bash
npm install
npm run dev
```

## CLI Simulation

Use the Claude Code `/payoff` skill, or run directly:

```bash
# Create payoff-plan-data.json with your debts, then:
npm run simulate
```

## Tech Stack

- Next.js 15, TypeScript, Tailwind CSS
- Zustand for state management
- IndexedDB (via `idb`) for persistence
- Static export — deploys anywhere

## License

MIT
