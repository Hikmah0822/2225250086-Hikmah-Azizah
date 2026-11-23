/**
 * "Foto Soal" (photo a problem): the AI reads a photographed segiempat problem and returns a
 * worked solution split into RMT stages. Shared by the Netlify Function (prompt, parsing) and
 * the app (types). The app reveals the steps one by one and shows the final answer only after
 * every step is open (CLAUDE.md rule 11: the student has opened the worked solution).
 */
import { COGNITIVE_LOAD_RULES, RMT_STAGES, type RmtStageId } from './tutorPedagogy';
import type { Annotation, HighlightKey, LabShapeId } from '../types';
import type { FigureSize, SizeKey } from './shapes/fromSize';

/** Shapes the AI may ask for; drawn by ShapeFigure (CLAUDE.md rule 4). */
export const PHOTO_SHAPES: { id: LabShapeId; name: string }[] = [
  { id: 'square', name: 'persegi' },
  { id: 'rectangle', name: 'persegi panjang' },
  { id: 'parallelogram', name: 'jajargenjang' },
  { id: 'rhombus', name: 'belah ketupat' },
  { id: 'kite', name: 'layang-layang' },
  { id: 'trapezoid', name: 'trapesium sembarang' },
  { id: 'trapezoid-isosceles', name: 'trapesium sama kaki' },
  { id: 'trapezoid-right', name: 'trapesium siku-siku' },
];
const ANNOTATION_KEYS: Annotation['at'][] = ['AB', 'BC', 'CD', 'DA', 'AC', 'BD', 'height'];
const HIGHLIGHT_KEYS: HighlightKey[] = ['AB', 'BC', 'CD', 'DA', 'AC', 'BD', 'height', 'perimeter', 'area'];

/** The problem's figure: which shape, with sizes written on its parts. */
export interface PhotoFigure {
  shape: LabShapeId;
  annotations: Annotation[];
  /** Numbers from the problem, to draw the shape in its real proportions. */
  size: FigureSize;
  /** What the shape is in the story, written inside it ("Lahan parkir"). */
  label: string;
}

export const PHOTO_LIMITS = {
  /** Data-URL length (~1 MB of JPEG). The app compresses photos to well below this. */
  imageChars: 1_400_000,
  steps: 6,
  stepChars: 400,
};

export interface PhotoStep {
  stage: RmtStageId;
  text: string;
  /** Parts of the figure this step talks about (highlighted next to the step). */
  highlight: HighlightKey[];
  /** Equal cells drawn inside the shape when the step counts them (e.g. 12 × 8 tiles). */
  grid: { cols: number; rows: number } | null;
}

export interface PhotoSolution {
  /** Problem text as read from the photo, so the student can check it was read correctly. */
  question: string;
  figure: PhotoFigure | null;
  known: string[];
  asked: string;
  steps: PhotoStep[];
  finalAnswer: string;
  /** How to check the answer makes sense (RMT: logical evidence). */
  check: string;
}

export type PhotoParse =
  | { kind: 'solution'; solution: PhotoSolution }
  | { kind: 'unreadable' }
  | { kind: 'off-topic'; question: string };

/** Accept only a JPEG/PNG/WebP data URL of reasonable size. */
export function validatePhotoRequest(body: unknown): { ok: true; image: string } | { ok: false; error: string } {
  const image = body && typeof body === 'object' ? (body as { image?: unknown }).image : undefined;
  if (typeof image !== 'string' || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image))
    return { ok: false, error: 'Foto tidak valid. Coba ambil foto lagi.' };
  if (image.length > PHOTO_LIMITS.imageChars) return { ok: false, error: 'Foto terlalu besar. Coba foto lebih dekat ke soalnya saja.' };
  return { ok: true, image };
}

