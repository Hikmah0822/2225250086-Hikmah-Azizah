import type { ChoiceOption, MisconceptionId, Question, WrongAnswer } from '../../types';
import { parseStudentNumber } from '../format';

export type Response = string | string[];

export interface GradeResult {
  status: 'correct' | 'wrong' | 'invalid';
  /** Specific feedback (why it is wrong), shown to the student. */
  feedback: string;
  misconception?: MisconceptionId;
}

const GENERIC_WRONG = 'Belum tepat. Periksa lagi langkahmu, atau buka petunjuk.';

/** Single-answer choice. */
export function gradeChoice(options: ChoiceOption[], answer: string, response: string | undefined): GradeResult {
  const chosen = options.find((o) => o.id === response);
  if (!chosen) return { status: 'invalid', feedback: 'Pilih salah satu jawaban dulu.' };
  if (chosen.id === answer) return { status: 'correct', feedback: chosen.feedback || 'Betul!' };
  return { status: 'wrong', feedback: chosen.feedback || GENERIC_WRONG, misconception: chosen.misconception };
}

/** Numeric answer with tolerance and diagnosis of known wrong values. */
export function gradeNumeric(
  answer: number,
  response: string | undefined,
  tolerance = 0.01,
  wrongAnswers: WrongAnswer[] = [],
): GradeResult {
  const value = parseStudentNumber(response ?? '');
  if (value === null) return { status: 'invalid', feedback: 'Tulis jawabanmu dalam bentuk angka, misalnya 12, 12,5, atau 240.000.' };
  if (Math.abs(value - answer) <= tolerance) return { status: 'correct', feedback: 'Betul!' };
  const known = wrongAnswers.find((w) => Math.abs(value - w.value) <= tolerance);
  if (known) return { status: 'wrong', feedback: known.feedback, misconception: known.misconception };
  return { status: 'wrong', feedback: GENERIC_WRONG };
}

export function grade(q: Question, response: Response): GradeResult {
  switch (q.type) {
    case 'multiple-choice':
      return gradeChoice(q.options, q.answer, Array.isArray(response) ? undefined : response);
    case 'multi-select': {
      const chosen = Array.isArray(response) ? response : [];
      if (chosen.length === 0) return { status: 'invalid', feedback: 'Pilih minimal satu jawaban.' };
      const wrongPicks = q.options.filter((o) => chosen.includes(o.id) && !q.answer.includes(o.id));
      const missing = q.answer.filter((a) => !chosen.includes(a));
      if (wrongPicks.length === 0 && missing.length === 0) return { status: 'correct', feedback: 'Betul semua!' };
      const parts = wrongPicks.map((o) => `“${o.text}”: ${o.feedback}`);
      if (missing.length > 0) parts.push(`Masih ada ${missing.length} sifat benar yang belum kamu pilih.`);
      return { status: 'wrong', feedback: parts.join(' '), misconception: wrongPicks.find((o) => o.misconception)?.misconception };
    }
    case 'numeric':
      return gradeNumeric(q.answer, Array.isArray(response) ? undefined : response, q.tolerance, q.wrongAnswers);
  }
}

export const MISCONCEPTION_LABELS: Record<MisconceptionId, string> = {
  M01: 'Tinggi jajargenjang tertukar dengan sisi miring',
  M02: 'Keliling dan luas tertukar',
  M03: 'Lupa mengalikan ½ pada rumus luas',
  M04: 'Mengira diagonal belah ketupat sama panjang',
  M05: 'Mengira kedua diagonal layang-layang saling membagi dua',
  M06: 'Mengira jajargenjang punya simetri lipat',
  M07: 'Hubungan antarbangun (mis. persegi adalah persegi panjang)',
  M08: 'Pasangan sudut 180° pada trapesium',
  M09: 'Satuan luas (cm²)',
};
