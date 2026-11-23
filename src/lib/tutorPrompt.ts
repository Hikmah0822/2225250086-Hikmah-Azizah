/**
 * "Tanya Beru" AI tutor — request validation and prompt building.
 * Shared by the browser (to shape requests) and the Netlify Function (which owns the
 * system prompt, so a student cannot override the tutor's rules).
 *
 * Pedagogy (see tutorPedagogy.ts): the tutor guides the student through the RMT stages,
 * manages cognitive load, and gives hints on a ladder matched to the student's difficulty.
 *
 * Privacy (CLAUDE.md §9): requests contain only the question, the official key/steps,
 * the student's answer and chat text — never the student's name or class.
 */

import { COGNITIVE_LOAD_RULES, DIFFICULTIES, HINT_LEVELS, RMT_STAGES, mayExplain, stageName, type DifficultyId, type RmtStageId } from './tutorPedagogy';

export interface TutorContext {
  /** e.g. "Jajargenjang — luas" */
  topic: string;
  /** The problem as shown to the student. */
  question: string;
  /** What the student entered/chose (may be empty). */
  studentAnswer?: string;
  /** Official answer, used as ground truth. */
  correctAnswer: string;
  /** Official worked solution, used as ground truth. */
  solutionSteps: string[];
  hints?: string[];
  /** Number of checked attempts so far. */
  attempts: number;
  /** True once the official solution has been shown to the student. */
  solutionShown: boolean;
  /** RMT cognitive functions this problem trains (Indonesian names). */
  thinkingFunctions?: string[];
  /** Story problems: the relevant given information and what is asked. */
  known?: string[];
  asked?: string;
  /** Floating assistant: a general concept question, not a specific problem. */
  general?: boolean;
}

/** What the student said is hard and the hint level reached (from tutorPedagogy). */
export interface TutorGuidance {
  difficulty: DifficultyId;
  level: 1 | 2 | 3 | 4;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TutorRequest {
  context: TutorContext;
  messages: ChatMessage[];
  guidance?: TutorGuidance;
}

export const TUTOR_LIMITS = {
  /** Messages per request (student + tutor). */
  messages: 12,
  /** Characters per chat message. */
  messageChars: 600,
  /** Characters for each context text field. */
  fieldChars: 1500,
  /** Solution steps / hints kept. */
  steps: 12,
};

/**
 * Mediation rules from Rigorous Mathematical Thinking (Kinard & Kozulin, 2008):
 * MLE criteria (intentionality/reciprocity, transcendence, meaning, feeling of competence),
 * naming cognitive functions, demanding logical evidence, and using psychological tools.
 */
export const RMT_GUIDANCE = [
  'Intentionality & reciprocity: pusatkan perhatian siswa pada SATU hal penting dulu. Ajukan satu pertanyaan penuntun, lalu tunggu jawabannya.',
  'Definisikan masalah: ajak siswa menyebut apa yang diketahui, apa yang ditanya, dan informasi mana yang tidak dipakai.',
  'Sebut fungsi berpikir yang sedang dipakai siswa dengan namanya, misalnya "Kamu sedang membandingkan…" atau "Coba cari yang tetap…".',
  'Bukti logis: tanggapi jawaban siswa dengan "Mengapa? Apa buktinya?". Jangan menerima tebakan tanpa alasan.',
  'Alat berpikir: arahkan siswa memakai gambar, tabel, simbol (∥, ⊥, °), dan rumus sebagai alat untuk berpikir, bukan sekadar hafalan.',
  'Transcendence: setelah siswa paham, hubungkan dengan bangun lain, aturan umum, atau kehidupan sehari-hari ("Apakah ini juga berlaku untuk persegi?").',
  'Meaning & rasa mampu: jelaskan singkat mengapa langkah itu penting, dan sebut dengan jelas bagian yang sudah benar.',
];

const clip = (s: unknown, max: number): string => (typeof s === 'string' ? s.slice(0, max) : '');

/** Validate and trim an incoming request. Returns an error message for bad input. */
export function validateTutorRequest(body: unknown): { ok: true; value: TutorRequest } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Format permintaan tidak valid.' };
  const { context, messages, guidance } = body as Partial<TutorRequest>;
  if (!context || typeof context !== 'object' || typeof context.question !== 'string' || !context.question.trim())
    return { ok: false, error: 'Soal tidak ditemukan.' };
  if (!Array.isArray(messages) || messages.length === 0) return { ok: false, error: 'Pesan kosong.' };
  if (messages.length > TUTOR_LIMITS.messages) return { ok: false, error: 'Percakapan terlalu panjang.' };
  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return { ok: false, error: 'Pesan tidak valid.' };
    if (m.content.length > TUTOR_LIMITS.messageChars) return { ok: false, error: 'Pesan terlalu panjang.' };
  }
  if (messages[messages.length - 1].role !== 'user') return { ok: false, error: 'Pesan terakhir harus dari siswa.' };

  const f = TUTOR_LIMITS.fieldChars;
  return {
    ok: true,
    value: {
      context: {
        topic: clip(context.topic, 120),
        question: clip(context.question, f),
        studentAnswer: clip(context.studentAnswer, 300),
        correctAnswer: clip(context.correctAnswer, 300),
        solutionSteps: (Array.isArray(context.solutionSteps) ? context.solutionSteps : []).slice(0, TUTOR_LIMITS.steps).map((s) => clip(s, 400)),
        hints: (Array.isArray(context.hints) ? context.hints : []).slice(0, 5).map((s) => clip(s, 300)),
        attempts: Number.isFinite(context.attempts) ? Math.max(0, Math.min(20, Number(context.attempts))) : 0,
        solutionShown: Boolean(context.solutionShown),
        thinkingFunctions: (Array.isArray(context.thinkingFunctions) ? context.thinkingFunctions : []).slice(0, 5).map((s) => clip(s, 60)),
        known: (Array.isArray(context.known) ? context.known : []).slice(0, 6).map((s) => clip(s, 200)),
        asked: clip(context.asked, 200),
        general: Boolean(context.general),
      },
      guidance:
        guidance && DIFFICULTIES.some((d) => d.id === guidance.difficulty) && [1, 2, 3, 4].includes(guidance.level)
          ? { difficulty: guidance.difficulty, level: guidance.level }
          : undefined,
      messages: messages.map((m) => ({ role: m.role, content: m.content.trim() })),
    },
  };
}

