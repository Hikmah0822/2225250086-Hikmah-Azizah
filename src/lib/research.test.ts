import { describe, expect, it } from 'vitest';
import { CL_ITEMS, POSTTEST, PRETEST } from '../content/assessment';
import { loadMeans, nGain, nGainCategory, scoreTest, toCsv } from './research';

describe('instruments', () => {
  it('pretest and posttest are parallel (same objective per item number)', () => {
    expect(PRETEST).toHaveLength(10);
    expect(POSTTEST).toHaveLength(10);
    expect(PRETEST.map((i) => i.objective)).toEqual(POSTTEST.map((i) => i.objective));
    expect(PRETEST.map((i) => i.type)).toEqual(POSTTEST.map((i) => i.type));
  });

  it('every multiple-choice key exists', () => {
    for (const i of [...PRETEST, ...POSTTEST]) {
      if (i.type === 'multiple-choice') expect(i.options!.map((o) => o.id)).toContain(i.answer);
    }
  });

  it('numeric keys are mathematically correct', () => {
    const key = (id: string) => [...PRETEST, ...POSTTEST].find((i) => i.id === id)!.answer;
    expect(key('pre-6')).toBe(180 - 72);
    expect(key('pre-7')).toBe(14 * 7);
    expect(key('pre-8')).toBe(0.5 * 12 * 18);
    expect(key('pre-9')).toBe(2 * (15 + 6));
    expect(key('pre-10')).toBe(12 * 9 * 15000);
    expect(key('post-6')).toBe(180 - 64);
    expect(key('post-7')).toBe(15 * 8);
    expect(key('post-8')).toBe(0.5 * 14 * 10);
    expect(key('post-9')).toBe(12 + 18 + 5 + 5);
    expect(key('post-10')).toBe(0.5 * (10 + 16) * 6 * 10000);
  });

  it('the questionnaire has 3 IL, 3 EL and 4 GL items', () => {
    const count = (t: string) => CL_ITEMS.filter((i) => i.type === t).length;
    expect([count('IL'), count('EL'), count('GL')]).toEqual([3, 3, 4]);
  });
});

describe('scoring', () => {
  it('scores a test and accepts Indonesian number formats', () => {
    const answers = Object.fromEntries(PRETEST.map((i) => [i.id, String(i.answer)]));
    answers['pre-10'] = 'Rp1.620.000';
    expect(scoreTest(PRETEST, answers, 0, 1000).score).toBe(100);
    expect(scoreTest(PRETEST, {}, 0, 1000).score).toBe(0);
  });

  it('computes N-gain (Hake)', () => {
    expect(nGain(40, 70)).toBeCloseTo(0.5);
    expect(nGainCategory(nGain(40, 70))).toBe('sedang');
    expect(nGainCategory(0.75)).toBe('tinggi');
    expect(nGainCategory(0.1)).toBe('rendah');
    expect(nGain(100, 100)).toBeNull();
  });

  it('averages the cognitive load scales', () => {
    const answers = Object.fromEntries(CL_ITEMS.map((i) => [i.id, i.type === 'IL' ? 6 : i.type === 'EL' ? 2 : 8]));
    expect(loadMeans({ answers, paas: 5, at: 0 })).toEqual({ IL: 6, EL: 2, GL: 8 });
  });

  it('exports CSV with a header and one escaped row', () => {
    const csv = toCsv({ name: 'Siti, "Nur"', className: 'VII A', pretestItems: PRETEST, posttestItems: POSTTEST });
    const [header, row] = csv.trim().split('\n');
    expect(header.startsWith('nama,kelas')).toBe(true);
    expect(row.startsWith('"Siti, ""Nur""",VII A')).toBe(true);
  });
});
