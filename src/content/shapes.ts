/**
 * Lesson content per shape (F01, F05, F08).
 * Rule: card body ≤ 40 words, one concept per card (CLAUDE.md §5).
 */
import type { Formula, LabShapeId, LessonCard, ShapeId } from '../types';

export interface ShapeInfo {
  id: ShapeId;
  name: string;
  labShape: LabShapeId;
  tagline: string;
  perimeter: Formula;
  area: Formula;
  /** Short key points for "Catatanku" (F08). */
  keyPoints: string[];
  cards: LessonCard[];
}

const K = (...tokens: Formula['tokens']): Formula => ({ label: 'Keliling', tokens: [{ text: 'K', highlight: 'perimeter' }, { text: ' = ' }, ...tokens] });
const L = (...tokens: Formula['tokens']): Formula => ({ label: 'Luas', tokens: [{ text: 'L', highlight: 'area' }, { text: ' = ' }, ...tokens] });

export const SHAPES: Record<ShapeId, ShapeInfo> = {
  rectangle: {
    id: 'rectangle',
    name: 'Persegi Panjang',
    labShape: 'rectangle',
    tagline: 'Semua sudutnya siku-siku',
    perimeter: K({ text: '2 × (' }, { text: 'p', highlight: 'AB' }, { text: ' + ' }, { text: 'l', highlight: 'BC' }, { text: ')' }),
    area: L({ text: 'p', highlight: 'AB' }, { text: ' × ' }, { text: 'l', highlight: 'BC' }),
    keyPoints: ['Sisi berhadapan sama panjang dan sejajar', 'Keempat sudut 90°', 'Diagonal sama panjang dan saling membagi dua', '2 simetri lipat, simetri putar tingkat 2'],
    cards: [
      { id: 'rect-intro', title: 'Kenalan dulu', body: 'Persegi panjang ada di mana-mana: pintu, papan tulis, layar HP. Bangun ini punya 4 sisi dan 4 sudut siku-siku.', figure: { shape: 'rectangle' } },
      { id: 'rect-sides', title: 'Sisi', body: 'Sisi yang berhadapan sama panjang (AB = DC, AD = BC) dan sejajar. Lihat tanda garis kecil dan panah pada gambar.', figure: { shape: 'rectangle', layers: ['sides'] }, lab: { shape: 'rectangle', layers: ['sides'] } },
      { id: 'rect-angles', title: 'Sudut', body: 'Keempat sudutnya siku-siku, masing-masing 90°. Tanda kotak kecil di pojok berarti sudut siku-siku.', figure: { shape: 'rectangle', layers: ['angles'] }, lab: { shape: 'rectangle', layers: ['angles'] } },
      { id: 'rect-diag', title: 'Diagonal', body: 'Kedua diagonal sama panjang dan saling membagi dua sama panjang. Tetapi diagonalnya tidak tegak lurus.', figure: { shape: 'rectangle', layers: ['diagonals'] }, lab: { shape: 'rectangle', layers: ['diagonals'] } },
      { id: 'rect-sym', title: 'Simetri', body: 'Ada 2 sumbu simetri lipat (garis tengah mendatar dan tegak). Diagonal bukan sumbu simetri. Simetri putarnya tingkat 2.', figure: { shape: 'rectangle', layers: ['symmetry'] }, lab: { shape: 'rectangle', layers: ['symmetry'] } },
      { id: 'rect-formula', title: 'Keliling dan Luas', body: 'Ketuk huruf pada rumus untuk melihat bagiannya di gambar. Keliling = pinggiran (oranye). Luas = isi daerah (biru).', figure: { shape: 'rectangle', annotations: [{ at: 'AB', text: 'p' }, { at: 'BC', text: 'l' }] } },
    ],
  },
  square: {
    id: 'square',
    name: 'Persegi',
    labShape: 'square',
    tagline: 'Sisi sama, sudut siku-siku',
    perimeter: K({ text: '4 × ' }, { text: 's', highlight: 'AB' }),
    area: L({ text: 's', highlight: 'AB' }, { text: ' × ' }, { text: 's', highlight: 'BC' }),
    keyPoints: ['Keempat sisi sama panjang', 'Keempat sudut 90°', 'Diagonal sama panjang, tegak lurus, saling membagi dua', '4 simetri lipat, simetri putar tingkat 4'],
    cards: [
      { id: 'sq-intro', title: 'Kenalan dulu', body: 'Persegi adalah persegi panjang yang keempat sisinya sama panjang. Jadi, setiap persegi juga merupakan persegi panjang.', figure: { shape: 'square' } },
      { id: 'sq-sides', title: 'Sisi', body: 'Keempat sisi sama panjang. Sisi yang berhadapan sejajar.', figure: { shape: 'square', layers: ['sides'] }, lab: { shape: 'square', layers: ['sides'] } },
      { id: 'sq-angles', title: 'Sudut', body: 'Keempat sudutnya siku-siku (90°), sama seperti persegi panjang.', figure: { shape: 'square', layers: ['angles'] }, lab: { shape: 'square', layers: ['angles'] } },
      { id: 'sq-diag', title: 'Diagonal', body: 'Diagonal persegi memenuhi tiga sifat sekaligus: sama panjang, saling tegak lurus, dan saling membagi dua sama panjang.', figure: { shape: 'square', layers: ['diagonals'] }, lab: { shape: 'square', layers: ['diagonals'] } },
      { id: 'sq-sym', title: 'Simetri', body: 'Persegi punya 4 sumbu simetri lipat: 2 garis tengah dan 2 diagonal. Simetri putarnya tingkat 4.', figure: { shape: 'square', layers: ['symmetry'] }, lab: { shape: 'square', layers: ['symmetry'] } },
      { id: 'sq-formula', title: 'Keliling dan Luas', body: 'Semua sisi sama, jadi cukup satu ukuran: s. Ketuk huruf pada rumus untuk melihatnya di gambar.', figure: { shape: 'square', annotations: [{ at: 'AB', text: 's' }] } },
    ],
  },
  parallelogram: {
    id: 'parallelogram',
    name: 'Jajargenjang',
    labShape: 'parallelogram',
    tagline: 'Dua pasang sisi sejajar',
    perimeter: K({ text: '2 × (' }, { text: 'a', highlight: 'AB' }, { text: ' + ' }, { text: 'b', highlight: 'BC' }, { text: ')' }),
    area: L({ text: 'a', highlight: 'AB' }, { text: ' × ' }, { text: 't', highlight: 'height' }),
    keyPoints: ['Sisi berhadapan sama panjang dan sejajar', 'Sudut berhadapan sama besar', 'Sudut berdekatan berjumlah 180°', 'Diagonal saling membagi dua sama panjang', 'Tidak punya simetri lipat; simetri putar tingkat 2'],
    cards: [
      { id: 'par-intro', title: 'Kenalan dulu', body: 'Bayangkan persegi panjang yang didorong miring. Bentuk itu adalah jajargenjang.', figure: { shape: 'parallelogram' } },
      { id: 'par-sides', title: 'Sisi', body: 'Sisi yang berhadapan sama panjang dan sejajar: AB ∥ DC dan AD ∥ BC.', figure: { shape: 'parallelogram', layers: ['sides'] }, lab: { shape: 'parallelogram', layers: ['sides'] } },
      { id: 'par-angles', title: 'Sudut', body: 'Sudut berhadapan sama besar (∠A = ∠C). Dua sudut berdekatan selalu berjumlah 180°, misalnya ∠A + ∠B = 180°.', figure: { shape: 'parallelogram', layers: ['angles'], selectedAngle: 0 }, lab: { shape: 'parallelogram', layers: ['angles'] } },
      { id: 'par-diag', title: 'Diagonal', body: 'Diagonal saling membagi dua sama panjang. Diagonalnya tidak sama panjang dan tidak tegak lurus.', figure: { shape: 'parallelogram', layers: ['diagonals'] }, lab: { shape: 'parallelogram', layers: ['diagonals'] } },
      { id: 'par-sym', title: 'Simetri', body: 'Jajargenjang tidak punya simetri lipat. Lipatan di diagonal tidak berimpit! Simetri putarnya tingkat 2.', figure: { shape: 'parallelogram', layers: ['symmetry'] }, lab: { shape: 'parallelogram', layers: ['symmetry'] } },
      { id: 'par-formula', title: 'Keliling dan Luas', body: 'Luas memakai tinggi t, yaitu garis yang tegak lurus alas, bukan sisi miring. Ketuk t untuk melihatnya.', figure: { shape: 'parallelogram', highlight: ['height'], annotations: [{ at: 'AB', text: 'a' }, { at: 'BC', text: 'b' }, { at: 'height', text: 't' }] } },
    ],
  },
  rhombus: {
    id: 'rhombus',
    name: 'Belah Ketupat',
    labShape: 'rhombus',
    tagline: 'Empat sisi sama panjang',
    perimeter: K({ text: '4 × ' }, { text: 's', highlight: 'AB' }),
    area: L({ text: '½ × ' }, { text: 'd₁', highlight: 'AC' }, { text: ' × ' }, { text: 'd₂', highlight: 'BD' }),
    keyPoints: ['Keempat sisi sama panjang; sisi berhadapan sejajar', 'Sudut berhadapan sama besar', 'Diagonal tegak lurus dan saling membagi dua', '2 simetri lipat (pada diagonal), simetri putar tingkat 2'],
    cards: [
      { id: 'rh-intro', title: 'Kenalan dulu', body: 'Belah ketupat adalah jajargenjang yang keempat sisinya sama panjang. Bentuknya seperti ketupat.', figure: { shape: 'rhombus' } },
      { id: 'rh-sides', title: 'Sisi', body: 'Keempat sisi sama panjang. Sisi yang berhadapan sejajar, sama seperti jajargenjang.', figure: { shape: 'rhombus', layers: ['sides'] }, lab: { shape: 'rhombus', layers: ['sides'] } },
      { id: 'rh-angles', title: 'Sudut', body: 'Sudut yang berhadapan sama besar. Sudut berdekatan berjumlah 180°.', figure: { shape: 'rhombus', layers: ['angles'], selectedAngle: 0 }, lab: { shape: 'rhombus', layers: ['angles'] } },
      { id: 'rh-diag', title: 'Diagonal', body: 'Kedua diagonal saling tegak lurus dan saling membagi dua sama panjang. Ingat: keduanya terbagi dua, bukan hanya satu seperti layang-layang.', figure: { shape: 'rhombus', layers: ['diagonals'] }, lab: { shape: 'rhombus', layers: ['diagonals'] } },
      { id: 'rh-sym', title: 'Simetri', body: 'Ada 2 sumbu simetri lipat, yaitu kedua diagonalnya. Simetri putarnya tingkat 2. Bandingkan dengan jajargenjang yang tidak punya simetri lipat.', figure: { shape: 'rhombus', layers: ['symmetry'] }, lab: { shape: 'rhombus', layers: ['symmetry'] } },
      { id: 'rh-formula', title: 'Keliling dan Luas', body: 'Luas belah ketupat = setengah persegi panjang yang dibentuk kedua diagonalnya. Ketuk d₁ dan d₂.', figure: { shape: 'rhombus', annotations: [{ at: 'AC', text: 'd₁' }, { at: 'BD', text: 'd₂' }] } },
    ],
  },
  kite: {
    id: 'kite',
    name: 'Layang-layang',
    labShape: 'kite',
    tagline: 'Dua pasang sisi berdekatan sama',
    perimeter: K({ text: '2 × (' }, { text: 'a', highlight: 'AB' }, { text: ' + ' }, { text: 'b', highlight: 'BC' }, { text: ')' }),
    area: L({ text: '½ × ' }, { text: 'd₁', highlight: 'AC' }, { text: ' × ' }, { text: 'd₂', highlight: 'BD' }),
    keyPoints: ['Dua pasang sisi berdekatan sama panjang', 'Sepasang sudut berhadapan sama besar', 'Diagonal tegak lurus; hanya satu diagonal terbagi dua', '1 simetri lipat, tidak punya simetri putar'],
    cards: [
      { id: 'kite-intro', title: 'Kenalan dulu', body: 'Layang-layang mirip mainan layangan: dua segitiga sama kaki yang alasnya ditempel.', figure: { shape: 'kite' } },
      { id: 'kite-sides', title: 'Sisi', body: 'Ada dua pasang sisi berdekatan yang sama panjang: AB = AD dan CB = CD. Tidak ada sisi yang sejajar.', figure: { shape: 'kite', layers: ['sides'] }, lab: { shape: 'kite', layers: ['sides'] } },
      { id: 'kite-angles', title: 'Sudut', body: 'Hanya sepasang sudut berhadapan yang sama besar: ∠B = ∠D. Sudut ini diapit sisi yang tidak sama panjang.', figure: { shape: 'kite', layers: ['angles'] }, lab: { shape: 'kite', layers: ['angles'] } },
      { id: 'kite-diag', title: 'Diagonal', body: 'Diagonal saling tegak lurus, seperti belah ketupat. Bedanya, hanya BD yang dibagi dua sama panjang oleh AC.', figure: { shape: 'kite', layers: ['diagonals'] }, lab: { shape: 'kite', layers: ['diagonals'] } },
      { id: 'kite-sym', title: 'Simetri', body: 'Hanya 1 sumbu simetri lipat, yaitu diagonal AC. Layang-layang tidak memiliki simetri putar.', figure: { shape: 'kite', layers: ['symmetry'] }, lab: { shape: 'kite', layers: ['symmetry'] } },
      { id: 'kite-formula', title: 'Keliling dan Luas', body: 'Rumus luasnya sama dengan belah ketupat: setengah kali kedua diagonal. Ketuk huruf pada rumus.', figure: { shape: 'kite', annotations: [{ at: 'AC', text: 'd₁' }, { at: 'BD', text: 'd₂' }] } },
    ],
  },
  trapezoid: {
    id: 'trapezoid',
    name: 'Trapesium',
    labShape: 'trapezoid',
    tagline: 'Tepat sepasang sisi sejajar',
    perimeter: K({ text: 'AB + BC + CD + DA', highlight: 'perimeter' }),
    area: L({ text: '½ × (' }, { text: 'a', highlight: 'AB' }, { text: ' + ' }, { text: 'b', highlight: 'CD' }, { text: ') × ' }, { text: 't', highlight: 'height' }),
    keyPoints: ['Tepat sepasang sisi sejajar', 'Sudut di antara sisi sejajar berjumlah 180°', 'Jenis: sembarang, sama kaki, siku-siku', 'Trapesium sama kaki: diagonal sama panjang, 1 simetri lipat'],
    cards: [
      { id: 'trap-intro', title: 'Kenalan dulu', body: 'Trapesium punya tepat sepasang sisi sejajar. Ada tiga jenis: sembarang, sama kaki, dan siku-siku.', figure: { shape: 'trapezoid' } },
      { id: 'trap-sides', title: 'Sisi', body: 'Sisi AB sejajar DC. Sisi AD dan BC disebut kaki. Pada trapesium sama kaki, kedua kakinya sama panjang.', figure: { shape: 'trapezoid-isosceles', layers: ['sides'] }, lab: { shape: 'trapezoid-isosceles', layers: ['sides'] } },
      { id: 'trap-angles', title: 'Sudut', body: 'Dua sudut di antara sisi sejajar berjumlah 180°: ∠A + ∠D = 180° dan ∠B + ∠C = 180°. Tetapi ∠A + ∠B tidak harus 180°.', figure: { shape: 'trapezoid', layers: ['angles'], selectedAngle: 0 }, lab: { shape: 'trapezoid', layers: ['angles'] } },
      { id: 'trap-right', title: 'Trapesium siku-siku', body: 'Trapesium siku-siku punya dua sudut siku-siku di salah satu kakinya.', figure: { shape: 'trapezoid-right', layers: ['angles'] }, lab: { shape: 'trapezoid-right', layers: ['angles'] } },
      { id: 'trap-diag', title: 'Diagonal dan Simetri', body: 'Trapesium sama kaki: diagonal sama panjang dan ada 1 simetri lipat. Trapesium lain tidak memiliki keduanya.', figure: { shape: 'trapezoid-isosceles', layers: ['diagonals', 'symmetry'] }, lab: { shape: 'trapezoid-isosceles', layers: ['diagonals', 'symmetry'] } },
      { id: 'trap-formula', title: 'Keliling dan Luas', body: 'Luas = setengah × jumlah sisi sejajar × tinggi. Tinggi adalah jarak antara kedua sisi sejajar.', figure: { shape: 'trapezoid', highlight: ['height'], annotations: [{ at: 'AB', text: 'a' }, { at: 'CD', text: 'b' }, { at: 'height', text: 't' }] } },
    ],
  },
};