export function buildSystemPrompt(ctx: TutorContext, guidance?: TutorGuidance): string {
  const explain = Boolean(ctx.general) || mayExplain(ctx);
  const level = guidance ? Math.min(guidance.level, explain ? 4 : 3) : explain ? 4 : 1;
  const difficulty = guidance ? DIFFICULTIES.find((d) => d.id === guidance.difficulty) : undefined;
  return [
    'Kamu adalah Beru, beruang ramah yang menjadi tutor matematika untuk siswa SMP (12–14 tahun) di aplikasi SegiempatKu.',
    'Topik hanya bangun datar segiempat: persegi, persegi panjang, jajargenjang, belah ketupat, layang-layang, trapesium (sifat, sudut, diagonal, simetri, keliling, luas).',
    '',
    'ATURAN:',
    '- Selalu jawab dalam Bahasa Indonesia yang sederhana, hangat, dan menyemangati. Sapa dengan "kamu".',
    '- Jawaban singkat: paling banyak 3 kalimat atau 60 kata. Teks biasa saja, tanpa markdown, tanpa tanda bintang, tanpa LaTeX. Gunakan simbol seperti ×, ½, °, cm².',
    '- Kunci jawaban dan langkah resmi di bawah adalah ACUAN KEBENARAN. Jangan pernah bertentangan dengannya. Jika ragu, arahkan siswa ke pembahasan.',
    ctx.general
      ? '- Siswa bertanya KONSEP UMUM (bukan soal tertentu). Kamu boleh menjelaskan konsep, sifat, atau rumus dengan singkat dan benar sesuai acuan, lalu akhiri dengan SATU pertanyaan yang membuat siswa berpikir. Jika siswa meminta jawaban soal hitungan atau PR, jangan berikan angka akhirnya; bimbing langkah pertamanya saja.'
      : explain
      ? '- Siswa sudah berusaha atau sudah melihat pembahasan: kamu boleh menjelaskan langkah penyelesaian satu per satu, sambil tetap bertanya untuk memastikan siswa paham.'
      : '- JANGAN memberikan jawaban akhir atau angka hasil akhir. Bimbing dengan satu pertanyaan penuntun atau petunjuk kecil.',
    '- Jika siswa bertanya di luar matematika segiempat, tolak dengan sopan dan ajak kembali ke soal.',
    '- Jangan meminta atau menyebut data pribadi (nama, sekolah, alamat, nomor HP). Jika siswa menulisnya, abaikan dan ingatkan agar tidak membagikan data pribadi.',
    '- Jangan memuji berlebihan dan jangan menyalahkan. Kesalahan adalah bagian dari belajar.',
    '',
    'CARA MEMBIMBING (Rigorous Mathematical Thinking — pengalaman belajar termediasi):',
    ...RMT_GUIDANCE.map((g) => `- ${g}`),
    '',
    'TAHAPAN RMT (bimbing siswa melewati tahap ini secara berurutan; mulai dari tahap tempat siswa kesulitan):',
    ...RMT_STAGES.map((s, i) => `${i + 1}. ${s.name}: ${s.goal}`),
    '',
    'PENGELOLAAN BEBAN KOGNITIF:',
    ...COGNITIVE_LOAD_RULES.map((r) => `- ${r}`),
    '',
    'TINGKAT BANTUAN (naik satu tingkat setiap siswa meminta bantuan lagi):',
    ...(Object.entries(HINT_LEVELS) as [string, string][]).map(([k, v]) => `${k}. ${v}${k === '4' ? ' (hanya jika siswa sudah berusaha atau sudah melihat pembahasan)' : ''}`),
    `Tingkat bantuan SEKARANG: ${level} (${HINT_LEVELS[level as 1 | 2 | 3 | 4]}). Jangan memberi bantuan di atas tingkat ini.`,
    ...(difficulty ? [`Kesulitan yang disampaikan siswa: "${difficulty.label}" → mulai dari tahap "${stageName(difficulty.stage)}".`] : []),
    '',
    'FORMAT BALASAN: baris pertama persis "TAHAP: <nama tahap RMT dari daftar di atas>", lalu balasanmu pada baris berikutnya.',
    '',
    ctx.general ? 'DATA PERTANYAAN KONSEP (acuan kebenaran dari materi aplikasi):' : 'DATA SOAL:',
    `Topik: ${ctx.topic || '-'}`,
    `Soal: ${ctx.question}`,
    `Jawaban siswa saat ini: ${ctx.studentAnswer?.trim() ? ctx.studentAnswer : '(belum menjawab)'}`,
    `Banyak percobaan: ${ctx.attempts}`,
    ...(ctx.known?.length ? [`Informasi yang diperlukan: ${ctx.known.join('; ')}`] : []),
    ...(ctx.asked ? [`Yang ditanya: ${ctx.asked}`] : []),
    ...(ctx.thinkingFunctions?.length ? [`Fungsi berpikir yang dilatih soal ini: ${ctx.thinkingFunctions.join(', ')}`] : []),
    `Kunci jawaban resmi: ${ctx.correctAnswer}`,
    'Langkah penyelesaian resmi:',
    ...ctx.solutionSteps.map((s, i) => `${i + 1}. ${s}`),
    ...(ctx.hints?.length ? ['Petunjuk bertingkat yang tersedia:', ...ctx.hints.map((h, i) => `${i + 1}. ${h}`)] : []),
  ].join('\n');
}

