/**
 * Asisten Belajar Beru — pedagogy shared by the guided (offline) mode and the AI mode.
 *
 * Lecturer's requirements (Nov 2026): the assistant must
 *  1. guide Mathematical Literacy problems step by step,
 *  2. manage cognitive load (intrinsic, extraneous, germane),
 *  3. give hints matched to the student's difficulty, never the final answer straight away,
 *  4. follow the stages of Rigorous Mathematical Thinking (RMT).
 *
 * Design:
 *  - RMT_STAGES: the learning-activity stages of RMT (orientation → defining the problem →
 *    planning with tools → carrying out → logical evidence & reflection).
 *  - DIFFICULTIES: what the student says is hard; each maps to the RMT stage that addresses it.
 *  - Hint ladder (level 1–4): asking again about the same difficulty raises the level;
 *    level 4 (worked steps) only after the student has tried twice or opened the solution.
 *  - COGNITIVE_LOAD_RULES: how every reply manages IL, EL and GL.
 */
import type { TutorContext } from './tutorPrompt';

export type RmtStageId = 'orientasi' | 'definisi' | 'rencana' | 'laksana' | 'bukti';

export const RMT_STAGES: { id: RmtStageId; name: string; goal: string }[] = [
  { id: 'orientasi', name: 'Memahami situasi', goal: 'Mengamati gambar dan informasi soal dengan teliti.' },
  { id: 'definisi', name: 'Mendefinisikan masalah', goal: 'Menentukan apa yang diketahui, apa yang ditanya, dan informasi yang tidak dipakai.' },
  { id: 'rencana', name: 'Merencanakan dengan alat berpikir', goal: 'Mengingat konsep, lalu memilih alat: gambar, tabel, simbol, atau rumus.' },
  { id: 'laksana', name: 'Melaksanakan', goal: 'Mengerjakan satu langkah pada satu waktu dengan teliti (angka dan satuan).' },
  { id: 'bukti', name: 'Membuktikan dan merefleksi', goal: 'Memberi alasan logis, memeriksa kewajaran, dan menghubungkan ke situasi lain.' },
];

export type DifficultyId = 'paham-soal' | 'mulai' | 'konsep' | 'hitung' | 'cek';

export const DIFFICULTIES: { id: DifficultyId; label: string; stage: RmtStageId }[] = [
  { id: 'paham-soal', label: 'Aku belum paham soalnya', stage: 'orientasi' },
  { id: 'mulai', label: 'Aku tidak tahu mulai dari mana', stage: 'definisi' },
  { id: 'konsep', label: 'Aku bingung rumus atau konsepnya', stage: 'rencana' },
  { id: 'hitung', label: 'Aku ragu dengan hitunganku', stage: 'laksana' },
  { id: 'cek', label: 'Tolong cek alasan jawabanku', stage: 'bukti' },
];

export const HINT_LEVELS: Record<1 | 2 | 3 | 4, string> = {
  1: 'Pertanyaan pancingan',
  2: 'Petunjuk arah',
  3: 'Langkah sebagian',
  4: 'Penjelasan langkah',
};

/** How each reply manages cognitive load (Sweller), stated for the AI and the docs. */
export const COGNITIVE_LOAD_RULES = [
  'Beban intrinsik (IL): pecah masalah menjadi SATU langkah kecil per balasan. Mulai dari bagian yang paling sederhana.',
  'Beban ekstrinsik (EL): kalimat pendek (maksimal 3 kalimat), tanpa informasi tambahan yang tidak perlu. Rujuk label pada gambar (misalnya AB, t) agar siswa tidak bolak-balik mencari.',
  'Beban germane (GL): ajak siswa menjelaskan dengan kata-katanya sendiri, menyebut alasannya, dan menghubungkan dengan konsep yang sudah dikenal.',
];

export const stageOf = (d: DifficultyId): RmtStageId => DIFFICULTIES.find((x) => x.id === d)!.stage;
export const stageName = (s: RmtStageId): string => RMT_STAGES.find((x) => x.id === s)!.name;

/** Worked steps are allowed only after real effort (two tries) or once the solution is open. */
export const mayExplain = (ctx: Pick<TutorContext, 'attempts' | 'solutionShown'>): boolean => ctx.solutionShown || ctx.attempts >= 2;

/**
 * Hint level for this request. `asked` = how many times the student already asked about this
 * difficulty on this problem. Each new ask goes one rung up; a wrong attempt adds one rung.
 */
export function hintLevel(ctx: Pick<TutorContext, 'attempts' | 'solutionShown'>, asked: number): 1 | 2 | 3 | 4 {
  const raw = 1 + asked + (ctx.attempts >= 1 ? 1 : 0);
  const cap = mayExplain(ctx) ? 4 : 3;
  return Math.max(1, Math.min(cap, raw)) as 1 | 2 | 3 | 4;
}

