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
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to localStorage:', err);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(plan));
    } catch (lsErr) {
      console.warn('localStorage save failed:', lsErr);
    }
  }
}

export async function loadPlan(): Promise<PayoffPlan | null> {
  try {
    const db = await getDB();
    const plan = await db.get(STORE_NAME, PLAN_KEY);
    if (plan) return plan as PayoffPlan;
  } catch (err) {
    console.warn('IndexedDB load failed, falling back to localStorage:', err);
  }

  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.debts)) {
        return parsed as PayoffPlan;
      }
      console.warn('localStorage data failed validation, ignoring.');
    }
  } catch (err) {
    console.warn('localStorage load failed:', err);
  }

  return null;
}
