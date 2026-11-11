import type { Badge } from '../../content/badges';
import ShapeFigure from '../geometry/ShapeFigure';
import Mascot from './Mascot';

/** A round sticker. Locked stickers are grey with a padlock. */
export default function Sticker({ badge, unlocked, size = 'md' }: { badge: Badge; unlocked: boolean; size?: 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'h-32 w-32' : 'h-20 w-20';
  return (
    <div className={`relative ${dim} shrink-0 ${unlocked ? '' : 'grayscale'}`}>
      <div
        className={`flex h-full w-full items-center justify-center rounded-full border-4 border-white shadow-md ${unlocked ? '' : 'opacity-50'}`}
        style={{ background: `radial-gradient(circle at 30% 25%, #ffffff 0%, ${badge.color}33 45%, ${badge.color}66 100%)`, boxShadow: `0 0 0 3px ${badge.color}55, 0 6px 14px -4px ${badge.color}88` }}
      >
        {badge.mascot ? (
          <Mascot kind={badge.mascot} mood="happy" className="h-[78%] w-[78%]" />
        ) : badge.shape ? (
          <ShapeFigure shape={badge.shape} compact accent={badge.color} className="!w-auto h-[55%] max-w-[65%]" />
        ) : null}
      </div>
      {!unlocked && (
        <span aria-hidden className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm shadow">
          🔒
        </span>
      )}
      {unlocked && (
        <span aria-hidden className="absolute -right-1 -top-1 text-lg">
          ✨
        </span>
      )}
    </div>
  );
}
