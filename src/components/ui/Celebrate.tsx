/** A short confetti burst shown once when an answer is correct (positive feedback). */
import type { CSSProperties } from 'react';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6'];
const PIECES = 16;

export default function Celebrate() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
      {Array.from({ length: PIECES }, (_, i) => {
        // Deterministic spread so the burst looks the same every time.
        const angle = (i / PIECES) * Math.PI * 2;
        const distance = 46 + (i % 3) * 18;
        const style = {
          background: COLORS[i % COLORS.length],
          '--dx': `${Math.cos(angle) * distance}px`,
          '--dy': `${Math.sin(angle) * distance}px`,
          '--rot': `${(i % 2 ? 1 : -1) * (180 + i * 20)}deg`,
          animationDelay: `${(i % 4) * 25}ms`,
        } as CSSProperties;
        return <span key={i} className="confetti" style={style} />;
      })}
    </span>
  );
}
