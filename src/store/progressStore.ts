import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MisconceptionId, ShapeId } from '../types';

export type ShapeStatus = 'not-started' | 'in-progress' | 'done';

export interface ShapeProgress {
  cardsSeen: string[];
  bestScore: number;
  lastScore: number | null;
  practiced: boolean;
}

export interface Attempt {
  questionId: string;
  correct: boolean;
  misconception?: MisconceptionId;
  at: number;
}

export interface LiteracyResult {
  best: number;
  last: number;
  /** Score per stage (Tahap) of the last attempt. */
  lastStages: number[];
}

interface ProgressState {
  version: 1;
  shapes: Partial<Record<ShapeId | 'prep' | 'mixed', ShapeProgress>>;
  attempts: Attempt[];
  literacy: Record<string, LiteracyResult>;
  /** Lab shapes the student has opened (for the "Penjelajah Lab" sticker). */
  labVisited: string[];
  /** Detektif cases solved correctly. */
  detectiveSolved: number;
  /** Stickers already announced to the student. */
  badgesSeen: string[];
  finishLiteracy: (taskId: string, stages: number[]) => void;
  markLabVisited: (shape: string) => void;
  addDetectiveSolved: () => void;
  markBadgesSeen: (ids: string[]) => void;
  markCardSeen: (shape: ShapeId | 'prep', cardId: string) => void;
  recordAttempt: (attempt: Omit<Attempt, 'at'>) => void;
  finishPractice: (shape: ShapeId | 'mixed', score: number) => void;
  reset: () => void;
}

const MAX_ATTEMPTS = 500;
const empty = (): ShapeProgress => ({ cardsSeen: [], bestScore: 0, lastScore: null, practiced: false });

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      version: 1,
      shapes: {},
      attempts: [],
      literacy: {},
      labVisited: [],
      detectiveSolved: 0,
      badgesSeen: [],
      markLabVisited: (shape) => set((s) => (s.labVisited.includes(shape) ? s : { labVisited: [...s.labVisited, shape] })),
      addDetectiveSolved: () => set((s) => ({ detectiveSolved: s.detectiveSolved + 1 })),
      markBadgesSeen: (ids) => set((s) => ({ badgesSeen: [...new Set([...s.badgesSeen, ...ids])] })),
      finishLiteracy: (taskId, stages) =>
        set((s) => {
          const total = stages.reduce((a, b) => a + b, 0);
          const prev = s.literacy[taskId];
          return {
            literacy: { ...s.literacy, [taskId]: { best: Math.max(prev?.best ?? 0, total), last: total, lastStages: stages } },
          };
        }),
      markCardSeen: (shape, cardId) =>
        set((s) => {
          const cur = s.shapes[shape] ?? empty();
          if (cur.cardsSeen.includes(cardId)) return s;
          return { shapes: { ...s.shapes, [shape]: { ...cur, cardsSeen: [...cur.cardsSeen, cardId] } } };
        }),
      recordAttempt: (attempt) =>
        set((s) => ({ attempts: [...s.attempts, { ...attempt, at: Date.now() }].slice(-MAX_ATTEMPTS) })),
      finishPractice: (shape, score) =>
        set((s) => {
          const cur = s.shapes[shape] ?? empty();
          return {
            shapes: {
              ...s.shapes,
              [shape]: { ...cur, practiced: true, lastScore: score, bestScore: Math.max(cur.bestScore, score) },
            },
          };
        }),
      reset: () => set({ shapes: {}, attempts: [], literacy: {}, labVisited: [], detectiveSolved: 0, badgesSeen: [] }),
    }),
    { name: 'segiempatku-progress', version: 1 },
  ),
);

export function shapeStatus(p: ShapeProgress | undefined, totalCards: number): ShapeStatus {
  if (!p || (p.cardsSeen.length === 0 && !p.practiced)) return 'not-started';
  if (p.practiced && p.cardsSeen.length >= totalCards) return 'done';
  return 'in-progress';
}

/** Percentage of a shape's journey: cards (70%) + practice (30%). */
export function shapePercent(p: ShapeProgress | undefined, totalCards: number): number {
  if (!p) return 0;
  const cards = Math.min(1, p.cardsSeen.length / totalCards);
  return Math.round(cards * 70 + (p.practiced ? 30 : 0));
}
