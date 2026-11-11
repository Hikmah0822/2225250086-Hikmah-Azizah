/**
 * Latihan Ulang Pintar: builds a short practice set from the student's own mistakes (GL02).
 * - Finds the misconceptions the student showed most often (recent attempts).
 * - For each: up to 2 bank questions that target it + 1 fresh twin question.
 * - Adds recently failed questions without a known misconception.
 */
import type { MisconceptionId, Question } from '../../types';
import { twinForMisconception } from './twins';

export interface AttemptLike {
  questionId: string;
  correct: boolean;
  misconception?: MisconceptionId;
}

export const REVIEW_SIZE = 8;

const targets = (q: Question, m: MisconceptionId): boolean =>
  q.type === 'numeric' ? Boolean(q.wrongAnswers?.some((w) => w.misconception === m)) : q.options.some((o) => o.misconception === m);

/** Misconceptions in recent wrong attempts, most frequent first. */
export function topMisconceptions(attempts: AttemptLike[], recent = 60): { id: MisconceptionId; count: number }[] {
  const counts = new Map<MisconceptionId, number>();
  attempts.slice(-recent).forEach((a) => {
    if (!a.correct && a.misconception) counts.set(a.misconception, (counts.get(a.misconception) ?? 0) + 1);
  });
  return [...counts.entries()].map(([id, count]) => ({ id, count })).sort((x, y) => y.count - x.count);
}

export function buildReviewSet(bank: Question[], attempts: AttemptLike[], seed: number): { questions: Question[]; focus: MisconceptionId[] } {
  const focus = topMisconceptions(attempts).slice(0, 3).map((m) => m.id);
  const wrongIds = new Set(attempts.slice(-60).filter((a) => !a.correct).map((a) => a.questionId));
  const chosen: Question[] = [];
  const add = (q: Question | null) => {
    if (q && chosen.length < REVIEW_SIZE && !chosen.some((c) => c.id === q.id)) chosen.push(q);
  };

  focus.forEach((m, i) => {
    const candidates = bank
      .filter((q) => q.level !== 'example' && targets(q, m))
      // Questions the student got wrong come first.
      .sort((a, b) => Number(wrongIds.has(b.id)) - Number(wrongIds.has(a.id)));
    candidates.slice(0, 2).forEach(add);
    add(twinForMisconception(m, seed + i));
  });

  // Fill with other recently failed questions.
  bank.filter((q) => wrongIds.has(q.id) && q.level !== 'example').forEach(add);

  return { questions: chosen, focus };
}
