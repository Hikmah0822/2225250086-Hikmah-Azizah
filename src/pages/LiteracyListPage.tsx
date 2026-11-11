/** List of Mathematical Literacy problems with per-indicator scores. */
import { Link } from 'react-router-dom';
import { Page, ProgressBar } from '../components/ui/Layout';
import { INDICATOR_LABELS, LITERACY_MAX_SCORE, LITERACY_TASKS } from '../content/literacy';
import { useProgress } from '../store/progressStore';
import { formatNumber } from '../lib/format';

export default function LiteracyListPage() {
  const results = useProgress((s) => s.literacy);
  const totalBest = LITERACY_TASKS.reduce((s, t) => s + (results[t.id]?.best ?? 0), 0);
  const attempted = LITERACY_TASKS.some((t) => results[t.id]);

  return (
    <Page title="Literasi Matematika" back="/">
      <p className="mb-4 text-slate-600 dark:text-slate-300">
        Soal cerita dari kehidupan sehari-hari. Setiap soal dikerjakan <b>bertahap</b>, dan setiap tahap punya skor sendiri.
      </p>

      {attempted && (
        <div className="card mb-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <p className="font-bold">Skor terbaik</p>
            <p className="text-2xl font-extrabold">
              {formatNumber(totalBest, 1)} <span className="text-base font-semibold text-slate-500">/ {LITERACY_MAX_SCORE}</span>
            </p>
          </div>
          <ProgressBar value={Math.round((totalBest / LITERACY_MAX_SCORE) * 100)} label="Skor literasi" />
        </div>
      )}

      <ol className="space-y-3">
        {LITERACY_TASKS.map((t) => {
          const r = results[t.id];
          const max = t.stages.reduce((s, st) => s + st.score, 0);
          return (
            <li key={t.id}>
              <Link to={`/literasi/${t.id}`} className="card-link flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 font-extrabold text-white">{t.no}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{t.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{INDICATOR_LABELS[t.indicator].name}</p>
                  <p className="text-xs italic text-slate-400">{INDICATOR_LABELS[t.indicator].english}</p>
                </div>
                <span className="shrink-0 text-sm font-bold">{r ? `${formatNumber(r.best, 1)}/${max}` : `${t.stages.length} tahap`}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </Page>
  );
}
