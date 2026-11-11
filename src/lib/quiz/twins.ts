/**
 * Soal kembar (twin questions): same structure, new numbers (docs/03 §6).
 * Used after a student needed the solution, and in "Latihan Ulang Pintar".
 * Each template targets a common misconception and comes with full hints, steps and
 * diagnosis of the typical wrong answers.
 */
import type { MisconceptionId, NumericQuestion, Question, ShapeId } from '../../types';
import { formatNumber } from '../format';

/** Small deterministic random generator (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(r: () => number, xs: T[]): T => xs[Math.floor(r() * xs.length)];
const f = (n: number) => formatNumber(n, 2);

type TwinKind = 'parallelogram-area' | 'rectangle-area' | 'rectangle-perimeter' | 'square-area' | 'rhombus-area' | 'kite-area' | 'trapezoid-area';

const base = (id: string, shape: ShapeId, concept: 'area' | 'perimeter'): Pick<NumericQuestion, 'id' | 'shape' | 'concept' | 'objective' | 'level' | 'difficulty' | 'type'> => ({
  id,
  shape,
  concept,
  objective: 'TP5',
  level: 'independent',
  difficulty: 2,
  type: 'numeric',
});

function make(kind: TwinKind, seed: number): NumericQuestion {
  const r = rng(seed);
  const id = `TW-${kind}-${seed}`;
  switch (kind) {
    case 'parallelogram-area': {
      const t = pick(r, [4, 5, 6, 7, 8, 9]);
      const a = pick(r, [8, 9, 10, 12, 14, 15]);
      const b = t + pick(r, [1, 2, 3]);
      return {
        ...base(id, 'parallelogram', 'area'),
        stem: `Jajargenjang memiliki alas ${a} cm, sisi miring ${b} cm, dan tinggi ${t} cm. Berapa luasnya?`,
        figure: { shape: 'parallelogram', annotations: [{ at: 'AB', text: `${a} cm` }, { at: 'BC', text: `${b} cm` }, { at: 'height', text: `${t} cm` }] },
        answer: a * t,
        unit: 'cm²',
        wrongAnswers: [
          { value: a * b, feedback: `Kamu memakai sisi miring ${b} cm. Tinggi harus tegak lurus alas, yaitu ${t} cm.`, misconception: 'M01' },
          { value: (a * t) / 2, feedback: 'Luas jajargenjang tidak dikali ½.', misconception: 'M03' },
          { value: 2 * (a + b), feedback: 'Itu keliling. Yang ditanya luas.', misconception: 'M02' },
        ],
        hints: ['Mana yang tinggi: garis yang tegak lurus alas.', 'L = a × t', `L = ${a} × ${t}.`],
        solutionSteps: [`Tinggi = ${t} cm (tegak lurus alas), bukan sisi miring ${b} cm.`, `L = a × t = ${a} × ${t} = ${a * t} cm².`],
      };
    }
    case 'rectangle-area':
    case 'rectangle-perimeter': {
      const p = pick(r, [7, 8, 9, 11, 12, 14, 15]);
      const l = pick(r, [3, 4, 5, 6]);
      const area = kind === 'rectangle-area';
      return {
        ...base(id, 'rectangle', area ? 'area' : 'perimeter'),
        stem: `Persegi panjang berukuran ${p} cm × ${l} cm. Berapa ${area ? 'luasnya' : 'kelilingnya'}?`,
        figure: { shape: 'rectangle', highlight: [area ? 'area' : 'perimeter'], annotations: [{ at: 'AB', text: `${p} cm` }, { at: 'BC', text: `${l} cm` }] },
        answer: area ? p * l : 2 * (p + l),
        unit: area ? 'cm²' : 'cm',
        wrongAnswers: area
          ? [{ value: 2 * (p + l), feedback: 'Itu keliling (pinggiran). Yang ditanya luas (isi).', misconception: 'M02' }]
          : [
              { value: p * l, feedback: 'Itu luas (isi). Yang ditanya keliling (pinggiran).', misconception: 'M02' },
              { value: p + l, feedback: 'Itu baru setengah keliling. Ada 2 panjang dan 2 lebar.' },
            ],
        hints: area ? ['Luas = isi daerah.', 'L = p × l', `L = ${p} × ${l}.`] : ['Keliling = panjang pinggiran.', 'K = 2 × (p + l)', `K = 2 × (${p} + ${l}).`],
        solutionSteps: area ? [`L = p × l = ${p} × ${l} = ${p * l} cm².`] : [`K = 2 × (${p} + ${l}) = 2 × ${p + l} = ${2 * (p + l)} cm.`],
      };
    }
    case 'square-area': {
      const s = pick(r, [5, 6, 7, 8, 9, 11, 12]);
      return {
        ...base(id, 'square', 'area'),
        stem: `Sebuah persegi memiliki panjang sisi ${s} cm. Berapa luasnya?`,
        figure: { shape: 'square', highlight: ['area'], annotations: [{ at: 'AB', text: `${s} cm` }] },
        answer: s * s,
        unit: 'cm²',
        wrongAnswers: [
          { value: 4 * s, feedback: 'Itu keliling (4 × s). Yang ditanya luas.', misconception: 'M02' },
          { value: 2 * s, feedback: 's² artinya s × s, bukan s × 2.' },
        ],
        hints: ['L = s × s.', `L = ${s} × ${s}.`, 'Kalikan sisi dengan dirinya sendiri.'],
        solutionSteps: [`L = s × s = ${s} × ${s} = ${s * s} cm².`],
      };
    }
    case 'rhombus-area':
    case 'kite-area': {
      const d1 = pick(r, [6, 8, 10, 12, 14, 16]);
      const d2 = pick(r, [5, 7, 9, 10, 12, 15]);
      const shape: ShapeId = kind === 'rhombus-area' ? 'rhombus' : 'kite';
      const name = shape === 'rhombus' ? 'Belah ketupat' : 'Layang-layang';
      return {
        ...base(id, shape, 'area'),
        stem: `${name} memiliki diagonal ${d1} cm dan ${d2} cm. Berapa luasnya?`,
        figure: { shape, layers: ['diagonals'], annotations: [{ at: 'AC', text: `${Math.max(d1, d2)} cm` }, { at: 'BD', text: `${Math.min(d1, d2)} cm` }] },
        answer: (d1 * d2) / 2,
        unit: 'cm²',
        wrongAnswers: [{ value: d1 * d2, feedback: 'Kamu lupa mengalikan ½. Bangun ini hanya mengisi setengah persegi panjang pembingkainya.', misconception: 'M03' }],
        hints: ['Gunakan kedua diagonal.', 'L = ½ × d₁ × d₂', `${d1} × ${d2} = ${d1 * d2}, lalu dikali ½.`],
        solutionSteps: [`L = ½ × ${d1} × ${d2} = ½ × ${d1 * d2} = ${f((d1 * d2) / 2)} cm².`],
      };
    }
    case 'trapezoid-area': {
      const t = pick(r, [4, 6, 8, 10]);
      const a = pick(r, [10, 12, 14, 16]);
      const b = pick(r, [5, 6, 7, 8]);
      return {
        ...base(id, 'trapezoid', 'area'),
        stem: `Trapesium memiliki sisi sejajar ${a} cm dan ${b} cm serta tinggi ${t} cm. Berapa luasnya?`,
        figure: { shape: 'trapezoid', annotations: [{ at: 'AB', text: `${a} cm` }, { at: 'CD', text: `${b} cm` }, { at: 'height', text: `${t} cm` }] },
        answer: ((a + b) * t) / 2,
        unit: 'cm²',
        wrongAnswers: [
          { value: (a + b) * t, feedback: 'Kamu lupa mengalikan ½.', misconception: 'M03' },
          { value: a * b * t, feedback: 'Sisi sejajar dijumlahkan, bukan dikalikan: (a + b).' },
        ],
        hints: ['Jumlahkan kedua sisi sejajar.', 'L = ½ × (a + b) × t', `½ × ${a + b} × ${t}.`],
        solutionSteps: [`a + b = ${a} + ${b} = ${a + b} cm.`, `L = ½ × ${a + b} × ${t} = ${f(((a + b) * t) / 2)} cm².`],
      };
    }
  }
}

/** Which template mirrors a given question (same shape & concept), if any. */
function kindFor(q: Question): TwinKind | null {
  if (q.type !== 'numeric') return null;
  if (q.concept === 'area' || q.concept === 'word-problem') {
    if (q.shape === 'parallelogram') return 'parallelogram-area';
    if (q.shape === 'rectangle') return 'rectangle-area';
    if (q.shape === 'square') return 'square-area';
    if (q.shape === 'rhombus') return 'rhombus-area';
    if (q.shape === 'kite') return 'kite-area';
    if (q.shape === 'trapezoid') return 'trapezoid-area';
  }
  if (q.concept === 'perimeter' && q.shape === 'rectangle') return 'rectangle-perimeter';
  return null;
}

/** A twin of question `q` (or null when no template fits). */
export function makeTwin(q: Question, seed: number): NumericQuestion | null {
  const kind = kindFor(q);
  return kind ? make(kind, seed) : null;
}

/** A practice question aimed at a misconception (or null when no template fits). */
export function twinForMisconception(m: MisconceptionId, seed: number): NumericQuestion | null {
  const kinds: Partial<Record<MisconceptionId, TwinKind[]>> = {
    M01: ['parallelogram-area'],
    M02: ['rectangle-perimeter', 'rectangle-area', 'square-area'],
    M03: ['rhombus-area', 'kite-area', 'trapezoid-area'],
  };
  const options = kinds[m];
  return options ? make(options[seed % options.length], seed) : null;
}
