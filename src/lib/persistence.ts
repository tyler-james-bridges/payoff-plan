import { openDB, type IDBPDatabase } from 'idb';
import type { PayoffPlan } from './types';

const DB_NAME = 'payoff-plan';
const DB_VERSION = 1;
const STORE_NAME = 'plans';
const PLAN_KEY = 'current';
const LS_KEY = 'payoff-plan-current';

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function savePlan(plan: PayoffPlan): Promise<void> {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, plan, PLAN_KEY);
  } catch {
    // Fallback to localStorage
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(plan));
    } catch {
      // Storage full or unavailable
    }
  }
}

export async function loadPlan(): Promise<PayoffPlan | null> {
  try {
    const db = await getDB();
    const plan = await db.get(STORE_NAME, PLAN_KEY);
    if (plan) return plan as PayoffPlan;
  } catch {
    // Fall through to localStorage
  }

  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as PayoffPlan;
  } catch {
    // Nothing saved
  }

  return null;
}
