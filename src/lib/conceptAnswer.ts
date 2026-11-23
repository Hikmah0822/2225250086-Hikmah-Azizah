/**
 * Offline answers to general questions about segiempat for the floating Beru assistant.
 * Answers come ONLY from the app's validated content (SHAPES, PROPERTY_ROWS), so they are
 * always correct. Each answer is short (extraneous load), ends with one question that makes
 * the student think (RMT mediation), and links to the lesson where the idea is shown.
 * Unknown questions return null; the UI then suggests what Beru can answer.
 */
import { SHAPES } from '../content/shapes';
import { ASPECT_LABELS, PROPERTY_ROWS, differingRows } from '../content/properties';
import type { Formula, PropertyRow, ShapeId } from '../types';
import type { RmtStageId } from './tutorPedagogy';

export interface ConceptAnswer {
  text: string;
  stage: RmtStageId;
  link?: { label: string; to: string };
}

/** Longest names first so "persegi panjang" is not read as "persegi". */
const ALIASES: [RegExp, ShapeId][] = [
  [/persegi\s*panjang/, 'rectangle'],
  [/jajar\s*genjang/, 'parallelogram'],
  [/belah\s*ketupat/, 'rhombus'],
  [/layang[\s-]*layang|layangan/, 'kite'],
  [/trapesium/, 'trapezoid'],
  [/persegi/, 'square'],
];

/** Shapes mentioned in the text, in the order they appear. */
export function detectShapes(text: string): ShapeId[] {
  let rest = text.toLowerCase();
  const found: { id: ShapeId; at: number }[] = [];
  for (const [re, id] of ALIASES) {
    const m = rest.match(re);
    if (m && m.index !== undefined) {
      found.push({ id, at: m.index });
      rest = rest.slice(0, m.index) + ' '.repeat(m[0].length) + rest.slice(m.index + m[0].length);
    }
  }
  return found.sort((a, b) => a.at - b.at).map((f) => f.id);
}

export const formulaText = (f: Formula): string => f.tokens.map((t) => t.text).join('');

const cell = (v: PropertyRow['values'][ShapeId]): string => (v === true ? 'ya' : v === false ? 'tidak' : v);
const lesson = (id: ShapeId) => ({ label: `Buka materi ${SHAPES[id].name}`, to: `/belajar/${id}` });

const ASPECTS: [RegExp, PropertyRow['aspect']][] = [
  [/diagonal/, 'diagonal'],
  [/simetri/, 'simetri'],
  [/sudut/, 'sudut'],
  [/sisi/, 'sisi'],
];

export function answerConcept(question: string): ConceptAnswer | null {
  const q = question.toLowerCase();
  const shapes = detectShapes(q);
  const wantsArea = /\bluas\b/.test(q);
  const wantsPerimeter = /keliling/.test(q);

  // Keliling vs luas (the most common confusion, M02).
  if (wantsArea && wantsPerimeter && shapes.length === 0) {
    return {
      stage: 'orientasi',
      text: 'Keliling = panjang PINGGIRAN bangun (satuan cm). Luas = besar DAERAH di dalamnya (satuan cm²). Pagar memakai keliling, karpet memakai luas. Kalau mengecat dinding, kamu menghitung keliling atau luas? Mengapa?',
      link: { label: 'Buka materi Persegi Panjang', to: '/belajar/rectangle' },
    };
  }

  // Comparing two shapes: only the properties that differ (RMT: membandingkan).
  if (shapes.length >= 2) {
    const [a, b] = shapes;
    const rows = differingRows(a, b).slice(0, 3);
    const lines = rows.map((r) => `• ${r.label}: ${SHAPES[a].name} ${cell(r.values[a])}, ${SHAPES[b].name} ${cell(r.values[b])}.`);
    return {
      stage: 'rencana',
      text: `Bandingkan dengan satu ciri pada satu waktu.\n${lines.join('\n')}\nCiri mana yang paling mudah kamu lihat pada gambar?`,
      link: { label: 'Buka Bandingkan', to: '/bandingkan' },
    };
  }

  const id = shapes[0];
  if (id) {
    const s = SHAPES[id];
    if (wantsArea || wantsPerimeter || /rumus/.test(q)) {
      const parts = [wantsPerimeter || !wantsArea ? `Keliling: ${formulaText(s.perimeter)}` : '', wantsArea || !wantsPerimeter ? `Luas: ${formulaText(s.area)}` : ''].filter(Boolean);
      return {
        stage: 'rencana',
        text: `Rumus ${s.name}:\n${parts.join('\n')}\nCoba tunjuk di gambar: huruf-huruf itu mewakili ukuran yang mana?`,
        link: lesson(id),
      };
    }
    const aspect = ASPECTS.find(([re]) => re.test(q))?.[1];
    if (aspect) {
      const rows = PROPERTY_ROWS.filter((r) => r.aspect === aspect && r.values[id] !== false).slice(0, 4);
      const lines = rows.map((r) => `• ${r.label}${r.values[id] === true ? '' : `: ${r.values[id]}`}`);
      return {
        stage: 'orientasi',
        text: `${ASPECT_LABELS[aspect]} ${s.name}:\n${lines.join('\n')}\nApa yang tetap sama jika ${s.name.toLowerCase()} digeser di Lab?`,
        link: { label: 'Coba di Lab', to: `/lab?shape=${s.labShape}` },
      };
    }
    return {
      stage: 'orientasi',
      text: `${s.name}: ${s.tagline.toLowerCase()}.\n${s.keyPoints.slice(0, 3).map((k) => `• ${k}`).join('\n')}\nBenda apa di sekitarmu yang berbentuk ${s.name.toLowerCase()}?`,
      link: lesson(id),
    };
  }

  if (/segi\s*empat/.test(q)) {
    return {
      stage: 'orientasi',
      text: `Segiempat adalah bangun datar dengan 4 sisi dan 4 sudut; jumlah sudutnya selalu 360°. Ada 6 yang kita pelajari: ${Object.values(SHAPES)
        .map((x) => x.name.toLowerCase())
        .join(', ')}. Mana yang menurutmu paling mirip satu sama lain?`,
      link: { label: 'Buka Bandingkan', to: '/bandingkan' },
    };
  }

  return null;
}

export const QUICK_CONCEPT_QUESTIONS = ['Apa itu jajargenjang?', 'Beda keliling dan luas?', 'Rumus luas trapesium?', 'Beda belah ketupat dan layang-layang?'];

export const NOT_UNDERSTOOD =
  'Aku belum mengerti pertanyaan itu. Coba tanya tentang nama bangun, sifatnya (sisi, sudut, diagonal, simetri), atau rumus keliling dan luas. Contoh: "Diagonal belah ketupat?"';
