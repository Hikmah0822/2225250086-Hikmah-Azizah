/** Learning progress stored on this device only (F09). */
import { Link } from 'react-router-dom';
import { Page, ProgressBar } from '../components/ui/Layout';
import { SHAPES, SHAPE_ORDER } from '../content/shapes';
import { MISCONCEPTION_LABELS } from '../lib/quiz/grade';
import { shapePercent, useProgress } from '../store/progressStore';
import { useProfile } from '../store/profileStore';
import { BADGES } from '../content/badges';
import { useUnlockedBadgeIds } from '../components/ui/BadgeToast';
import type { MisconceptionId } from '../types';
import { INDICATOR_LABELS, LITERACY_MAX_SCORE, LITERACY_TASKS } from '../content/literacy';
import { formatNumber } from '../lib/format';

export default function ProgressPage() {
  const { shapes, attempts, literacy, reset } = useProgress();
  const { name, className } = useProfile();
  const stickers = useUnlockedBadgeIds();
  const recent = attempts.slice(-60);
  const counts = new Map<MisconceptionId, number>();
  recent.forEach((a) => a.misconception && !a.correct && counts.set(a.misconception, (counts.get(a.misconception) ?? 0) + 1));
  const review = [...counts.entries()].filter(([, n]) => n >= 1).sort((x, y) => y[1] - x[1]);
  const correct = attempts.filter((a) => a.correct).length;

  return (
    <Page title="Progres Belajar">
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-brand-600 to-teal-700 p-4 text-white shadow-md">
        <p className="text-lg font-extrabold">{name}</p>
        <p className="text-sm text-white/80">{className ? `Kelas ${className}` : 'Kelas belum diisi'}</p>
      </div>
      <div className="card mb-4 grid grid-cols-2 gap-2 text-center">
        <div>
          <p className="text-3xl font-extrabold">{attempts.length}</p>
          <p className="text-sm text-slate-500">jawaban diperiksa</p>
        </div>
        <div>
          <p className="text-3xl font-extrabold">{attempts.length ? Math.round((correct / attempts.length) * 100) : 0}%</p>
          <p className="text-sm text-slate-500">langsung benar</p>
        </div>
      </div>

      <ul className="mb-4 space-y-2">
        {SHAPE_ORDER.map((id) => {
          const p = shapes[id];
          return (
            <li key={id}>
              <Link to={`/bangun/${id}`} className="card-link space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold">{SHAPES[id].name}</span>
                  <span className="text-sm text-slate-500">{p?.practiced ? `Skor terbaik ${p.bestScore}` : 'Belum latihan'}</span>
                </div>
                <ProgressBar value={shapePercent(p, SHAPES[id].cards.length)} label={`Kemajuan ${SHAPES[id].name}`} />
              </Link>
            </li>
          );
        })}
      </ul>

      <Link to="/stiker" className="card-link mb-4 flex items-center gap-3">
        <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-2xl dark:bg-amber-950">🏅</span>
        <div className="flex-1">
          <p className="font-bold">Koleksi stiker</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {BADGES.filter((b) => stickers.has(b.id)).length} dari {BADGES.length} stiker terkumpul
          </p>
        </div>
        <span aria-hidden>→</span>
      </Link>

      <section className="card mb-4">
        <h2 className="mb-2 font-extrabold">Literasi Matematika</h2>
        <ul className="space-y-1">
          {LITERACY_TASKS.map((t) => {
            const r = literacy[t.id];
            const max = t.stages.reduce((s, st) => s + st.score, 0);
            return (
              <li key={t.id} className="flex justify-between gap-2">
                <span>
                  {t.no}. {INDICATOR_LABELS[t.indicator].name}
                </span>
                <span className="text-sm font-bold">{r ? `${formatNumber(r.best, 1)} / ${max}` : '–'}</span>
              </li>
            );
          })}
          <li className="flex justify-between gap-2 border-t border-slate-200 pt-1 font-bold dark:border-slate-800">
            <span>Total</span>
            <span>
              {formatNumber(LITERACY_TASKS.reduce((s, t) => s + (literacy[t.id]?.best ?? 0), 0), 1)} / {LITERACY_MAX_SCORE}
            </span>
          </li>
        </ul>
      </section>

      <section className="card mb-4">
        <h2 className="mb-2 font-extrabold">Perlu diulang</h2>
        {review.length === 0 ? (
          <p className="text-slate-500">Belum ada. Kerjakan latihan untuk melihat bagian yang perlu diulang.</p>
        ) : (
          <ul className="mb-3 space-y-1">
            {review.map(([m, n]) => (
              <li key={m} className="flex justify-between gap-2">
                <span>{MISCONCEPTION_LABELS[m]}</span>
                <span className="text-sm text-slate-500">{n}×</span>
              </li>
            ))}
          </ul>
        )}
        {review.length > 0 && (
          <Link to="/latihan/ulang" className="btn-primary w-full">
            🔁 Latihan Ulang Pintar
          </Link>
        )}
      </section>

      <button
        type="button"
        className="btn-ghost w-full text-red-600"
        onClick={() => window.confirm('Hapus semua progres di perangkat ini?') && reset()}
      >
        Atur ulang progres
      </button>
      <p className="mt-1 text-center text-xs text-slate-500">Progres hanya disimpan di perangkat ini.</p>
    </Page>
  );
}