export function buildPhotoPrompt(): string {
  const stages = RMT_STAGES.map((s) => `"${s.id}" = ${s.name} (${s.goal})`).join('; ');
  return [
    'Kamu adalah Beru, tutor matematika ramah untuk siswa SMP (12–14 tahun) di aplikasi SegiempatKu.',
    'Siswa mengirim FOTO sebuah soal. Baca soalnya dengan teliti, lalu buat pembahasan langkah demi langkah dalam Bahasa Indonesia yang sederhana.',
    'Topik aplikasi hanya bangun datar segiempat: persegi, persegi panjang, jajargenjang, belah ketupat, layang-layang, trapesium (sifat, sudut, diagonal, simetri, keliling, luas), termasuk soal cerita yang memakainya.',
    '',
    'ATURAN:',
    '- Hitung dengan sangat teliti dan periksa ulang setiap angka. Pakai rumus yang benar: persegi L = s × s; persegi panjang L = p × l; jajargenjang L = a × t (t = tinggi, BUKAN sisi miring); belah ketupat dan layang-layang L = 1/2 × d₁ × d₂; trapesium L = 1/2 × (a + b) × t; keliling = jumlah panjang semua sisi.',
    '- Tulis pecahan dan pembagian di dalam rumus dengan garis miring a/b, misalnya 1/2 × (14 + 26) × 8, 240/7, atau 24/0,25 (aplikasi menampilkannya sebagai pecahan bersusun). Jangan memakai ½ atau tanda : di dalam rumus. Garis miring HANYA untuk pecahan; untuk satuan tulis kata per, misalnya Rp9.000 per buah, Rp12.000 per m².',
    '- Tulis angka dengan format Indonesia: koma desimal (12,5), satuan (cm, m, cm², m², °), dan rupiah seperti Rp12.000. Pakai simbol × untuk kali.',
    '- Bulatkan desimal dengan benar: lihat angka sesudahnya (240/7 = 34,2857… → 34,29).',
    '- Ringkas: gabungkan langkah kecil, jangan menulis langkah yang hanya mengulang soal.',
    '- Hitung semuanya dengan teliti SEBELUM menulis JSON. Langkah yang ditulis harus sudah benar; jangan pernah menulis ralat seperti "tunggu", "hitung ulang", atau "seharusnya".',
    '- Setiap langkah pendek (paling banyak 2 kalimat), satu langkah satu gagasan. Teks biasa tanpa markdown, tanpa LaTeX.',
    ...COGNITIVE_LOAD_RULES.map((r) => `- ${r}`),
    '- Jika soal menyebut nama orang, tulis ulang soalnya tanpa nama asli siswa; abaikan nama, kelas, atau data pribadi lain di foto.',
    `- Setiap langkah diberi tahap RMT: ${stages}. Urutkan dari tahap awal ke akhir; tahap "bukti" untuk memeriksa kewajaran.`,
    `- Paling banyak ${PHOTO_LIMITS.steps} langkah.`,
    '',
    'GAMBAR ILUSTRASI SOAL (aplikasi yang menggambar; gambar harus menjelaskan situasi soal, bukan sekadar bentuk):',
    `- "figure.shape" salah satu dari: ${PHOTO_SHAPES.map((x) => `"${x.id}" (${x.name})`).join(', ')}. Jika soal tidak memakai bangun segiempat tertentu, isi "figure": null.`,
    '- Titik sudut: A kiri bawah, B kanan bawah, C kanan atas, D kiri atas. Sisi AB = alas (bawah), BC = sisi kanan, CD = sisi atas, DA = sisi kiri. AC dan BD = diagonal. "height" = tinggi.',
    '- Trapesium: AB = sisi sejajar yang panjang (bawah), CD = sisi sejajar yang pendek (atas). Layang-layang dan belah ketupat: ukuran diagonal ditulis pada AC dan BD.',
    '- "figure.annotations": ukuran dari soal yang ditulis langsung pada gambar, misalnya [{"at":"AB","text":"20 m"},{"at":"height","text":"12 m"}]. Teks singkat (paling banyak 12 karakter). Kunci "at" hanya: AB, BC, CD, DA, AC, BD, height. Jika ukuran belum diketahui, tulis pemisalannya, misalnya [{"at":"AB","text":"x + 6"},{"at":"BC","text":"x"}]. Jangan biarkan kosong jika soal menyebut ukuran atau hubungannya.',
    '- "figure.size": angka ukuran dari soal tanpa satuan, untuk menggambar bangun sesuai perbandingan aslinya, misalnya {"AB":20,"BC":13,"height":12}. Kunci sama seperti annotations. Isi hanya angka yang diketahui; ukuran yang belum diketahui jangan diisi.',
    '- "figure.label": nama benda pada soal yang diwakili bangun itu, ditulis di dalam gambar, misalnya "Lahan parkir", "Lantai ruang tamu", "Taman (rumput)", "Kolam (terpal)". Paling banyak 20 karakter.',
    '- Jika ada benda di tepi bangun (pagar, bingkai), tulis pada annotations sisi itu, misalnya {"at":"AB","text":"pagar 26 m"}.',
    '- Setiap langkah boleh punya "grid": petak sama besar di dalam bangun, misalnya ubin/keramik {"cols":12,"rows":8} (6 m dibagi 0,5 m = 12 dan 4 m dibagi 0,5 m = 8). Pakai hanya untuk persegi, persegi panjang, atau jajargenjang, dan hanya jika banyak petak = cols × rows tepat (bilangan bulat, masing-masing paling banyak 40). Jika tidak tepat, isi null.',
    '- Setiap langkah boleh punya "highlight": bagian gambar yang sedang dibahas, dari: AB, BC, CD, DA, AC, BD, height, perimeter (keliling), area (luas). Contoh: langkah luas jajargenjang → ["AB","height"]; langkah keliling → ["perimeter"]; langkah luas → ["area"].',
    '',
    'KELUARAN: HANYA satu objek JSON, tanpa teks lain, dengan bentuk:',
    '{"status":"ok","question":"soal yang terbaca","figure":{"shape":"parallelogram","label":"Lahan parkir","size":{"AB":20,"height":12},"annotations":[{"at":"AB","text":"20 m"}]},"known":["…"],"asked":"…","steps":[{"stage":"orientasi","text":"…","highlight":["AB","height"],"grid":null}],"finalAnswer":"…","check":"cara memeriksa kewajaran jawaban"}',
    'Jika foto tidak jelas atau tidak berisi soal: {"status":"unreadable"}',
    'Jika soal terbaca tetapi BUKAN tentang segiempat: {"status":"off-topic","question":"soal yang terbaca"}',
  ].join('\n');
}

