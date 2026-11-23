/**
 * Rigorous Mathematical Thinking (RMT; Kinard & Kozulin, 2008) — content data.
 * - Cognitive functions (Table 4.1 of the book), simplified for SMP students.
 *   RMT asks students to NAME the thinking action they use, so every activity is tagged.
 * - Mediated Learning Experience (MLE) criteria used by the tutor and in the docs.
 * See docs/10-model-rmt.md for how each part maps to the app.
 */
import type { Concept } from '../types';

export type CognitiveFunctionId =
  | 'label'
  | 'compare'
  | 'search'
  | 'multi'
  | 'encode'
  | 'constancy'
  | 'space'
  | 'analyze'
  | 'generalize'
  | 'precise'
  | 'prior'
  | 'evidence'
  | 'define'
  | 'hypothesis'
  | 'relate';

export interface CognitiveFunction {
  id: CognitiveFunctionId;
  /** Indonesian name shown to students. */
  name: string;
  /** Name in the book (Table 4.1). */
  book: string;
  /** RMT level: 1 general/qualitative, 2 quantitative & precise, 3 mathematical-logical. */
  level: 1 | 2 | 3;
  icon: string;
  /** Short definition (≤ 25 words). */
  meaning: string;
  /** Example from segiempat. */
  example: string;
}

export const COGNITIVE_FUNCTIONS: Record<CognitiveFunctionId, CognitiveFunction> = {
  label: {
    id: 'label',
    name: 'Memberi nama & membayangkan',
    book: 'Labeling-visualizing',
    level: 1,
    icon: '🏷️',
    meaning: 'Memberi nama yang tepat berdasarkan ciri pentingnya, dan membayangkan bentuknya saat mendengar namanya.',
    example: 'Empat sisi sama panjang dan semua sudut 90° → persegi.',
  },
  compare: {
    id: 'compare',
    name: 'Membandingkan',
    book: 'Comparing',
    level: 1,
    icon: '⚖️',
    meaning: 'Memilih dulu ciri pembanding, lalu mencari persamaan dan perbedaannya.',
    example: 'Pembanding: diagonal. Belah ketupat dan layang-layang sama-sama tegak lurus, tetapi hanya belah ketupat yang saling membagi dua.',
  },
  search: {
    id: 'search',
    name: 'Mencari informasi dengan teliti',
    book: 'Searching systematically',
    level: 1,
    icon: '🔎',
    meaning: 'Mengumpulkan informasi yang jelas dan lengkap secara urut, tidak melompat-lompat.',
    example: 'Membaca soal kalimat demi kalimat dan mencatat semua ukuran.',
  },
  multi: {
    id: 'multi',
    name: 'Memakai lebih dari satu informasi',
    book: 'Using more than one source of information',
    level: 1,
    icon: '🧩',
    meaning: 'Memperhatikan dua hal atau lebih sekaligus, misalnya sisi dan sudut.',
    example: 'Persegi panjang: sisi berhadapan sama panjang DAN semua sudut 90°.',
  },
  encode: {
    id: 'encode',
    name: 'Membaca & menulis simbol',
    book: 'Encoding-decoding',
    level: 1,
    icon: '🔣',
    meaning: 'Memahami arti simbol matematika dan menuliskan ide dengan simbol.',
    example: 'AB ∥ DC artinya sisi AB sejajar sisi DC.',
  },
  constancy: {
    id: 'constancy',
    name: 'Mencari yang tetap',
    book: 'Conserving constancy',
    level: 2,
    icon: '📌',
    meaning: 'Menemukan apa yang tetap sama ketika hal lain berubah.',
    example: 'Saat titik jajargenjang digeser, sisi berhadapan selalu sejajar.',
  },
  space: {
    id: 'space',
    name: 'Mengukur ruang',
    book: 'Quantifying space and spatial relationships',
    level: 2,
    icon: '📏',
    meaning: 'Menyatakan panjang, luas, dan letak dengan satuan dan acuan yang jelas.',
    example: 'Luas diukur dengan petak 1 cm², keliling dengan panjang dalam cm.',
  },
  analyze: {
    id: 'analyze',
    name: 'Mengurai & menyatukan',
    book: 'Analyzing-integrating',
    level: 2,
    icon: '✂️',
    meaning: 'Memecah keseluruhan menjadi bagian, lalu menyusun bagian menjadi keseluruhan lagi.',
    example: 'Jajargenjang dipotong lalu digeser menjadi persegi panjang.',
  },
  generalize: {
    id: 'generalize',
    name: 'Menggeneralisasi',
    book: 'Generalizing',
    level: 2,
    icon: '🌐',
    meaning: 'Menyimpulkan aturan yang berlaku untuk semua bangun sejenis, bukan hanya satu gambar.',
    example: 'Semua jajargenjang: jumlah dua sudut berdekatan 180°.',
  },
  precise: {
    id: 'precise',
    name: 'Bekerja teliti dan tepat',
    book: 'Being precise',
    level: 2,
    icon: '🎯',
    meaning: 'Berusaha tepat dalam angka, satuan, dan istilah.',
    example: 'Menulis 96 cm² untuk luas, bukan 96 cm.',
  },
  prior: {
    id: 'prior',
    name: 'Mengingat pengetahuan lama',
    book: 'Activating prior mathematically related knowledge',
    level: 3,
    icon: '💡',
    meaning: 'Mencari pengetahuan yang sudah kamu punya dan menghubungkannya dengan soal sekarang.',
    example: 'Luas persegi panjang p × l membantu memahami luas jajargenjang a × t.',
  },
  evidence: {
    id: 'evidence',
    name: 'Memberi bukti logis',
    book: 'Providing and articulating mathematical logical evidence',
    level: 3,
    icon: '✅',
    meaning: 'Menjelaskan mengapa jawabanmu benar dengan alasan yang masuk akal secara matematika.',
    example: '“Belah ketupat juga jajargenjang, karena kedua pasang sisinya sejajar.”',
  },
  define: {
    id: 'define',
    name: 'Mendefinisikan masalah',
    book: 'Defining the problem',
    level: 3,
    icon: '❓',
    meaning: 'Memahami apa yang sebenarnya ditanya dan informasi mana yang dipakai atau tidak.',
    example: 'Banyak pohon di kebun tidak dipakai untuk menghitung luas kebun.',
  },
  hypothesis: {
    id: 'hypothesis',
    name: 'Berpikir dugaan (jika…, maka…)',
    book: 'Inferential-hypothetical thinking',
    level: 3,
    icon: '🤔',
    meaning: 'Membuat dugaan, lalu mencari bukti untuk menerima atau menolaknya.',
    example: 'Jika diagonalnya sama panjang dan saling membagi dua, maka bangunnya persegi panjang.',
  },
  relate: {
    id: 'relate',
    name: 'Menghubungkan',
    book: 'Projecting and restructuring relationships',
    level: 3,
    icon: '🔗',
    meaning: 'Melihat hubungan antara bangun, sifat, atau besaran yang tampak terpisah.',
    example: 'Hubungan sudut berdekatan 180° dengan sisi yang sejajar.',
  },
};