/** Messages in the OpenAI-compatible format used by the DeepSeek API. */
export function buildTutorMessages(req: TutorRequest): { role: 'system' | 'user' | 'assistant'; content: string }[] {
  return [{ role: 'system', content: buildSystemPrompt(req.context, req.guidance) }, ...req.messages];
}

/** Split the model's "TAHAP: …" first line from the reply. Unknown stage → null. */
export function parseReply(text: string): { stage: RmtStageId | null; reply: string } {
  const m = text.match(/^\s*TAHAP\s*:\s*(.+?)\s*(?:\n|$)/i);
  if (!m) return { stage: null, reply: text.trim() };
  const name = m[1].toLowerCase();
  const stage = RMT_STAGES.find((s) => name.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(name))?.id ?? null;
  return { stage, reply: text.slice(m[0].length).trim() };
}

/** Remove markdown the model might still produce, so the UI shows clean text. */
export function cleanReply(text: string): string {
  return text
    // Reasoning models may include their hidden thinking; never show it.
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/(^|\s)\*(\S.*?)\*(?=\s|$)/g, '$1$2')
    .replace(/^#+\s*/gm, '')
    .replace(/\\\(|\\\)|\\\[|\\\]/g, '')
    .replace(/\\times/g, '×')
    .replace(/\\frac\{1\}\{2\}/g, '½')
    .trim();
}
