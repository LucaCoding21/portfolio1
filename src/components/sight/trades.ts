"use client";

import { useSyncExternalStore } from "react";
import { TRADES, type Trade } from "./tradeData";

export { TRADES } from "./tradeData";
export type { Trade, Q, Answered } from "./tradeData";

/**
 * Which trade the page is currently speaking to. The questions wall
 * rotates through them and lets the reader pin one; the Ask card and the
 * final CTA read the same choice. Data lives in tradeData.ts.
 */

/* ---------- the store ---------- */

type State = { index: number; pinned: boolean };

let state: State = { index: 0, pinned: false };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setTrade(index: number, pin = false) {
  const next = ((index % TRADES.length) + TRADES.length) % TRADES.length;
  if (next === state.index && pin === state.pinned) return;
  state = { index: next, pinned: pin || state.pinned };
  emit();
}

/** Moves to the next trade on the row, skipping the catch-all. */
export function nextTrade() {
  let next = state.index + 1;
  while (TRADES[next % TRADES.length].catchAll) next += 1;
  setTrade(next);
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

const getSnapshot = () => state;
const serverSnapshot: State = { index: 0, pinned: false };
const getServerSnapshot = () => serverSnapshot;

/** The current trade and whether the reader pinned it. */
export function useTradeState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useTrade(): Trade {
  return TRADES[useTradeState().index];
}