/** Thinking actions trained by each kind of question (shown as tags). */
export const CONCEPT_FUNCTIONS: Record<Concept, CognitiveFunctionId[]> = {
  sides: ['label', 'compare', 'precise'],
  angles: ['constancy', 'relate', 'evidence'],
  diagonals: ['compare', 'constancy', 'multi'],
  symmetry: ['analyze', 'hypothesis', 'evidence'],
  perimeter: ['analyze', 'space', 'precise'],
  area: ['analyze', 'prior', 'precise'],
  classify: ['label', 'compare', 'generalize'],
  'word-problem': ['define', 'search', 'evidence'],
};

/** Thinking actions in the Lab (move points, see what stays the same). */
export const LAB_FUNCTIONS: CognitiveFunctionId[] = ['constancy', 'compare', 'generalize'];
/** Thinking actions in "pilah informasi" (story problems). */
export const SORTER_FUNCTIONS: CognitiveFunctionId[] = ['define', 'search'];

/** Mediated Learning Experience criteria (Feuerstein; RMT ch. 4). */
export const MLE_CRITERIA = [
  { id: 'intentionality', name: 'Intentionality & reciprocity', meaning: 'Mediator sengaja memusatkan perhatian siswa pada hal penting dan memastikan siswa ikut terlibat.' },
  { id: 'transcendence', name: 'Transcendence', meaning: 'Pelajaran dibawa melampaui soal saat ini: ke bangun lain, aturan umum, dan kehidupan sehari-hari.' },
  { id: 'meaning', name: 'Mediation of meaning', meaning: 'Siswa tahu mengapa sebuah langkah atau konsep penting.' },
  { id: 'competence', name: 'Feeling of competence', meaning: 'Bagian yang sudah benar disebut dengan jelas agar siswa merasa mampu.' },
] as const;

/**
 * Choices for the reflection: the thinking actions trained most often in the session
 * (max 4) plus "memberi bukti logis", which RMT asks for after every activity.
 */
export function reflectionChoices(concepts: Concept[], max = 5): CognitiveFunctionId[] {
  const count = new Map<CognitiveFunctionId, number>();
  concepts.forEach((c) => CONCEPT_FUNCTIONS[c].forEach((f) => count.set(f, (count.get(f) ?? 0) + 1)));
  const top = [...count.entries()]
    .filter(([f]) => f !== 'evidence')
    .sort((a, b) => b[1] - a[1])
    .slice(0, max - 1)
    .map(([f]) => f);
  return [...top, 'evidence'];
}

export const cognitiveNames = (ids: CognitiveFunctionId[]): string[] => ids.map((id) => COGNITIVE_FUNCTIONS[id].name);
