/**
 * Keliling vs Luas animation (F05; IL03, IL05).
 * - Keliling: the outline is traced side by side (orange) while the lengths are added up.
 * - Luas: the inside is filled (blue) and the formula is shown visually:
 *   unit squares (persegi panjang/persegi), cut-and-shift (jajargenjang),
 *   two copies make a parallelogram (trapesium), half of the bounding rectangle (belah ketupat/layang-layang).
 */
import { useEffect, useMemo, useState } from 'react';
import type { ShapeId } from '../../types';
import { SHAPES } from '../../content/shapes';
import { SHAPE_MODELS } from '../../lib/shapes';
import { type Quad, type Vec, add, dist, scale, sub } from '../../lib/geometry/vector';
import { area, diagonalLengths, footOfPerpendicular, sideLengths } from '../../lib/geometry/measure';
import { formatNumber } from '../../lib/format';
import { pt } from './draw';

type Mode = 'keliling' | 'luas';

const pts = (q: Vec[]) => q.map(pt).join(' ');

function viewBoxFor(points: Vec[], pad = 1.3): string {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  return `${minX} ${minY} ${Math.max(...xs) - minX + pad} ${Math.max(...ys) - minY + pad}`;
}

export default function PerimeterAreaDemo({ shape }: { shape: ShapeId }) {
  const info = SHAPES[shape];
  const q: Quad = SHAPE_MODELS[info.labShape].initial;
  const [mode, setMode] = useState<Mode>('keliling');
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0); // bump to replay

  const sides = sideLengths(q);
  const maxStep = mode === 'keliling' ? 4 : 1;

  // Keliling: trace one side every 0.8 s. Luas: switch to the "explained" phase after 1.2 s.
  useEffect(() => {
    setStep(0);
    const timers: number[] = [];
    for (let s = 1; s <= maxStep; s++) timers.push(window.setTimeout(() => setStep(s), mode === 'keliling' ? s * 800 : 1200));
    return () => timers.forEach(clearTimeout);
  }, [mode, run, maxStep]);

  // Extra geometry for the area explanations.
  const extra = useMemo(() => {
    const foot = footOfPerpendicular(q[3], q[0], q[1]);
    const shift = sub(q[1], q[0]);
    const mBC = scale(add(q[1], q[2]), 0.5);
    const rotated = q.map((p) => sub(scale(mBC, 2), p)); // 180° about the midpoint of BC
    const xs = q.map((p) => p.x);
    const ys = q.map((p) => p.y);
    const box: Quad = [
      { x: Math.min(...xs), y: Math.max(...ys) },
      { x: Math.max(...xs), y: Math.max(...ys) },
      { x: Math.max(...xs), y: Math.min(...ys) },
      { x: Math.min(...xs), y: Math.min(...ys) },
    ];
    return { foot, shift, mBC, rotated, box };
  }, [q]);

  // The trapezoid copy sticks out to the right, so include it in the view.
  const allPoints = shape === 'trapezoid' && mode === 'luas' ? [...q, ...extra.rotated] : q;
  const viewBox = viewBoxFor(allPoints);

  // ---------- Explanations ----------
  const unit = 'satuan';
  const shown = sides.slice(0, step).map((s) => formatNumber(s));
  const perimeterText =
    step === 0
      ? 'Keliling = panjang garis tepi. Perhatikan garis oranye berjalan mengelilingi bangun…'
      : `K = ${shown.join(' + ')}${step === 4 ? ` = ${formatNumber(sides.reduce((a, b) => a + b, 0))} ${unit}` : ' + …'}`;

  const [d1, d2] = diagonalLengths(q);
  const base = dist(q[0], q[1]);
  const height = dist(q[3], extra.foot);
  let areaText = 'Luas = besar daerah di dalam bangun (warna biru).';
  if (step >= 1) {
    if (shape === 'rectangle' || shape === 'square')
      areaText = `Hitung petaknya: ${formatNumber(base)} petak × ${formatNumber(dist(q[1], q[2]))} baris = ${formatNumber(area(q))} petak satuan. Itulah ${shape === 'square' ? 's × s' : 'p × l'}.`;
    else if (shape === 'parallelogram')
      areaText = `Potong segitiga di kiri, geser ke kanan → jadi persegi panjang ${formatNumber(base)} × ${formatNumber(height)}. Jadi L = a × t = ${formatNumber(area(q))} ${unit}².`;
    else if (shape === 'trapezoid')
      areaText = `Dua trapesium yang sama (satu diputar) membentuk jajargenjang dengan alas (a + b). Satu trapesium = ½ × (a + b) × t = ${formatNumber(area(q))} ${unit}².`;
    else areaText = `Bangun ini mengisi tepat setengah persegi panjang d₁ × d₂ = ${formatNumber(d1)} × ${formatNumber(d2)}. Jadi L = ½ × d₁ × d₂ = ${formatNumber(area(q))} ${unit}².`;
  }

  // Unit grid for rectangle and square (shapes are axis-aligned in their default position).
  const cells: Vec[] = [];
  if (mode === 'luas' && (shape === 'rectangle' || shape === 'square')) {
    for (let y = extra.box[2].y; y < extra.box[0].y - 1e-6; y++) for (let x = extra.box[0].x; x < extra.box[1].x - 1e-6; x++) cells.push({ x, y });
  }

  const tri = [q[0], extra.foot, q[3]];

  return (
    <div className="space-y-3 rounded-2xl bg-gradient-to-br from-orange-50 to-sky-50 p-3 ring-1 ring-orange-100 dark:from-slate-900 dark:to-slate-900 dark:ring-slate-700">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-sm font-bold">🎬 Animasi Keliling vs Luas</p>
        <div role="tablist" className="flex rounded-full bg-white p-1 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          {(['keliling', 'luas'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`min-h-[36px] rounded-full px-3 text-sm font-bold transition ${
                mode === m ? (m === 'keliling' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white') : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {m === 'keliling' ? 'Keliling' : 'Luas'}
            </button>
          ))}
        </div>
      </div>

      <svg key={`${mode}-${run}`} viewBox={viewBox} className="mx-auto block max-h-60 w-full" role="img" aria-label={`Animasi ${mode} ${info.name}`}>
        {mode === 'keliling' && (
          <>
            <polygon points={pts(q)} fill="var(--g-fill)" stroke="var(--g-side)" strokeWidth={0.08} strokeDasharray="0.2 0.15" />
            {q.map((p, i) => {
              if (i >= step) return null;
              const n = q[(i + 1) % 4];
              return <line key={i} className="draw-seg" pathLength={1} x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke="var(--g-perimeter)" strokeWidth={0.24} strokeLinecap="round" />;
            })}
            {q.map((p, i) => {
              if (i >= step) return null;
              const n = q[(i + 1) % 4];
              const mid = scale(add(p, n), 0.5);
              const c = scale(q.reduce((a, b) => add(a, b), { x: 0, y: 0 }), 0.25);
              const out = sub(mid, c);
              const len = Math.hypot(out.x, out.y) || 1;
              const lp = add(mid, scale(out, 0.75 / len));
              return (
                <text key={`t${i}`} x={lp.x} y={lp.y} fontSize={0.6} fontWeight={800} textAnchor="middle" dominantBaseline="central" fill="var(--g-perimeter)" className="figure-text animate-pop">
                  {formatNumber(sides[i])}
                </text>
              );
            })}
            {step < 4 && <circle cx={q[step].x} cy={q[step].y} r={0.28} fill="var(--g-perimeter)" className="animate-pulse" />}
          </>
        )}

        {mode === 'luas' && (
          <>
            {/* Base shape filled */}
            <polygon points={pts(q)} fill="var(--g-area)" fillOpacity={0.28} stroke="var(--g-side)" strokeWidth={0.08} />

            {(shape === 'rectangle' || shape === 'square') &&
              cells.map((c, i) => (
                <rect
                  key={i}
                  className="cell-pop"
                  style={{ animationDelay: `${i * 25}ms` }}
                  x={c.x + 0.06}
                  y={c.y + 0.06}
                  width={0.88}
                  height={0.88}
                  rx={0.08}
                  fill="var(--g-area)"
                  fillOpacity={0.45}
                />
              ))}

            {shape === 'parallelogram' && (
              <>
                <line x1={q[3].x} y1={q[3].y} x2={extra.foot.x} y2={extra.foot.y} stroke="var(--g-height)" strokeWidth={0.08} strokeDasharray="0.25 0.15" />
                {/* Ghost of where the triangle was */}
                {step >= 1 && <polygon points={pts(tri)} fill="none" stroke="var(--g-muted)" strokeWidth={0.05} strokeDasharray="0.15 0.12" />}
                <polygon
                  points={pts(tri)}
                  fill="#f59e0b"
                  fillOpacity={0.55}
                  stroke="#b45309"
                  strokeWidth={0.07}
                  style={{ transform: step >= 1 ? `translate(${extra.shift.x}px, ${extra.shift.y}px)` : 'none', transition: 'transform 1s ease-in-out' }}
                />
              </>
            )}

            {shape === 'trapezoid' && (
              <polygon
                points={pts(q)}
                fill="#a78bfa"
                fillOpacity={0.4}
                stroke="#6d28d9"
                strokeWidth={0.07}
                style={{
                  transformBox: 'view-box',
                  transformOrigin: `${extra.mBC.x}px ${extra.mBC.y}px`,
                  transform: step >= 1 ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 1.2s ease-in-out',
                  opacity: step >= 1 ? 1 : 0.15,
                }}
              />
            )}

            {(shape === 'rhombus' || shape === 'kite') && (
              <>
                <polygon
                  points={pts(extra.box)}
                  fill="none"
                  stroke="var(--g-diagonal)"
                  strokeWidth={0.07}
                  strokeDasharray="0.3 0.18"
                  className="transition-opacity duration-700"
                  style={{ opacity: step >= 1 ? 1 : 0 }}
                />
                <g style={{ opacity: step >= 1 ? 1 : 0 }} className="transition-opacity delay-300 duration-700">
                  {/* The four outside triangles are the same size as the four inside ones. */}
                  {q.map((p, i) => {
                    const n = q[(i + 1) % 4];
                    const corner = { x: Math.abs(p.x - extra.box[0].x) < 1e-6 || Math.abs(n.x - extra.box[0].x) < 1e-6 ? extra.box[0].x : extra.box[1].x, y: Math.abs(p.y - extra.box[0].y) < 1e-6 || Math.abs(n.y - extra.box[0].y) < 1e-6 ? extra.box[0].y : extra.box[2].y };
                    return <polygon key={i} points={pts([p, corner, n])} fill="#fde68a" fillOpacity={0.6} stroke="#d97706" strokeWidth={0.04} />;
                  })}
                </g>
                <line x1={q[0].x} y1={q[0].y} x2={q[2].x} y2={q[2].y} stroke="var(--g-diagonal)" strokeWidth={0.06} />
                <line x1={q[1].x} y1={q[1].y} x2={q[3].x} y2={q[3].y} stroke="var(--g-diagonal)" strokeWidth={0.06} />
              </>
            )}
          </>
        )}
      </svg>

      <p aria-live="polite" className={`min-h-[3rem] rounded-xl bg-white/80 p-2 text-sm font-semibold dark:bg-slate-800 ${mode === 'keliling' ? 'text-orange-800 dark:text-orange-300' : 'text-blue-800 dark:text-blue-300'}`}>
        {mode === 'keliling' ? perimeterText : areaText}
      </p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
        <button type="button" className="btn-secondary min-h-[36px] px-3 text-sm" onClick={() => setRun((r) => r + 1)}>
          ↺ Ulangi animasi
        </button>
        <span>
          Satuan keliling: <b>cm</b> (garis) · satuan luas: <b>cm²</b> (petak)
        </span>
      </div>
    </div>
  );
}
