/** Grading and scoring for staged Mathematical Literacy problems. */
import type { StageField } from '../../types';
import { type GradeResult, gradeChoice, gradeNumeric } from './grade';

export function gradeField(field: StageField, response: string | undefined): GradeResult {
  return field.kind === 'choice'
    ? gradeChoice(field.options, field.answer, response)
    : gradeNumeric(field.answer, response, field.tolerance ?? 0.01, field.wrongAnswers);
}

/** Credit for one field: 1 when right first time, 0.5 when right after one correction, else 0. */
export const fieldCredit = (correctOnTry: 1 | 2 | null): number => (correctOnTry === 1 ? 1 : correctOnTry === 2 ? 0.5 : 0);

/**
 * Stage score following the rubric: the stage's points are shared equally between its
 * fields, so a student who gets part of a stage right still earns part of the points.
 * Rounded down to 0.5, so a mistake is never hidden by rounding up.
 */
export function stageScore(points: number, credits: number[]): number {
  if (credits.length === 0) return 0;
  const raw = (points * credits.reduce((s, c) => s + c, 0)) / credits.length;
  return Math.floor(raw * 2 + 1e-9) / 2;
}
