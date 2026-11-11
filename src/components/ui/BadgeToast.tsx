/** Announces newly earned stickers with a small celebration pop-up. */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../../store/progressStore';
import { BADGES, unlockedBadges } from '../../content/badges';
import Sticker from './Sticker';
import Celebrate from './Celebrate';

export function useUnlockedBadgeIds(): Set<string> {
  const shapes = useProgress((s) => s.shapes);
  const literacy = useProgress((s) => s.literacy);
  const labVisited = useProgress((s) => s.labVisited);
  const detectiveSolved = useProgress((s) => s.detectiveSolved);
  return useMemo(
    () => new Set(unlockedBadges({ shapes, literacy, labVisited, detectiveSolved }).map((b) => b.id)),
    [shapes, literacy, labVisited, detectiveSolved],
  );
}

export default function BadgeToast() {
  const unlocked = useUnlockedBadgeIds();
  const seen = useProgress((s) => s.badgesSeen);
  const markBadgesSeen = useProgress((s) => s.markBadgesSeen);
  const fresh = BADGES.find((b) => unlocked.has(b.id) && !seen.includes(b.id));
  if (!fresh) return null;

  const close = () => markBadgesSeen([fresh.id]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="badge-title">
      <div className="card relative w-full max-w-xs animate-pop space-y-3 p-6 text-center">
        <Celebrate />
        <p className="text-xs font-extrabold uppercase tracking-widest text-brand-600">Stiker baru!</p>
        <div className="flex justify-center">
          <Sticker badge={fresh} unlocked size="lg" />
        </div>
        <p id="badge-title" className="text-xl font-extrabold">
          {fresh.title}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{fresh.how}</p>
        <div className="grid gap-2 pt-1">
          <button type="button" className="btn-primary" onClick={close} autoFocus>
            Hore! 🎉
          </button>
          <Link to="/stiker" className="btn-ghost" onClick={close}>
            Lihat koleksi stiker
          </Link>
        </div>
      </div>
    </div>
  );
}
