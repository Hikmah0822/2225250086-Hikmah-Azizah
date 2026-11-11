import { describe, expect, it } from 'vitest';
import { grade } from './grade';
import { QUESTIONS } from '../../content/questions';
import type { Question } from '../../types';

const byId = (id: string) => QUESTIONS.find((q) => q.id === id) as Question;

describe('grade', () => {
  it('numeric: accepts comma decimals and diagnoses known mistakes', () => {
    const q = byId('PP-2'); // keliling 9 × 4 → 26
    expect(grade(q, '26').status).toBe('correct');
    expect(grade(q, '36')).toMatchObject({ status: 'wrong', misconception: 'M02' });
    expect(grade(q, '27').status).toBe('wrong');
    expect(grade(q, 'dua enam').status).toBe('invalid');
    expect(grade(byId('BK-4'), '26,0').status).toBe('correct');
    expect(grade(byId('BK-4'), '42,25')).toMatchObject({ status: 'wrong', misconception: 'M02' });
  });

  it('multiple choice: returns option feedback', () => {
    const q = byId('JG-3');
    expect(grade(q, 'b').status).toBe('correct');
    expect(grade(q, 'a')).toMatchObject({ status: 'wrong', misconception: 'M01' });
    expect(grade(q, '').status).toBe('invalid');
  });

  it('multi-select: needs the exact set', () => {
    const q = byId('BK-3'); // a, b, d
    expect(grade(q, ['a', 'b', 'd']).status).toBe('correct');
    expect(grade(q, ['d', 'a', 'b']).status).toBe('correct');
    const partial = grade(q, ['a', 'b']);
    expect(partial.status).toBe('wrong');
    expect(partial.feedback).toContain('belum kamu pilih');
    expect(grade(q, ['a', 'b', 'c', 'd'])).toMatchObject({ status: 'wrong', misconception: 'M04' });
  });

  it('every numeric question accepts its own answer', () => {
    for (const q of QUESTIONS) {
      if (q.type === 'numeric') expect(grade(q, String(q.answer).replace('.', ',')).status, q.id).toBe('correct');
    }
  });
});
