import { describe, expect, it } from 'vitest';
import { LITERACY_MAX_SCORE, LITERACY_TASKS } from '../../content/literacy';
import { fieldCredit, gradeField, stageScore } from './literacy';

const task = (id: string) => LITERACY_TASKS.find((t) => t.id === id)!;
const field = (taskId: string, tahap: number, fieldId: string) =>
  task(taskId).stages.find((s) => s.tahap === tahap)!.fields.find((f) => f.id === fieldId)!;

describe('rubric (kisi-kisi) structure', () => {
  it('has four problems, one per indicator, 6 points each, 24 in total', () => {
    expect(LITERACY_TASKS.map((t) => t.indicator)).toEqual(['reasoning', 'formulating', 'employing', 'interpreting']);
    for (const t of LITERACY_TASKS) expect(t.stages.reduce((s, st) => s + st.score, 0), t.id).toBe(6);
    expect(LITERACY_MAX_SCORE).toBe(24);
  });

  it('stage points match the rubric', () => {
    const points = (id: string) => task(id).stages.map((s) => s.score);
    expect(points('ML-1')).toEqual([1, 2, 1, 1, 1]);
    expect(points('ML-2')).toEqual([1, 1, 1, 1, 1, 1]);
    expect(points('ML-3')).toEqual([1, 2, 2, 1]);
    expect(points('ML-4')).toEqual([1, 1, 1, 1, 1, 1]);
  });

  it('every field is well-formed', () => {
    for (const t of LITERACY_TASKS) {
      for (const st of t.stages) {
        expect(st.fields.length, `${t.id} tahap ${st.tahap}`).toBeGreaterThan(0);
        expect(st.explanation.length).toBeGreaterThan(0);
        for (const f of st.fields) {
          if (f.kind === 'choice') {
            expect(f.options.map((o) => o.id)).toContain(f.answer);
            f.options.filter((o) => o.id !== f.answer).forEach((o) => expect(o.feedback.length).toBeGreaterThan(5));
          } else {
            f.wrongAnswers?.forEach((w) => expect(Math.abs(w.value - f.answer)).toBeGreaterThan(f.tolerance ?? 0.01));
          }
        }
      }
    }
  });
});

describe('answer key values are mathematically correct', () => {
  it('soal 1: keramik', () => {
    const floor = 600 * 400;
    expect(field('ML-1', 2, 'floor')).toMatchObject({ answer: floor });
    const n = [40, 50, 60].map((s) => Math.ceil(floor / (s * s)));
    expect(n).toEqual([150, 96, 67]);
    const cost = [n[0] * 9000, n[1] * 13500, n[2] * 20000];
    expect(cost).toEqual([1350000, 1296000, 1340000]);
    expect(Math.min(...cost)).toBe(cost[1]); // Toko B
    expect(cost[2] - cost[1]).toBe(44000);
    expect(cost[0] - cost[1]).toBe(54000);
  });

  it('soal 2: taman', () => {
    const x = (52 / 2 - 6) / 2;
    expect(x).toBe(10);
    expect((x + 6) * x).toBe(160);
  });

  it('soal 3: kolam (sides consistent with an isosceles trapezoid)', () => {
    expect(Math.hypot((26 - 14) / 2, 8)).toBe(10);
    expect(0.5 * (14 + 26) * 8 * 12000 + (14 + 26 + 10 + 10) * 30000).toBe(3720000);
  });

  it('soal 4: parkir', () => {
    expect(Math.floor((20 * 12) / 7)).toBe(34);
    expect(Math.floor((20 * 13) / 7) - Math.floor((20 * 12) / 7)).toBe(3);
  });
});

describe('grading', () => {
  it('accepts rupiah and thousands separators', () => {
    expect(gradeField(field('ML-1', 3, 'cB'), 'Rp1.296.000').status).toBe('correct');
    expect(gradeField(field('ML-1', 2, 'floor'), '240.000').status).toBe('correct');
    expect(gradeField(field('ML-1', 2, 'nC'), '66')).toMatchObject({ status: 'wrong' });
    expect(gradeField(field('ML-4', 3, 'div'), '34,29').status).toBe('correct');
    expect(gradeField(field('ML-4', 2, 'area'), '260')).toMatchObject({ status: 'wrong', misconception: 'M01' });
  });

  it('shares stage points between fields (partial credit)', () => {
    expect(stageScore(2, [1, 1, 1, 1])).toBe(2);
    expect(stageScore(2, [1, 1, 1, 0])).toBe(1.5);
    // One of four fields right only after a correction: 1,75 → 1,5 (never rounded up to full marks).
    expect(stageScore(2, [1, 1, 1, 0.5])).toBe(1.5);
    expect(stageScore(1, [1, 1, 1])).toBe(1);
    expect(stageScore(1, [fieldCredit(2)])).toBe(0.5);
    expect(stageScore(1, [fieldCredit(null)])).toBe(0);
  });
});
