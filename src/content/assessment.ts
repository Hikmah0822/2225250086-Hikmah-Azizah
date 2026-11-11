/**
 * Research instruments (F11, docs/08-rencana-evaluasi.md).
 *
 * - Pretes & postes: parallel forms, 10 items each, same objective per item number (TP1–TP6).
 *   No feedback is shown during the test.
 * - Angket beban kognitif: 10 items after Leppink et al. (2013) — IL (1–3), EL (4–6), GL (7–10),
 *   scale 0–10, plus one mental-effort item after Paas (1992), scale 1–9.
 *
 * ⚠ PERLU DIVALIDASI: soal (ahli materi) dan terjemahan angket (validasi bahasa/konstruk)
 *   sebelum dipakai untuk pengambilan data penelitian.
 */
import type { FigureSpec } from '../types';

export interface TestItem {
  id: string;
  objective: 'TP1' | 'TP2' | 'TP3' | 'TP4' | 'TP5' | 'TP6';
  type: 'multiple-choice' | 'numeric';
  stem: string;
  figure?: FigureSpec;
  options?: { id: string; text: string }[];
  answer: string | number;
  unit?: string;
  prefix?: 'Rp';
}

const mc = (id: string, objective: TestItem['objective'], stem: string, options: string[], correctIndex: number, figure?: FigureSpec): TestItem => ({
  id,
  objective,
  type: 'multiple-choice',
  stem,
  figure,
  options: options.map((text, i) => ({ id: 'abcd'[i], text })),
  answer: 'abcd'[correctIndex],
});

const num = (id: string, objective: TestItem['objective'], stem: string, answer: number, unit?: string, figure?: FigureSpec, prefix?: 'Rp'): TestItem => ({
  id,
  objective,
  type: 'numeric',
  stem,
  answer,
  unit,
  figure,
  prefix,
});

export const PRETEST: TestItem[] = [
  mc('pre-1', 'TP1', 'Bangun yang keempat sisinya sama panjang dan keempat sudutnya siku-siku adalah …', ['Persegi panjang', 'Persegi', 'Belah ketupat', 'Jajargenjang'], 1),
  mc('pre-2', 'TP1', 'Diagonal belah ketupat selalu …', ['sama panjang', 'saling tegak lurus', 'tidak berpotongan', 'sejajar'], 1),
  mc('pre-3', 'TP1', 'Banyak simetri lipat jajargenjang (yang bukan persegi panjang atau belah ketupat) adalah …', ['0', '1', '2', '4'], 0),
  mc('pre-4', 'TP2', 'Perbedaan belah ketupat dan layang-layang yang tepat adalah …', [
    'Belah ketupat: kedua diagonal saling membagi dua sama panjang; layang-layang: hanya satu diagonal yang terbagi dua',
    'Diagonal belah ketupat tegak lurus, diagonal layang-layang tidak',
    'Layang-layang memiliki dua pasang sisi sejajar',
    'Belah ketupat tidak memiliki simetri lipat',
  ], 0),
  mc('pre-5', 'TP3', 'Diagonal sebuah segiempat saling membagi dua sama panjang, sama panjang, dan saling tegak lurus. Bangun itu adalah …', ['Persegi panjang', 'Belah ketupat', 'Persegi', 'Layang-layang'], 2),
  num('pre-6', 'TP4', 'Pada jajargenjang ABCD, besar ∠A = 72°. Besar ∠B adalah …', 108, '°'),
  num('pre-7', 'TP5', 'Jajargenjang memiliki alas 14 cm, sisi miring 9 cm, dan tinggi 7 cm. Luasnya adalah …', 98, 'cm²', { shape: 'parallelogram', annotations: [{ at: 'AB', text: '14 cm' }, { at: 'BC', text: '9 cm' }, { at: 'height', text: '7 cm' }] }),
  num('pre-8', 'TP5', 'Layang-layang memiliki diagonal 12 cm dan 18 cm. Luasnya adalah …', 108, 'cm²'),
  num('pre-9', 'TP5', 'Keliling persegi panjang yang berukuran 15 cm × 6 cm adalah …', 42, 'cm'),
  num('pre-10', 'TP6', 'Kebun berbentuk persegi panjang 12 m × 9 m akan ditanami rumput seluruhnya dengan biaya Rp15.000 per m². Berapa biaya yang diperlukan?', 1620000, undefined, undefined, 'Rp'),
];

