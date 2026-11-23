import { describe, expect, it } from 'vitest';
import { COGNITIVE_FUNCTIONS, CONCEPT_FUNCTIONS, LAB_FUNCTIONS, MLE_CRITERIA, SORTER_FUNCTIONS, reflectionChoices } from './rmt';
import { QUESTIONS } from './questions';
import { functionCounts } from '../store/journalStore';

const words = (s: string) => s.trim().split(/\s+/).length;

describe('RMT content', () => {
  it('covers all three levels of cognitive functions (Kinard & Kozulin, Table 4.1)', () => {
    const levels = new Set(Object.values(COGNITIVE_FUNCTIONS).map((f) => f.level));
    expect([...levels].sort()).toEqual([1, 2, 3]);
  });
  it('keeps definitions short for SMP students', () => {
    for (const f of Object.values(COGNITIVE_FUNCTIONS)) {
      expect(words(f.meaning), f.id).toBeLessThanOrEqual(25);
      expect(f.id).toBe(Object.keys(COGNITIVE_FUNCTIONS).find((k) => k === f.id));
    }
  });
  it('tags every question with 1–4 thinking actions', () => {
    for (const q of QUESTIONS) {
      const ids = CONCEPT_FUNCTIONS[q.concept];
      expect(ids.length, q.id).toBeGreaterThan(0);
      expect(ids.length, q.id).toBeLessThanOrEqual(4);
    }
    expect(LAB_FUNCTIONS).toContain('constancy');
    expect(SORTER_FUNCTIONS).toContain('define');
  });
  it('offers at most 5 reflection choices, always including logical evidence', () => {
    const all = QUESTIONS.map((q) => q.concept);
    const r = reflectionChoices(all);
    expect(r.length).toBeLessThanOrEqual(5);
    expect(r).toContain('evidence');
    expect(new Set(r).size).toBe(r.length);
    expect(reflectionChoices(['area'])).toEqual(['analyze', 'prior', 'precise', 'evidence']);
  });
  it('lists the four MLE criteria', () => {
    expect(MLE_CRITERIA.map((c) => c.id)).toEqual(['intentionality', 'transcendence', 'meaning', 'competence']);
  });
  it('counts thinking actions reported in the journal', () => {
    const e = { at: 0, activity: 'x', score: 80, confidence: 3 as const, learned: 'abc', confusing: '' };
    expect(functionCounts([{ ...e, functions: ['compare', 'evidence'] }, { ...e, functions: ['compare'] }])).toEqual([
      { id: 'compare', count: 2 },
      { id: 'evidence', count: 1 },
    ]);
  });
});
