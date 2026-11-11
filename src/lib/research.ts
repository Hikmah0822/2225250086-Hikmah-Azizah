/** Scoring and export for the research instruments (pretes/postes, N-gain, cognitive load). */
import type { LoadType, TestItem } from '../content/assessment';
import { CL_ITEMS } from '../content/assessment';
import { gradeChoice, gradeNumeric } from './quiz/grade';
import { formatNumber } from './format';

export interface TestResult {
  answers: Record<string, string>;
  correct: Record<string, boolean>;
  /** 0–100 */
  score: number;
  startedAt: number;
  finishedAt: number;
}

export interface SurveyResult {
  /** item id → 0–10 */
  answers: Record<string, number>;
  paas: number;
  at: number;
}

export function scoreTest(items: TestItem[], answers: Record<string, string>, startedAt: number, finishedAt: number): TestResult {
  const correct: Record<string, boolean> = {};
  for (const item of items) {
    const r =
      item.type === 'numeric'
        ? gradeNumeric(item.answer as number, answers[item.id], 0.01)
        : gradeChoice((item.options ?? []).map((o) => ({ ...o, feedback: '' })), item.answer as string, answers[item.id]);
    correct[item.id] = r.status === 'correct';
  }
  const n = Object.values(correct).filter(Boolean).length;
  return { answers, correct, score: Math.round((n / items.length) * 100), startedAt, finishedAt };
}

/** Hake's normalised gain, in 0–1 (null when the pretest was already 100). */
export function nGain(pre: number, post: number, max = 100): number | null {
  if (pre >= max) return null;
  return (post - pre) / (max - pre);
}

export function nGainCategory(g: number | null): string {
  if (g === null) return '–';
  if (g >= 0.7) return 'tinggi';
  if (g >= 0.3) return 'sedang';
  return 'rendah';
}

export function loadMeans(survey: SurveyResult): Record<LoadType, number> {
  const mean = (type: LoadType) => {
    const items = CL_ITEMS.filter((i) => i.type === type);
    return items.reduce((s, i) => s + (survey.answers[i.id] ?? 0), 0) / items.length;
  };
  return { IL: mean('IL'), EL: mean('EL'), GL: mean('GL') };
}

const csvCell = (v: string | number | null | undefined) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const iso = (t?: number) => (t ? new Date(t).toISOString() : '');
const seconds = (r?: TestResult) => (r ? Math.round((r.finishedAt - r.startedAt) / 1000) : '');

export interface ExportInput {
  name: string;
  className: string;
  pre?: TestResult;
  post?: TestResult;
  survey?: SurveyResult;
  pretestItems: TestItem[];
  posttestItems: TestItem[];
}

/** One header row + one data row, so files from many students can be pasted under each other. */
export function toCsv(d: ExportInput): string {
  const g = d.pre && d.post ? nGain(d.pre.score, d.post.score) : null;
  const means = d.survey ? loadMeans(d.survey) : null;
  const header = [
    'nama', 'kelas', 'waktu_ekspor',
    'pretes_skor', 'postes_skor', 'n_gain', 'kategori_n_gain',
    'IL_rata2', 'EL_rata2', 'GL_rata2', 'paas',
    'pretes_mulai', 'pretes_durasi_detik', 'postes_mulai', 'postes_durasi_detik',
    ...d.pretestItems.map((i) => `${i.id}_benar`),
    ...d.posttestItems.map((i) => `${i.id}_benar`),
    ...d.pretestItems.map((i) => `${i.id}_jawaban`),
    ...d.posttestItems.map((i) => `${i.id}_jawaban`),
    ...CL_ITEMS.map((i) => i.id),
  ];
  const b = (r: TestResult | undefined, id: string) => (r ? (r.correct[id] ? 1 : 0) : '');
  const row = [
    d.name, d.className, new Date().toISOString(),
    d.pre?.score ?? '', d.post?.score ?? '', g === null ? '' : g.toFixed(3), nGainCategory(g),
    means ? means.IL.toFixed(2) : '', means ? means.EL.toFixed(2) : '', means ? means.GL.toFixed(2) : '', d.survey?.paas ?? '',
    iso(d.pre?.startedAt), seconds(d.pre), iso(d.post?.startedAt), seconds(d.post),
    ...d.pretestItems.map((i) => b(d.pre, i.id)),
    ...d.posttestItems.map((i) => b(d.post, i.id)),
    ...d.pretestItems.map((i) => d.pre?.answers[i.id] ?? ''),
    ...d.posttestItems.map((i) => d.post?.answers[i.id] ?? ''),
    ...CL_ITEMS.map((i) => d.survey?.answers[i.id] ?? ''),
  ];
  return `${header.map(csvCell).join(',')}\n${row.map(csvCell).join(',')}\n`;
}

/** Short human-readable summary, e.g. to paste into WhatsApp. */
export function toSummaryText(d: ExportInput): string {
  const g = d.pre && d.post ? nGain(d.pre.score, d.post.score) : null;
  const means = d.survey ? loadMeans(d.survey) : null;
  const lines = [
    `Hasil SegiempatKu`,
    `Nama: ${d.name}`,
    `Kelas: ${d.className || '-'}`,
    `Pretes: ${d.pre ? d.pre.score : '-'}`,
    `Postes: ${d.post ? d.post.score : '-'}`,
    `N-gain: ${g === null ? '-' : `${formatNumber(g, 2)} (${nGainCategory(g)})`}`,
  ];
  if (means && d.survey) {
    lines.push(`Beban kognitif (0–10): IL ${formatNumber(means.IL, 1)}, EL ${formatNumber(means.EL, 1)}, GL ${formatNumber(means.GL, 1)}`);
    lines.push(`Usaha mental (1–9): ${d.survey.paas}`);
  }
  lines.push('', 'Data lengkap (CSV):', toCsv(d).trim());
  return lines.join('\n');
}
