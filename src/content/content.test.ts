/** Content validation: catches broken questions and over-long cards before they reach students. */
import { describe, expect, it } from 'vitest';
import { QUESTIONS } from './questions';
import { PREP_CARDS, SHAPES } from './shapes';
import { PROPERTY_ROWS } from './properties';
import { LAB_TASKS } from './labTasks';
import { DETECTIVE_NODES, DETECTIVE_ROOT } from './detective';
import { SHAPE_MODELS } from '../lib/shapes';
import { computeProperties } from '../lib/geometry/predicates';
import { SHAPE_IDS, type ShapeId } from '../types';

const words = (s: string) => s.trim().split(/\s+/).length;

describe('question bank', () => {
  it('has unique ids', () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(QUESTIONS.map((q) => [q.id, q] as const))('%s is well-formed', (_id, q) => {
    expect(q.hints).toHaveLength(3);
    expect(q.solutionSteps.length).toBeGreaterThan(0);
    if (q.type === 'multiple-choice') {
      expect(q.options.map((o) => o.id)).toContain(q.answer);
      // Every distractor explains why it is wrong (CLAUDE.md §5.6).
      q.options.filter((o) => o.id !== q.answer).forEach((o) => expect(o.feedback.length).toBeGreaterThan(5));
    } else if (q.type === 'multi-select') {
      q.answer.forEach((a) => expect(q.options.map((o) => o.id)).toContain(a));
      q.options.filter((o) => !q.answer.includes(o.id)).forEach((o) => expect(o.feedback.length).toBeGreaterThan(5));
    } else {
      expect(Number.isFinite(q.answer)).toBe(true);
      q.wrongAnswers?.forEach((w) => expect(w.value).not.toBe(q.answer));
    }
  });

  it('every shape has the three fading levels', () => {
    for (const shape of SHAPE_IDS) {
      const levels = new Set(QUESTIONS.filter((q) => q.shape === shape).map((q) => q.level));
      expect([...levels].sort()).toEqual(['completion', 'example', 'independent']);
    }
  });
});

describe('extra questions: numeric keys recomputed', () => {
  const key = (id: string) => (QUESTIONS.find((q) => q.id === id) as { answer: number }).answer;
  it.each([
    ['PP-6', 72 / 9], ['PP-8', 30 / 2 - 9], ['PP-10', (300 * 200) / (30 * 20)],
    ['PS-6', Math.sqrt(144)], ['PS-7', 4 * 12.5], ['PS-9', (4 * 15) / 3],
    ['JG-6', 96 / 12], ['JG-7', 2 * (11 + 7)], ['JG-8', 3 * (180 / 5)], ['JG-11', 25 * 16 * 2],
    ['BK-6', (2 * 60) / 12], ['BK-7', 4 * 10], ['BK-8', 50 / 2],
    ['LL-6', 0.5 * 20 * 14], ['LL-7', 46 / 2 - 8], ['LL-8', 360 - 40 - 110 - 110], ['LL-11', 0.5 * 60 * 40],
    ['TR-6', 84 / (0.5 * (10 + 14))], ['TR-7', 8 + 16 + 5 + 5], ['TR-9', 65], ['TR-11', 0.5 * (4 + 8) * 3 * 25],
  ])('%s = %d', (id, expected) => {
    expect(key(id)).toBeCloseTo(expected, 9);
  });

  it('story problems for "pilah informasi" have needed info, a distractor, and wrong "ditanya" options', () => {
    const withFacts = QUESTIONS.filter((q) => q.story?.facts);
    expect(withFacts.length).toBeGreaterThanOrEqual(9);
    for (const q of withFacts) {
      const facts = q.story!.facts!;
      expect(facts.some((f) => f.needed), q.id).toBe(true);
      expect(facts.some((f) => !f.needed), q.id).toBe(true);
      expect(q.story!.askedChoices?.length, q.id).toBeGreaterThan(0);
      expect(q.story!.askedChoices).not.toContain(q.story!.asked);
    }
  });

  it('the bank reaches the PRD target of 70 questions', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(70);
  });
});

describe('lesson cards', () => {
  const cards = [...PREP_CARDS, ...Object.values(SHAPES).flatMap((s) => s.cards)];
  it.each(cards.map((c) => [c.id, c] as const))('%s has at most 40 words', (_id, c) => {
    expect(words(c.body)).toBeLessThanOrEqual(40);
  });
});

describe('property table agrees with the geometry engine', () => {
  const check: Record<string, (p: ReturnType<typeof computeProperties>) => boolean> = {
    's-all-equal': (p) => p.allSidesEqual,
    's-opp-equal': (p) => p.oppositeSidesEqual,
    's-two-par': (p) => p.bothPairsParallel,
    's-one-par': (p) => p.exactlyOnePairParallel,
    'a-right': (p) => p.allRightAngles,
    'a-opp-equal': (p) => p.oppositeAnglesEqual,
    'd-bisect': (p) => p.diagonalsBisectEachOther,
    'd-one-bisect': (p) => p.oneDiagonalBisected,
    'd-perp': (p) => p.diagonalsPerpendicular,
  };
  // Use the general trapezoid; the table marks isosceles-only rows with text.
  for (const shape of SHAPE_IDS as ShapeId[]) {
    it(`${shape}`, () => {
      const p = computeProperties(SHAPE_MODELS[shape].initial);
      for (const row of PROPERTY_ROWS) {
        const fn = check[row.id];
        const value = row.values[shape];
        if (fn && typeof value === 'boolean') expect([row.id, fn(p)]).toEqual([row.id, value]);
      }
    });
  }
});

describe('lab tasks and detective tree', () => {
  it('lab task answers exist among options', () => {
    for (const task of Object.values(LAB_TASKS)) {
      task!.answer.forEach((a) => expect(task!.options.map((o) => o.id)).toContain(a));
    }
  });

  it('every detective branch ends in a result', () => {
    const visit = (id: string, depth: number): void => {
      const node = DETECTIVE_NODES[id];
      expect(node, id).toBeDefined();
      expect(depth).toBeLessThan(10);
      if (node.kind === 'question') {
        visit(node.yes, depth + 1);
        visit(node.no, depth + 1);
      }
    };
    visit(DETECTIVE_ROOT, 0);
  });
});