/** Pre-training cards (prerequisites, IL03). */
export const PREP_CARDS: LessonCard[] = [
  { id: 'prep-parallel', title: 'Garis sejajar', body: 'Dua garis sejajar tidak pernah berpotongan walau diperpanjang. Di gambar, sisi sejajar ditandai panah kecil dengan jumlah yang sama.', figure: { shape: 'parallelogram', layers: ['sides'] } },
  { id: 'prep-perp', title: 'Tegak lurus', body: 'Dua garis tegak lurus membentuk sudut 90°. Tandanya kotak kecil di pojok sudut.', figure: { shape: 'rectangle', layers: ['angles'] } },
  { id: 'prep-diagonal', title: 'Diagonal', body: 'Diagonal adalah ruas garis yang menghubungkan dua titik sudut yang tidak bersebelahan. Setiap segiempat punya 2 diagonal: AC dan BD.', figure: { shape: 'free', layers: ['diagonals'] } },
  { id: 'prep-height', title: 'Tinggi', body: 'Tinggi adalah jarak tegak lurus dari alas ke sisi di seberangnya. Tinggi selalu membentuk 90° dengan alas, jadi tinggi bukan sisi miring.', figure: { shape: 'parallelogram', highlight: ['height'], annotations: [{ at: 'height', text: 't' }, { at: 'AB', text: 'alas' }] } },
  { id: 'prep-180', title: 'Sudut berdekatan 180°', body: 'Jika dua garis sejajar dipotong garis lain, dua sudut dalam yang sepihak berjumlah 180°. Ketuk sebuah sudut di Lab untuk mencobanya.', figure: { shape: 'parallelogram', layers: ['angles'], selectedAngle: 0 }, lab: { shape: 'parallelogram', layers: ['angles'] } },
  { id: 'prep-k-l', title: 'Keliling vs Luas', body: 'Keliling = panjang pinggiran (garis oranye), satuannya cm. Luas = isi daerah (warna biru), satuannya cm².', figure: { shape: 'rectangle', highlight: ['perimeter', 'area'] } },
];

