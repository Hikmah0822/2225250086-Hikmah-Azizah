import { describe, expect, it } from 'vitest';
import { buildPhotoMessages, buildPhotoPrompt, hasSelfCorrection, parsePhotoReply, PHOTO_LIMITS, validatePhotoRequest } from './photoSolve';

const IMG = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';

describe('validatePhotoRequest', () => {
  it('accepts an image data URL and rejects anything else', () => {
    expect(validatePhotoRequest({ image: IMG })).toEqual({ ok: true, image: IMG });
    expect(validatePhotoRequest({ image: 'https://evil.example/x.jpg' }).ok).toBe(false);
    expect(validatePhotoRequest({ image: 'data:text/html;base64,PGh0bWw+' }).ok).toBe(false);
    expect(validatePhotoRequest({}).ok).toBe(false);
    expect(validatePhotoRequest(null).ok).toBe(false);
  });
  it('rejects photos that are too large', () => {
    const big = 'data:image/jpeg;base64,' + 'A'.repeat(PHOTO_LIMITS.imageChars);
    expect(validatePhotoRequest({ image: big }).ok).toBe(false);
  });
});

describe('buildPhotoPrompt', () => {
  it('states the segiempat scope, the correct parallelogram height, RMT stages and the JSON format', () => {
    const p = buildPhotoPrompt();
    expect(p).toContain('segiempat');
    expect(p).toContain('BUKAN sisi miring');
    expect(p).toContain('"orientasi"');
    expect(p).toContain('"bukti"');
    expect(p).toContain('"status":"ok"');
    expect(p).toContain('data pribadi');
    // Figure instructions: vertex convention and allowed label positions.
    expect(p).toContain('A kiri bawah');
    expect(p).toContain('"trapezoid-isosceles"');
    expect(p).toContain('highlight');
  });
  it('sends the photo as an image part', () => {
    const m = buildPhotoMessages(IMG);
    expect(m[0].role).toBe('system');
    expect(JSON.stringify(m[1].content)).toContain(IMG);
  });
});

