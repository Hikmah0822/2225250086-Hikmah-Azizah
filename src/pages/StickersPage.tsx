/** Sticker collection (koleksi stiker). */
import { Page, ProgressBar } from '../components/ui/Layout';
import Sticker from '../components/ui/Sticker';
import { BADGES } from '../content/badges';
import { useUnlockedBadgeIds } from '../components/ui/BadgeToast';

export default function StickersPage() {
  const unlocked = useUnlockedBadgeIds();
  const count = BADGES.filter((b) => unlocked.has(b.id)).length;
  return (
    <Page title="Koleksi Stiker" back>
      <div className="card mb-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="font-bold">Stiker terkumpul</p>
          <p className="text-2xl font-extrabold text-brand-600">
            {count} <span className="text-base text-slate-500">/ {BADGES.length}</span>
          </p>
        </div>
        <ProgressBar value={Math.round((count / BADGES.length) * 100)} label="Stiker terkumpul" />
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {BADGES.map((b, i) => {
          const ok = unlocked.has(b.id);
          return (
            <li key={b.id} className="card flex animate-fade-up flex-col items-center gap-2 p-3 text-center" style={{ animationDelay: `${i * 40}ms` }}>
              <Sticker badge={b} unlocked={ok} />
              <p className={`text-sm font-extrabold ${ok ? '' : 'text-slate-500'}`}>{b.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{ok ? '✓ Sudah didapat' : b.how}</p>
            </li>
          );
        })}
      </ul>
    </Page>
  );
}