/** A cheerful accent colour per shape (UI only; geometry marks keep their fixed colours). */
export const SHAPE_THEME: Record<ShapeId, { hex: string; tint: string; text: string }> = {
  rectangle: { hex: '#0ea5e9', tint: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300' },
  square: { hex: '#8b5cf6', tint: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-300' },
  parallelogram: { hex: '#10b981', tint: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300' },
  rhombus: { hex: '#ec4899', tint: 'bg-pink-50 dark:bg-pink-950/40', text: 'text-pink-700 dark:text-pink-300' },
  kite: { hex: '#f59e0b', tint: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300' },
  trapezoid: { hex: '#f97316', tint: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300' },
};

export const SHAPE_ORDER: ShapeId[] =['rectangle', 'square', 'parallelogram', 'rhombus', 'kite', 'trapezoid'];

export const LAB_SHAPE_NAMES: Record<LabShapeId, string> = {
  square: 'Persegi',
  rectangle: 'Persegi Panjang',
  parallelogram: 'Jajargenjang',
  rhombus: 'Belah Ketupat',
  kite: 'Layang-layang',
  trapezoid: 'Trapesium',
  'trapezoid-isosceles': 'Trapesium Sama Kaki',
  'trapezoid-right': 'Trapesium Siku-siku',
  free: 'Bebas',
};