export const POSTTEST: TestItem[] = [
  mc('post-1', 'TP1', 'Bangun yang sisi berhadapannya sama panjang, keempat sudutnya siku-siku, tetapi sisi yang berdekatan tidak sama panjang adalah …', ['Persegi', 'Persegi panjang', 'Jajargenjang', 'Trapesium'], 1),
  mc('post-2', 'TP1', 'Diagonal persegi panjang selalu …', ['saling tegak lurus', 'sama panjang', 'tidak saling membagi dua', 'sejajar'], 1),
  mc('post-3', 'TP1', 'Banyak simetri lipat belah ketupat (yang bukan persegi) adalah …', ['0', '1', '2', '4'], 2),
  mc('post-4', 'TP2', 'Perbedaan persegi panjang dan jajargenjang yang tepat adalah …', [
    'Semua sudut persegi panjang 90°, sudut jajargenjang tidak harus 90°',
    'Sisi berhadapan jajargenjang tidak sejajar',
    'Diagonal jajargenjang sama panjang',
    'Persegi panjang tidak memiliki simetri putar',
  ], 0),
  mc('post-5', 'TP3', 'Diagonal sebuah segiempat saling tegak lurus, tetapi hanya satu diagonal yang dibagi dua sama panjang oleh diagonal lainnya. Bangun itu adalah …', ['Belah ketupat', 'Persegi', 'Layang-layang', 'Persegi panjang'], 2),
  num('post-6', 'TP4', 'Pada trapesium ABCD dengan AB ∥ DC, besar ∠A = 64°. Besar ∠D adalah …', 116, '°'),
  num('post-7', 'TP5', 'Jajargenjang memiliki alas 15 cm, sisi miring 10 cm, dan tinggi 8 cm. Luasnya adalah …', 120, 'cm²', { shape: 'parallelogram', annotations: [{ at: 'AB', text: '15 cm' }, { at: 'BC', text: '10 cm' }, { at: 'height', text: '8 cm' }] }),
  num('post-8', 'TP5', 'Belah ketupat memiliki diagonal 14 cm dan 10 cm. Luasnya adalah …', 70, 'cm²'),
  num('post-9', 'TP5', 'Trapesium sama kaki memiliki sisi sejajar 12 cm dan 18 cm, serta panjang setiap kakinya 5 cm. Kelilingnya adalah …', 40, 'cm'),
  num('post-10', 'TP6', 'Kolam berbentuk trapesium dengan sisi sejajar 10 m dan 16 m, serta tinggi 6 m. Dasar kolam dilapisi terpal dengan biaya Rp10.000 per m². Berapa biaya yang diperlukan?', 780000, undefined, undefined, 'Rp'),
];

export type LoadType = 'IL' | 'EL' | 'GL';

export const CL_SCALE = { min: 0, max: 10, minLabel: 'Sama sekali tidak setuju', maxLabel: 'Sangat setuju' };

/** Indonesian translation (draft) of Leppink et al. (2013), adapted to the topic "segiempat". */
export const CL_ITEMS: { id: string; type: LoadType; text: string }[] = [
  { id: 'IL1', type: 'IL', text: 'Topik yang dibahas dalam kegiatan belajar ini sangat rumit.' },
  { id: 'IL2', type: 'IL', text: 'Kegiatan belajar ini memuat rumus yang menurut saya sangat rumit.' },
  { id: 'IL3', type: 'IL', text: 'Kegiatan belajar ini memuat konsep dan definisi yang menurut saya sangat rumit.' },
  { id: 'EL1', type: 'EL', text: 'Petunjuk dan/atau penjelasan dalam kegiatan belajar ini sangat tidak jelas.' },
  { id: 'EL2', type: 'EL', text: 'Petunjuk dan/atau penjelasan dalam kegiatan belajar ini sangat tidak efektif untuk belajar.' },
  { id: 'EL3', type: 'EL', text: 'Petunjuk dan/atau penjelasan dalam kegiatan belajar ini penuh dengan bahasa yang tidak jelas.' },
  { id: 'GL1', type: 'GL', text: 'Kegiatan belajar ini benar-benar meningkatkan pemahaman saya tentang topik yang dibahas.' },
  { id: 'GL2', type: 'GL', text: 'Kegiatan belajar ini benar-benar meningkatkan pengetahuan dan pemahaman saya tentang segiempat.' },
  { id: 'GL3', type: 'GL', text: 'Kegiatan belajar ini benar-benar meningkatkan pemahaman saya tentang rumus-rumus yang dibahas.' },
  { id: 'GL4', type: 'GL', text: 'Kegiatan belajar ini benar-benar meningkatkan pemahaman saya tentang konsep dan definisi yang dibahas.' },
];

export const PAAS_ITEM = {
  text: 'Seberapa besar usaha berpikir (usaha mental) yang kamu keluarkan selama belajar dengan aplikasi ini?',
  min: 1,
  max: 9,
  minLabel: 'Sangat-sangat rendah',
  maxLabel: 'Sangat-sangat tinggi',
};