describe('parsePhotoReply', () => {
  const ok = {
    status: 'ok',
    question: 'Jajargenjang alas 20 m, tinggi 12 m. Berapa luasnya?',
    known: ['alas 20 m', 'tinggi 12 m'],
    asked: 'luas jajargenjang',
    steps: [
      { stage: 'definisi', text: 'Yang ditanya adalah **luas**.' },
      { stage: 'rencana', text: 'Pakai L = a × t.' },
      { stage: 'tidak-ada', text: 'L = 20 × 12 = 240 m².' },
    ],
    finalAnswer: '240 m²',
    check: '20 × 12 = 240, satuannya m² karena luas.',
  };

  it('reads JSON even inside a code fence or after thinking text', () => {
    const r = parsePhotoReply('<think>hmm</think>```json\n' + JSON.stringify(ok) + '\n```');
    expect(r?.kind).toBe('solution');
    if (r?.kind !== 'solution') return;
    expect(r.solution.steps).toHaveLength(3);
    expect(r.solution.steps[0].text).toBe('Yang ditanya adalah luas.');
    // Unknown stage falls back to "laksana".
    expect(r.solution.steps[2].stage).toBe('laksana');
    expect(r.solution.finalAnswer).toBe('240 m²');
  });

  it('recognises unreadable and off-topic photos', () => {
    expect(parsePhotoReply('{"status":"unreadable"}')).toEqual({ kind: 'unreadable' });
    expect(parsePhotoReply('{"status":"off-topic","question":"Berapa 2 + 2?"}')).toEqual({ kind: 'off-topic', question: 'Berapa 2 + 2?' });
  });

  it('returns null when the answer is incomplete or not JSON', () => {
    expect(parsePhotoReply('maaf, saya tidak bisa')).toBeNull();
    expect(parsePhotoReply(JSON.stringify({ ...ok, finalAnswer: '' }))).toBeNull();
    expect(parsePhotoReply(JSON.stringify({ ...ok, steps: [] }))).toBeNull();
  });

  it('keeps a valid figure and per-step highlights, dropping unknown parts', () => {
    const withFigure = {
      ...ok,
      figure: {
        shape: 'parallelogram',
        annotations: [
          { at: 'AB', text: '20 m' },
          { at: 'height', text: '12 m' },
          { at: 'AB', text: 'dobel' },
          { at: 'XY', text: '?' },
          { at: 'BC', text: '' },
        ],
      },
      steps: [{ stage: 'rencana', text: 'L = a × t', highlight: ['AB', 'height', 'AB', 'hidung'] }],
    };
    const r = parsePhotoReply(JSON.stringify(withFigure));
    expect(r?.kind).toBe('solution');
    if (r?.kind !== 'solution') return;
    expect(r.solution.figure).toEqual({
      shape: 'parallelogram',
      annotations: [{ at: 'AB', text: '20 m' }, { at: 'height', text: '12 m' }],
      size: {},
      label: '',
    });
    expect(r.solution.steps[0].highlight).toEqual(['AB', 'height']);
  });

  it('has no figure for an unknown shape or a missing figure', () => {
    const a = parsePhotoReply(JSON.stringify({ ...ok, figure: { shape: 'circle', annotations: [] } }));
    const b = parsePhotoReply(JSON.stringify({ ...ok, figure: null }));
    expect(a?.kind === 'solution' && a.solution.figure).toBeNull();
    expect(b?.kind === 'solution' && b.solution.figure).toBeNull();
    expect(b?.kind === 'solution' && b.solution.steps[0].highlight).toEqual([]);
  });

  it('reads sizes, the story label and whole-number grids', () => {
    const story = {
      ...ok,
      figure: { shape: 'rectangle', label: 'Lantai ruang tamu', size: { AB: 6, BC: 4, height: -1, XY: 3, CD: '6' }, annotations: [] },
      steps: [
        { stage: 'laksana', text: 'Toko B: 6/0,5 = 12 dan 4/0,5 = 8', grid: { cols: 12, rows: 8 } },
        { stage: 'laksana', text: 'Toko C', grid: { cols: 10, rows: 6.67 } },
        { stage: 'laksana', text: 'Terlalu banyak', grid: { cols: 100, rows: 2 } },
      ],
    };
    const r = parsePhotoReply(JSON.stringify(story));
    expect(r?.kind).toBe('solution');
    if (r?.kind !== 'solution') return;
    expect(r.solution.figure?.size).toEqual({ AB: 6, BC: 4 });
    expect(r.solution.figure?.label).toBe('Lantai ruang tamu');
    expect(r.solution.steps.map((s) => s.grid)).toEqual([{ cols: 12, rows: 8 }, null, null]);
  });

  it('asks the model to write fractions as a/b', () => {
    expect(buildPhotoPrompt()).toContain('a/b');
    expect(buildPhotoPrompt()).toContain('"label":"Lahan parkir"');
  });

  it('turns a spaced x between numbers into × but keeps the variable x', () => {
    const r = parsePhotoReply(
      JSON.stringify({ ...ok, steps: [{ stage: 'laksana', text: 'L = 6 m x 4 m = 24 m². Biaya = 96 x Rp13.500. Panjang = x + 6, lalu 2x = 20.' }] }),
    );
    expect(r?.kind === 'solution' && r.solution.steps[0].text).toBe('L = 6 m × 4 m = 24 m². Biaya = 96 × Rp13.500. Panjang = x + 6, lalu 2x = 20.');
  });

  it('spots a self-correction in the steps', () => {
    const r = parsePhotoReply(JSON.stringify(ok));
    if (r?.kind !== 'solution') throw new Error('expected a solution');
    expect(hasSelfCorrection(r.solution)).toBe(false);
    const fixed = { ...r.solution, steps: [{ stage: 'laksana' as const, text: 'Tunggu, mari hitung ulang: x = 10.', highlight: [], grid: null }] };
    expect(hasSelfCorrection(fixed)).toBe(true);
  });

  it('caps the number of steps', () => {
    const many = { ...ok, steps: Array.from({ length: 20 }, (_, i) => ({ stage: 'laksana', text: `Langkah ${i}` })) };
    const r = parsePhotoReply(JSON.stringify(many));
    expect(r?.kind === 'solution' && r.solution.steps.length).toBe(PHOTO_LIMITS.steps);
  });
});
