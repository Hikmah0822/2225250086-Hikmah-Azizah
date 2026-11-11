import { describe, expect, it } from 'vitest';
import { QUESTIONS } from '../../content/questions';
import { grade } from './grade';
import { makeTwin, rng, twinForMisconception } from './twins';
import { REVIEW_SIZE, buildReviewSet, topMisconceptions } from './review';

describe('twin questions', () => {
  it('are deterministic per seed', () => {
    expect(rng(5)()).toBe(rng(5)());
    expect(twinForMisconception('M01', 3)).toEqual(twinForMisconception('M01', 3));
  });

  it('every template produces a gradable question whose key and diagnoses are consistent', () => {
    for (let seed = 0; seed < 40; seed++) {
      for (const m of ['M01', 'M02', 'M03'] as const) {
        const q = twinForMisconception(m, seed)!;
        expect(grade(q, String(q.answer)).status, q.id).toBe('correct');
        q.wrongAnswers?.forEach((w) => {
          expect(w.value).not.toBe(q.answer);
          expect(grade(q, String(w.value)).status).toBe('wrong');
        });
        expect(q.hints).toHaveLength(3);
      }
    }
  });

  it('mirror the shape of the original question', () => {
    const jg1 = QUESTIONS.find((q) => q.id === 'JG-1')!;
    const twin = makeTwin(jg1, 7)!;
    expect(twin.shape).toBe('parallelogram');
    expect(twin.stem).toContain('Jajargenjang');
    expect(makeTwin(QUESTIONS.find((q) => q.id === 'PS-4')!, 1)).toBeNull(); // multiple choice: no twin
  });

  it('parallelogram twin: the slanted side is always longer than the height', () => {
    for (let seed = 0; seed < 50; seed++) {
      const q = twinForMisconception('M01', seed)!;
      const [, b, t] = q.stem.match(/\d+/g)!.map(Number);
      expect(b).toBeGreaterThan(t);
    }
  });
});

describe('Latihan Ulang Pintar', () => {
  const attempts = [
    { questionId: 'JG-3', correct: false, misconception: 'M01' as const },
    { questionId: 'BK-2', correct: false, misconception: 'M03' as const },
    { questionId: 'LL-5', correct: false, misconception: 'M03' as const },
    { questionId: 'PP-2', correct: true },
    { questionId: 'PS-4', correct: false },
  ];

  it('ranks the most frequent misconceptions first', () => {
    expect(topMisconceptions(attempts).map((m) => m.id)).toEqual(['M03', 'M01']);
  });

  it('builds a focused set with failed questions first and a twin per misconception', () => {
    const { questions, focus } = buildReviewSet(QUESTIONS, attempts, 1);
    expect(focus).toEqual(['M03', 'M01']);
    expect(questions.length).toBeLessThanOrEqual(REVIEW_SIZE);
    const ids = questions.map((q) => q.id);
    expect(ids).toContain('BK-2');
    expect(ids).toContain('JG-3');
    expect(ids.filter((id) => id.startsWith('TW-')).length).toBe(2);
    expect(new Set(ids).size).toBe(ids.length);
    expect(questions.every((q) => q.level !== 'example')).toBe(true);
  });

  it('is empty when there are no mistakes', () => {
    expect(buildReviewSet(QUESTIONS, [{ questionId: 'PP-1', correct: true }], 1).questions).toEqual([]);
  });
});
