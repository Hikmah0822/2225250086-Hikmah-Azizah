/**
 * Simetri lipat & putar animation (F04; IL01).
 * - Lipat: tap a candidate line; a copy of the shape folds over it and the app says whether it lands exactly on itself.
 * - Putar: turn a copy by 90° at a time and count how often it fits its own outline in one full turn.
 */
import { useState } from 'react';
import type { LabShapeId } from '../../types';
import { SHAPE_MODELS } from '../../lib/shapes';
import { type Vec, centroid, dist, toDeg, unit } from '../../lib/geometry/vector';
import { candidateAxes, isFoldAxis, matchesAfterRotation } from '../../lib/geometry/predicates';
import { pt } from './draw';

// Lines 3 and 4 pass through the midpoints of AB/CD and BC/DA.
const AXIS_NAMES = ['Diagonal AC', 'Diagonal BD', 'Garis tengah AB', 'Garis tengah BC'];
const LETTERS = ['A', 'B', 'C', 'D'];

type Mode = 'lipat' | 'putar';

export default function SymmetryDemo({ shape }: { shape: LabShapeId }) {
  const q = SHAPE_MODELS[shape].initial;
  const axes = candidateAxes(q);
  const c = centroid(q);
  const radius = Math.max(...q.map((p) => dist(p, c))) + 1.4;
  const viewBox = `${c.x - radius} ${c.y - radius} ${radius * 2} ${radius * 2}`;
  const outline = q.map(pt).join(' ');

  const [mode, setMode] = useState<Mode>('lipat');
  const [axis, setAxis] = useState<number | null>(null);
  const [folded, setFolded] = useState(false);
  const [tried, setTried] = useState<Record<number, boolean>>({});
  const [turns, setTurns] = useState(0);

  const pick = (i: number) => {
    setFolded(false);
    setAxis(i);
    // Start folding on the next frame so the transition runs.
    requestAnimationFrame(() => requestAnimationFrame(() => setFolded(true)));
    setTried((t) => ({ ...t, [i]: isFoldAxis(q, axes[i]) }));
  };

  const found = Object.entries(tried).filter(([, ok]) => ok).length;
  const allTried = Object.keys(tried).length === axes.length;
  const foldCount = axes.filter((a) => isFoldAxis(q, a)).length;

  // Folding = reflect over the chosen line: rotate the line onto the x-axis, flip, rotate back.
  let ghostTransform = 'none';
  if (mode === 'lipat' && axis !== null) {
    const a = axes[axis];
    const d = unit(a.dir);
    const angle = toDeg(Math.atan2(d.y, d.x));
    const p: Vec = a.point;
    ghostTransform = `translate(${p.x}px, ${p.y}px) rotate(${angle}deg) scale(1, ${folded ? -1 : 1}) rotate(${-angle}deg) translate(${-p.x}px, ${-p.y}px)`;
  }
  if (mode === 'putar') ghostTransform = `translate(${c.x}px, ${c.y}px) rotate(${turns * 90}deg) translate(${-c.x}px, ${-c.y}px)`;

  const angleNow = turns * 90;
  const rotationFits = turns > 0 && matchesAfterRotation(q, angleNow);
  const fitsInTurn = [90, 180, 270, 360].filter((deg) => matchesAfterRotation(q, deg)).length;

  const verdict =
    mode === 'lipat'
      ? axis === null
        ? 'Ketuk salah satu garis putus-putus untuk melipat bangun di garis itu.'
        : folded && tried[axis]
          ? `✓ Berimpit! ${AXIS_NAMES[axis]} adalah sumbu simetri lipat.`
          : folded
            ? `✗ Tidak berimpit. ${AXIS_NAMES[axis]} bukan sumbu simetri lipat.`
            : 'Melipat…'
      : turns === 0
        ? 'Tekan "Putar 90°". Hitung berapa kali bangun menempati bingkainya sampai satu putaran penuh (360°).'
        : turns % 4 === 0
          ? `Satu putaran penuh! Bangun ini menempati bingkainya ${fitsInTurn} kali → ${fitsInTurn > 1 ? `simetri putar tingkat ${fitsInTurn}` : 'tidak memiliki simetri putar'}.`
          : rotationFits
            ? `✓ Diputar ${angleNow % 360}°: berimpit dengan bingkainya.`
            : `✗ Diputar ${angleNow % 360}°: tidak berimpit. Putar lagi!`;

  const ghostColor = mode === 'lipat' ? (axis !== null && folded ? (tried[axis] ? '#10b981' : '#f43f5e') : '#ec4899') : rotationFits || turns % 4 === 0 ? '#10b981' : '#8b5cf6';

  return (
    <div className="space-y-3 rounded-2xl bg-gradient-to-br from-pink-50 to-violet-50 p-3 ring-1 ring-pink-100 dark:from-slate-900 dark:to-slate-900 dark:ring-slate-700">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-sm font-bold">🎬 Coba lipat & putar</p>
        <div role="tablist" className="flex rounded-full bg-white p-1 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          {(['lipat', 'putar'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setAxis(null);
                setFolded(false);
                setTurns(0);
              }}
              className={`min-h-[36px] rounded-full px-3 text-sm font-bold transition ${mode === m ? 'bg-pink-500 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {m === 'lipat' ? 'Lipat' : 'Putar'}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={viewBox} className="mx-auto block max-h-64 w-full" role="img" aria-label="Animasi simetri">
        {/* The fixed outline ("bingkai") */}
        <polygon points={outline} fill="var(--g-fill)" stroke="var(--g-side)" strokeWidth={0.08} />
        {q.map((p, i) => {
          const away = unit({ x: p.x - c.x, y: p.y - c.y });
          return (
            <text key={i} x={p.x + away.x * 0.6} y={p.y + away.y * 0.6} fontSize={0.55} fontWeight={800} textAnchor="middle" dominantBaseline="central" fill="var(--g-label)" className="figure-text">
              {LETTERS[i]}
            </text>
          );
        })}

        {/* The moving copy */}
        <polygon
          points={outline}
          fill={ghostColor}
          fillOpacity={0.35}
          stroke={ghostColor}
          strokeWidth={0.1}
          style={{ transformBox: 'view-box', transformOrigin: '0px 0px', transform: ghostTransform, transition: 'transform 0.9s ease-in-out, fill 0.3s, stroke 0.3s' }}
        />
        {mode === 'putar' && <circle cx={c.x} cy={c.y} r={0.14} fill="var(--g-label)" />}

        {/* Candidate fold lines (tap targets) */}
        {mode === 'lipat' &&
          axes.map((a, i) => {
            const d = unit(a.dir);
            const x1 = a.point.x - d.x * radius * 1.5;
            const y1 = a.point.y - d.y * radius * 1.5;
            const x2 = a.point.x + d.x * radius * 1.5;
            const y2 = a.point.y + d.y * radius * 1.5;
            const active = axis === i;
            const color = tried[i] === undefined ? '#94a3b8' : tried[i] ? '#10b981' : '#f43f5e';
            return (
              <g key={i} className="cursor-pointer" onClick={() => pick(i)} role="button" aria-label={`Lipat di ${AXIS_NAMES[i]}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={0.9} />
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? 'var(--g-symmetry)' : color} strokeWidth={active ? 0.12 : 0.07} strokeDasharray="0.25 0.18" strokeLinecap="round" />
              </g>
            );
          })}
      </svg>

      <p aria-live="polite" className="min-h-[3rem] rounded-xl bg-white/80 p-2 text-sm font-semibold dark:bg-slate-800">
        {verdict}
      </p>

      {mode === 'lipat' ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {AXIS_NAMES.map((n, i) => (
              <button key={n} type="button" onClick={() => pick(i)} className={`${axis === i ? 'chip-on' : 'chip-off'} min-h-[36px] text-xs`}>
                {tried[i] === undefined ? '' : tried[i] ? '✓ ' : '✗ '}
                {n}
              </button>
            ))}
          </div>
          <p className="text-sm">
            Sumbu simetri yang kamu temukan: <b>{found}</b>
            {allTried && (
              <>
                {' '}
                dari 4 garis yang dicoba → simetri lipat bangun ini <b>{foldCount}</b>.
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary min-h-[40px]" onClick={() => setTurns((t) => t + 1)}>
            ⟳ Putar 90°
          </button>
          <button type="button" className="btn-secondary min-h-[40px]" onClick={() => setTurns(0)}>
            ↺ Ulang
          </button>
          <span className="self-center text-sm">Sudut putar: <b>{turns === 0 ? 0 : (((turns - 1) % 4) + 1) * 90}°</b></span>
        </div>
      )}
    </div>
  );
}