const pick = <T,>(xs: T[] | undefined, i: number): T | undefined => (xs && xs.length ? xs[Math.min(i, xs.length - 1)] : undefined);

/**
 * Guided (offline) reply: built only from the problem's own hints, story data and official
 * steps, so it is always mathematically correct and never reveals the final answer early.
 */
export function guidedReply(ctx: TutorContext, difficulty: DifficultyId, level: 1 | 2 | 3 | 4): { stage: RmtStageId; text: string } {
  const stage = stageOf(difficulty);
  const known = ctx.known?.length ? ctx.known.slice(0, 3).join('; ') : '';
  const hint = (i: number) => pick(ctx.hints, i);
  const steps = (n: number) => ctx.solutionSteps.slice(0, n).join(' ');
  const fn = ctx.thinkingFunctions?.[0];
  let text: string;

  switch (difficulty) {
    case 'paham-soal':
      text =
        level === 1
          ? 'Kita pelan-pelan, ya. Baca soalnya sekali lagi dan lihat gambarnya. Bangun apa yang dibicarakan, dan ukuran apa saja yang tertulis?'
          : level === 2
            ? known
              ? `Informasi penting di soal: ${known}. Menurutmu, mana yang paling dibutuhkan?`
              : 'Coba garis bawahi setiap angka beserta satuannya. Ada berapa ukuran yang diketahui?'
            : `Ringkasnya, ${known ? `diketahui ${known}. ` : ''}${ctx.asked ? `Yang ditanya: ${ctx.asked}. ` : ''}Coba ucapkan lagi apa yang ditanya dengan kalimatmu sendiri.`;
      break;
    case 'mulai':
      text =
        level === 1
          ? 'Mulai dari yang ditanya dulu: luas, keliling, sudut, atau yang lain? Setelah itu, cari informasi yang dibutuhkan untuk itu saja.'
          : level === 2
            ? `${hint(0) ?? 'Tulis dulu "Diketahui" dan "Ditanya".'} Apa langkah pertamamu?`
            : level === 3
              ? `${hint(1) ?? hint(0) ?? ''} Coba kerjakan bagian itu saja dulu.`.trim()
              : `Langkah awalnya: ${steps(1)} Sekarang coba lanjutkan sendiri langkah berikutnya.`;
      break;
    case 'konsep':
      text =
        level === 1
          ? 'Ingat lagi sifat atau rumus yang sudah kamu pelajari. Mana yang berhubungan dengan yang ditanya? Lihat juga gambarnya.'
          : level === 2
            ? `${hint(1) ?? hint(0) ?? 'Lihat kembali Catatanku untuk bangun ini.'} Rumus itu memakai ukuran apa saja?`
            : level === 3
              ? `${hint(2) ?? hint(1) ?? hint(0) ?? ''} Ukuran mana di gambar yang cocok dengan rumus itu?`.trim()
              : `Penjelasannya: ${steps(2)} Bagian mana yang tadi membuatmu bingung?`;
      break;
    case 'hitung':
      text =
        level === 1
          ? 'Hitung ulang pelan-pelan, satu langkah saja. Apakah semua satuan sudah sama, misalnya semuanya cm?'
          : level === 2
            ? 'Periksa rumusnya: apakah kamu memakai tinggi (bukan sisi miring), menjumlahkan sisi yang sejajar, dan mengalikan ½ bila perlu?'
            : level === 3
              ? `${pick(ctx.hints, (ctx.hints?.length ?? 1) - 1) ?? ''} Hitung bagian ini, lalu bandingkan dengan hasilmu.`.trim()
              : `Coba cocokkan dengan langkah resmi: ${ctx.solutionSteps.join(' ')} Di langkah mana hasilmu berbeda?`;
      break;
    case 'cek':
      text =
        level === 1
          ? 'Mengapa jawabanmu benar? Tulis alasanmu dalam satu kalimat yang dimulai dengan "karena …".'
          : level === 2
            ? 'Periksa kewajarannya: apakah hasilnya masuk akal dengan ukuran di soal, dan satuannya tepat (cm, cm², m, atau m²)?'
            : level === 3
              ? 'Sekarang hubungkan: apakah caramu juga berlaku jika ukurannya diganti? Apa yang tetap sama dari caranya?'
              : `Bandingkan alasanmu dengan pembahasan: ${ctx.solutionSteps.slice(-1).join(' ')} Apa yang sudah sama dan apa yang perlu kamu tambahkan?`;
      break;
  }
  if (fn && level <= 2) text += ` (Fungsi berpikir: ${fn.toLowerCase()}.)`;
  return { stage, text };
}
