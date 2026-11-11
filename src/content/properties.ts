/**
 * Shape-property table — the single source of truth in code.
 * Must match docs/04-spesifikasi-konten.md §3 (validated by a subject-matter expert).
 */
import type { PropertyRow, ShapeId } from '../types';

const row = (
  id: string,
  aspect: PropertyRow['aspect'],
  label: string,
  [square, rectangle, parallelogram, rhombus, kite, trapezoid]: PropertyRow['values'][ShapeId][],
): PropertyRow => ({ id, aspect, label, values: { square, rectangle, parallelogram, rhombus, kite, trapezoid } });

//                                                                          persegi  p.panjang jajargenjang belah-k. layang  trapesium
export const PROPERTY_ROWS: PropertyRow[] = [
  row('s-all-equal', 'sisi', 'Keempat sisi sama panjang', [true, false, false, true, false, false]),
  row('s-opp-equal', 'sisi', 'Sisi berhadapan sama panjang', [true, true, true, true, false, false]),
  row('s-adj-equal', 'sisi', 'Dua pasang sisi berdekatan sama panjang', [true, false, false, true, true, false]),
  row('s-two-par', 'sisi', 'Dua pasang sisi berhadapan sejajar', [true, true, true, true, false, false]),
  row('s-one-par', 'sisi', 'Tepat sepasang sisi sejajar', [false, false, false, false, false, true]),

  row('a-360', 'sudut', 'Jumlah keempat sudut 360°', [true, true, true, true, true, true]),
  row('a-right', 'sudut', 'Keempat sudut siku-siku (90°)', [true, true, false, false, false, false]),
  row('a-opp-equal', 'sudut', 'Kedua pasang sudut berhadapan sama besar', [true, true, true, true, false, false]),
  row('a-one-opp', 'sudut', 'Sepasang sudut berhadapan sama besar', [true, true, true, true, true, false]),
  row('a-adj-180', 'sudut', 'Semua pasangan sudut berdekatan berjumlah 180°', [true, true, true, true, false, false]),
  row('a-par-180', 'sudut', 'Sudut berdekatan di antara sisi sejajar berjumlah 180°', [true, true, true, true, false, true]),

  row('d-equal', 'diagonal', 'Kedua diagonal sama panjang', [true, true, false, false, false, 'hanya sama kaki']),
  row('d-bisect', 'diagonal', 'Kedua diagonal saling membagi dua sama panjang', [true, true, true, true, false, false]),
  row('d-one-bisect', 'diagonal', 'Hanya satu diagonal dibagi dua sama panjang', [false, false, false, false, true, false]),
  row('d-perp', 'diagonal', 'Diagonal saling tegak lurus', [true, false, false, true, true, false]),
  row('d-angle-bisect', 'diagonal', 'Diagonal membagi dua sudut sama besar', ['semua', false, false, 'semua', 'satu diagonal', false]),

  row('y-fold', 'simetri', 'Banyak simetri lipat', ['4', '2', '0', '2', '1', 'sama kaki: 1, lainnya: 0']),
  row('y-rot', 'simetri', 'Tingkat simetri putar', ['4', '2', '2', '2', 'tidak ada', 'tidak ada']),
];

export const ASPECT_LABELS: Record<PropertyRow['aspect'], string> = {
  sisi: 'Sisi',
  sudut: 'Sudut',
  diagonal: 'Diagonal',
  simetri: 'Simetri',
};

/** Rows where two shapes differ (Mode Bandingkan). */
export const differingRows = (a: ShapeId, b: ShapeId): PropertyRow[] =>
  PROPERTY_ROWS.filter((r) => r.values[a] !== r.values[b]);
