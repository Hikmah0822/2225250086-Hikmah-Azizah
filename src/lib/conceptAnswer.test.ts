import { describe, expect, it } from 'vitest';
import { QUICK_CONCEPT_QUESTIONS, answerConcept, detectShapes } from './conceptAnswer';
import { SHAPES } from '../content/shapes';

const words = (s: string) => s.split(/\s+/).length;

describe('detectShapes', () => {
  it('tells "persegi panjang" apart from "persegi"', () => {
    expect(detectShapes('apa itu persegi panjang')).toEqual(['rectangle']);
    expect(detectShapes('beda persegi dan persegi panjang')).toEqual(['square', 'rectangle']);
    expect(detectShapes('Layang layang vs belah ketupat')).toEqual(['kite', 'rhombus']);
    expect(detectShapes('jajar genjang')).toEqual(['parallelogram']);
  });
});

describe('answerConcept', () => {
  it('answers every quick question', () => {
    for (const q of QUICK_CONCEPT_QUESTIONS) expect(answerConcept(q), q).not.toBeNull();
  });

  it('gives the official formula from the lesson data', () => {
    const a = answerConcept('rumus luas trapesium')!;
    expect(a.text).toContain('L = ½ × (');
    expect(a.text).not.toContain('Keliling:');
    expect(a.link?.to).toBe('/belajar/trapezoid');
  });

  it('compares two shapes by the properties that differ', () => {
    const a = answerConcept('beda belah ketupat dan layang-layang')!;
    expect(a.text).toContain('Belah Ketupat');
    expect(a.text).toContain('Layang-layang');
    expect(a.stage).toBe('rencana');
  });

  it('answers aspects from the validated property table', () => {
    const a = answerConcept('diagonal belah ketupat')!;
    expect(a.text).toContain('Diagonal saling tegak lurus');
    expect(a.text).not.toContain('Kedua diagonal sama panjang');
  });

  it('explains keliling vs luas', () => {
    expect(answerConcept('apa beda keliling dan luas?')!.text).toContain('PINGGIRAN');
  });

  it('describes every shape, ending with a question, in few words', () => {
    for (const s of Object.values(SHAPES)) {
      const a = answerConcept(`apa itu ${s.name}`)!;
      expect(a.text).toContain(s.name);
      expect(a.text.trim().endsWith('?')).toBe(true);
      expect(words(a.text)).toBeLessThanOrEqual(70);
    }
  });

  it('returns null for unrelated questions', () => {
    expect(answerConcept('siapa presiden indonesia')).toBeNull();
  });
});