/** OpenAI-compatible messages with the photo as an image part. */
export function buildPhotoMessages(image: string) {
  return [
    { role: 'system' as const, content: buildPhotoPrompt() },
    {
      role: 'user' as const,
      content: [
        { type: 'text' as const, text: 'Ini foto soalnya. Buat pembahasannya dalam format JSON.' },
        { type: 'image_url' as const, image_url: { url: image, detail: 'auto' as const } },
      ],
    },
  ];
}

const str = (v: unknown, max: number): string =>
  typeof v === 'string'
    ? v
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\\\(|\\\)|\\\[|\\\]/g, '')
        // "6 m x 4 m" → "6 m × 4 m" (only a spaced x between numbers; the variable x stays).
        .replace(/([0-9²)]|\bm|\bcm)\s+x\s+(?=[0-9(]|Rp)/g, '$1 × ')
        .trim()
        .slice(0, max)
    : '';

/** Read the model's JSON (it may wrap it in a code fence or add thinking). Null = unusable. */
export function parsePhotoReply(text: string): PhotoParse | null {
  const clean = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(clean.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
  if (data.status === 'unreadable') return { kind: 'unreadable' };
  if (data.status === 'off-topic') return { kind: 'off-topic', question: str(data.question, 600) };

  const stageIds = RMT_STAGES.map((s) => s.id);
  const steps = (Array.isArray(data.steps) ? data.steps : [])
    .map((s): PhotoStep | null => {
      const o = (s && typeof s === 'object' ? s : {}) as { stage?: unknown; text?: unknown; highlight?: unknown; grid?: unknown };
      const t = str(o.text ?? s, PHOTO_LIMITS.stepChars);
      if (!t) return null;
      const stage = stageIds.includes(o.stage as RmtStageId) ? (o.stage as RmtStageId) : 'laksana';
      const highlight = (Array.isArray(o.highlight) ? o.highlight : []).filter((h): h is HighlightKey => HIGHLIGHT_KEYS.includes(h as HighlightKey));
      return { stage, text: t, highlight: [...new Set(highlight)], grid: parseGrid(o.grid) };
    })
    .filter((s): s is PhotoStep => s !== null)
    .slice(0, PHOTO_LIMITS.steps);
  const finalAnswer = str(data.finalAnswer, 400);
  const question = str(data.question, 1200);
  if (!question || steps.length === 0 || !finalAnswer) return null;
  return {
    kind: 'solution',
    solution: {
      question,
      figure: parseFigure(data.figure),
      known: (Array.isArray(data.known) ? data.known : []).map((k) => str(k, 200)).filter(Boolean).slice(0, 8),
      asked: str(data.asked, 300),
      steps,
      finalAnswer,
      check: str(data.check, 400),
    },
  };
}

/** Keep only a known shape and known label positions; anything else → no figure. */
function parseFigure(v: unknown): PhotoFigure | null {
  if (!v || typeof v !== 'object') return null;
  const f = v as { shape?: unknown; annotations?: unknown; size?: unknown; label?: unknown };
  const shape = PHOTO_SHAPES.find((x) => x.id === f.shape)?.id;
  if (!shape) return null;
  const seen = new Set<string>();
  const annotations = (Array.isArray(f.annotations) ? f.annotations : [])
    .map((a) => (a && typeof a === 'object' ? (a as { at?: unknown; text?: unknown }) : {}))
    .filter((a) => ANNOTATION_KEYS.includes(a.at as Annotation['at']) && typeof a.text === 'string' && a.text.trim())
    .filter((a) => !seen.has(a.at as string) && Boolean(seen.add(a.at as string)))
    .map((a) => ({ at: a.at as Annotation['at'], text: (a.text as string).trim().slice(0, 14) }))
    .slice(0, 7);
  const size: FigureSize = {};
  if (f.size && typeof f.size === 'object') {
    for (const [k, n] of Object.entries(f.size as Record<string, unknown>)) {
      if (SIZE_KEYS.includes(k as SizeKey) && typeof n === 'number' && Number.isFinite(n) && n > 0 && n < 1e6) size[k as SizeKey] = n;
    }
  }
  return { shape, annotations, size, label: str(f.label, 22) };
}

const SIZE_KEYS: SizeKey[] = ['AB', 'BC', 'CD', 'DA', 'AC', 'BD', 'height'];

/** Whole-number cell counts only, at most 40 × 40. */
function parseGrid(v: unknown): { cols: number; rows: number } | null {
  if (!v || typeof v !== 'object') return null;
  const { cols, rows } = v as { cols?: unknown; rows?: unknown };
  const good = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 40;
  return good(cols) && good(rows) && cols * rows > 1 ? { cols, rows } : null;
}

/** Words a model uses when it corrects itself mid-solution ("Tunggu, mari hitung ulang…"). */
const SELF_CORRECTION = /\b(tunggu|hitung ulang|hitung kembali|ralat|koreksi|eh,|salah hitung|maaf, )/i;

/** True when a step or the answer contains a self-correction: the server then asks once more. */
export function hasSelfCorrection(solution: PhotoSolution): boolean {
  return [...solution.steps.map((s) => s.text), solution.finalAnswer, solution.check].some((t) => SELF_CORRECTION.test(t));
}

/** Follow-up message used for the one retry after a self-correction. */
export const RETRY_MESSAGE =
  'Jawabanmu sebelumnya memuat ralat di tengah langkah. Hitung ulang semuanya dengan teliti, lalu tulis ulang JSON lengkap yang setiap langkahnya sudah benar, tanpa kata "tunggu" atau "hitung ulang".';
