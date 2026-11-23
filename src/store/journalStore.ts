/**
 * Jurnal Berpikirku (RMT reflection & self-evaluation). Stored on this device only.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CognitiveFunctionId } from '../content/rmt';

export interface JournalEntry {
  at: number;
  /** e.g. "Latihan Jajargenjang" */
  activity: string;
  score: number | null;
  functions: CognitiveFunctionId[];
  /** 1 (belum paham) … 4 (sangat paham). */
  confidence: 1 | 2 | 3 | 4;
  /** "Apa yang kamu pelajari, dan mengapa itu benar?" */
  learned: string;
  /** "Apa yang masih membingungkan?" */
  confusing: string;
}

const MAX_ENTRIES = 100;
export const JOURNAL_TEXT_MAX = 300;

interface JournalState {
  entries: JournalEntry[];
  add: (e: Omit<JournalEntry, 'at'>) => void;
  clear: () => void;
}

export const useJournal = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],
      add: (e) =>
        set((s) => ({
          entries: [
            ...s.entries,
            { ...e, learned: e.learned.trim().slice(0, JOURNAL_TEXT_MAX), confusing: e.confusing.trim().slice(0, JOURNAL_TEXT_MAX), at: Date.now() },
          ].slice(-MAX_ENTRIES),
        })),
      clear: () => set({ entries: [] }),
    }),
    { name: 'segiempatku-journal', version: 1 },
  ),
);

/** How often each thinking action was reported, most frequent first. */
export function functionCounts(entries: JournalEntry[]): { id: CognitiveFunctionId; count: number }[] {
  const m = new Map<CognitiveFunctionId, number>();
  entries.forEach((e) => e.functions.forEach((f) => m.set(f, (m.get(f) ?? 0) + 1)));
  return [...m.entries()].map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count);
}
