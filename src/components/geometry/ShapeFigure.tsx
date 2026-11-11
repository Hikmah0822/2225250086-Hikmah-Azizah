/**
 * The geometry canvas used everywhere (lesson cards, Lab, questions, compare).
 * Draws a quadrilateral with consistent marks (CLAUDE.md §5.4) and, when `onChange`
 * is given, lets the student drag vertices or move the whole shape.
 */
import { type KeyboardEvent, type PointerEvent, useMemo, useRef, useState } from 'react';
import type { Annotation, HighlightKey, LabShapeId, Layer } from '../../types';
import { type Quad, type Vec, add, dist, nearlyEqual, scale, sub, unit } from '../../lib/geometry/vector';
import {
  VERTEX_NAMES,
  diagonalIntersection,
  footOfPerpendicular,
  interiorAngles,
  next,
  prev,
  sideLengths,
  sideVectors,
} from '../../lib/geometry/measure';
import { computeProperties, foldAxes, isParallel, supplementaryPartners } from '../../lib/geometry/predicates';
import { SHAPE_MODELS, applyDrag, applyTranslate, snap } from '../../lib/shapes';
import { formatNumber, roundPreservingSum } from '../../lib/format';
import { angleArc, arrowPath, interiorBisector, outsideLabel, pt, rightAnglePath, tickPath, vertexLabel } from './draw';

export interface ShapeFigureProps {
  shape: LabShapeId;
  quad?: Quad;
  onChange?: (q: Quad) => void;
  layers?: Layer[];
  highlight?: HighlightKey[];
  annotations?: Annotation[];
  selectedAngle?: number | null;
  onSelectAngle?: (i: number | null) => void;
  hideLabels?: boolean;
  /** Tight viewBox and no text: for small thumbnails. */
  compact?: boolean;
  /** Colour for thumbnails (fill tint + outline). Lesson/Lab figures keep the standard colours. */
  accent?: string;
  className?: string;
  ariaLabel?: string;
}

const VIEWBOX = { x: -8.5, y: -6.5, w: 17, h: 13 };
const FONT = 0.55;
const SIDE_KEYS = ['AB', 'BC', 'CD', 'DA'] as const;

type Drag = { kind: 'vertex'; index: number } | { kind: 'move'; start: Vec; startQuad: Quad };

export default function ShapeFigure({
  shape,
  quad,
  onChange,
  layers = [],
  highlight = [],
  annotations = [],
  selectedAngle = null,
  onSelectAngle,
  hideLabels = false,
  compact = false,
  accent,
  className = '',
  ariaLabel,
}: ShapeFigureProps) {
  const q = quad ?? SHAPE_MODELS[shape].initial;
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const interactive = Boolean(onChange);
  const has = (l: Layer) => layers.includes(l);
  const hl = (k: HighlightKey) => highlight.includes(k);

  const derived = useMemo(() => {
    const sides = sideLengths(q);
    const sv = sideVectors(q);
    const angles = interiorAngles(q);
    const shownAngles = roundPreservingSum(angles);
    const props = computeProperties(q);
    const o = diagonalIntersection(q);
    return { sides, sv, angles, shownAngles, props, o };
  }, [q]);

  const viewBox = useMemo(() => {
    // Interactive canvases keep the full drag area; static figures are cropped to the shape.
    if (interactive) return `${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`;
    const xs = q.map((p) => p.x);
    const ys = q.map((p) => p.y);
    const pad = compact ? 0.6 : 1.7;
    const minX = Math.min(...xs) - pad;
    const minY = Math.min(...ys) - pad;
    return `${minX} ${minY} ${Math.max(...xs) - minX + pad} ${Math.max(...ys) - minY + pad}`;
  }, [compact, interactive, q]);

  // ---------- pointer handling ----------
  const toWorld = (e: PointerEvent): Vec | null => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };

  const startVertexDrag = (index: number) => (e: PointerEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    svgRef.current?.setPointerCapture(e.pointerId);
    setDrag({ kind: 'vertex', index });
  };

  const startMove = (e: PointerEvent) => {
    if (!interactive) return;
    const w = toWorld(e);
    if (!w) return;
    svgRef.current?.setPointerCapture(e.pointerId);
    setDrag({ kind: 'move', start: w, startQuad: q });
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!drag || !onChange) return;
    const w = toWorld(e);
    if (!w) return;
    const result =
      drag.kind === 'vertex'
        ? applyDrag(shape, q, drag.index, w)
        : applyTranslate(shape, drag.startQuad, snap(sub(w, drag.start)));
    if (result) onChange(result);
  };

  const endDrag = (e: PointerEvent) => {
    if (svgRef.current?.hasPointerCapture(e.pointerId)) svgRef.current.releasePointerCapture(e.pointerId);
    setDrag(null);
  };

  const onHandleKey = (index: number) => (e: KeyboardEvent) => {
    if (!onChange) return;
    const step: Record<string, Vec> = { ArrowLeft: { x: -0.5, y: 0 }, ArrowRight: { x: 0.5, y: 0 }, ArrowUp: { x: 0, y: -0.5 }, ArrowDown: { x: 0, y: 0.5 } };
    const d = step[e.key];
    if (!d) return;
    e.preventDefault();
    const result = applyDrag(shape, q, index, add(q[index], d));
    if (result) onChange(result);
  };

  // ---------- drawing ----------
  const { sides, sv, angles, shownAngles, props, o } = derived;
  const showText = !compact;

  // Equal-length groups → tick counts.
  const sideTicks = [0, 0, 0, 0];
  if (has('sides')) {
    let group = 0;
    for (let i = 0; i < 4; i++) {
      if (sideTicks[i]) continue;
      const same = [0, 1, 2, 3].filter((j) => nearlyEqual(sides[i], sides[j]));
      if (same.length < 2) continue;
      group++;
      same.forEach((j) => (sideTicks[j] = group));
    }
  }

  // Height: perpendicular from D to line AB (parallelogram / trapezoid convention).
  const showHeight = hl('height') || annotations.some((a) => a.at === 'height');
  const foot = footOfPerpendicular(q[3], q[0], q[1]);

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      className={`block w-full select-none ${interactive ? 'touch-none' : compact ? '' : 'max-h-72'} ${className}`}
      role="img"
      aria-label={ariaLabel}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* Area highlight */}
      {hl('area') && <polygon points={q.map(pt).join(' ')} fill="var(--g-area)" fillOpacity={0.3} />}

      {/* Shape body */}
      {accent && <polygon points={q.map(pt).join(' ')} fill={accent} fillOpacity={0.18} />}
      <polygon
        points={q.map(pt).join(' ')}
        pathLength={100}
        fill={hl('area') || accent ? 'none' : 'var(--g-fill)'}
        stroke={accent ?? 'var(--g-side)'}
        strokeWidth={compact ? 0.22 : 0.09}
        strokeLinejoin="round"
        className={interactive ? (drag?.kind === 'move' ? 'cursor-grabbing' : 'cursor-grab') : ''}
        onPointerDown={startMove}
      />

      {/* Symmetry axes */}
      {has('symmetry') &&
        foldAxes(q).map((line, k) => {
          const d = unit(line.dir);
          return (
            <line
              key={`ax${k}`}
              x1={line.point.x - d.x * 30}
              y1={line.point.y - d.y * 30}
              x2={line.point.x + d.x * 30}
              y2={line.point.y + d.y * 30}
              stroke="var(--g-symmetry)"
              strokeWidth={0.07}
              strokeDasharray="0.05 0.2"
              strokeLinecap="round"
              pointerEvents="none"
            />
          );
        })}

      {/* Diagonals */}
      {(has('diagonals') || hl('AC') || hl('BD') || annotations.some((a) => a.at === 'AC' || a.at === 'BD')) && (
        <g pointerEvents="none" stroke="var(--g-diagonal)" fill="none">
          <line x1={q[0].x} y1={q[0].y} x2={q[2].x} y2={q[2].y} strokeWidth={hl('AC') ? 0.16 : 0.07} strokeDasharray={hl('AC') ? undefined : '0.3 0.18'} />
          <line x1={q[1].x} y1={q[1].y} x2={q[3].x} y2={q[3].y} strokeWidth={hl('BD') ? 0.16 : 0.07} strokeDasharray={hl('BD') ? undefined : '0.3 0.18'} />
          {has('diagonals') && o && props.convex && (
            <>
              <circle cx={o.x} cy={o.y} r={0.1} fill="var(--g-diagonal)" stroke="none" />
              {props.diagonalsPerpendicular && <path d={rightAnglePath(o, sub(q[2], o), sub(q[1], o), 0.35)} strokeWidth={0.06} />}
              {(() => {
                const acHalf = nearlyEqual(dist(q[0], o), dist(o, q[2]));
                const bdHalf = nearlyEqual(dist(q[1], o), dist(o, q[3]));
                const allEqual = acHalf && bdHalf && props.diagonalsEqual;
                const marks: string[] = [];
                if (acHalf) marks.push(tickPath(q[0], o, 1), tickPath(o, q[2], 1));
                if (bdHalf) marks.push(tickPath(q[1], o, allEqual ? 1 : 2), tickPath(o, q[3], allEqual ? 1 : 2));
                return <path d={marks.join('')} strokeWidth={0.06} />;
              })()}
            </>
          )}
        </g>
      )}

      {/* Height */}
      {showHeight && (
        <g pointerEvents="none" stroke="var(--g-height)" fill="none">
          <line x1={q[3].x} y1={q[3].y} x2={foot.x} y2={foot.y} strokeWidth={hl('height') ? 0.12 : 0.07} strokeDasharray="0.25 0.15" />
          {(() => {
            // Extend the base when the foot falls outside AB.
            const ab = dist(q[0], q[1]);
            const fa = dist(foot, q[0]);
            const fb = dist(foot, q[1]);
            const outside = fa > ab + 1e-6 || fb > ab + 1e-6;
            const nearest = fa < fb ? q[0] : q[1];
            const towardBase = unit(sub(nearest === q[0] ? q[1] : q[0], foot));
            return (
              <>
                {outside && <line x1={nearest.x} y1={nearest.y} x2={foot.x} y2={foot.y} stroke="var(--g-side)" strokeWidth={0.05} strokeDasharray="0.15 0.12" />}
                <path d={rightAnglePath(foot, sub(q[3], foot), towardBase, 0.35)} strokeWidth={0.06} />
              </>
            );
          })()}
        </g>
      )}

      {/* Side marks: equal ticks and parallel arrows */}
      {has('sides') && (
        <g pointerEvents="none" stroke="var(--g-side)" fill="none" strokeWidth={0.06} strokeLinecap="round" strokeLinejoin="round">
          {[0, 1, 2, 3].map((i) => (sideTicks[i] ? <path key={`t${i}`} d={tickPath(q[i], q[next(i)], sideTicks[i])} /> : null))}
          {(() => {
            const arrows: string[] = [];
            let count = 0;
            if (isParallel(sv[0], sv[2])) {
              count++;
              arrows.push(arrowPath(q[0], q[1], count), arrowPath(q[3], q[2], count));
            }
            if (isParallel(sv[1], sv[3])) {
              count++;
              arrows.push(arrowPath(q[0], q[3], count), arrowPath(q[1], q[2], count));
            }
            return arrows.length ? <path d={arrows.join('')} stroke="var(--g-side)" /> : null;
          })()}
        </g>
      )}

      {/* Angles */}
      {[0, 1, 2, 3].map((i) => {
        const showAll = has('angles');
        const selected = selectedAngle === i;
        const partner = showAll && selectedAngle !== null && supplementaryPartners(q, selectedAngle).includes(i);
        if (!showAll && !selected) return null;
        const isRight = nearlyEqual(angles[i], 90, 1e-6);
        const emph = selected || partner;
        const bis = interiorBisector(q[i], q[prev(i)], q[next(i)], angles[i]);
        const labelPos = add(q[i], scale(bis, 1.35));
        return (
          <g key={`ang${i}`}>
            {emph && <path d={angleArc(q[i], q[prev(i)], q[next(i)], angles[i], 0.75, true)} fill="var(--g-angle-fill)" fillOpacity={0.8} stroke="none" pointerEvents="none" />}
            {isRight ? (
              <path d={rightAnglePath(q[i], sub(q[prev(i)], q[i]), sub(q[next(i)], q[i]))} stroke="var(--g-side)" strokeWidth={0.06} fill="none" pointerEvents="none" />
            ) : (
              <path d={angleArc(q[i], q[prev(i)], q[next(i)], angles[i])} stroke="var(--g-angle)" strokeWidth={emph ? 0.1 : 0.07} fill="none" pointerEvents="none" />
            )}
            {showAll && showText && (
              <text x={labelPos.x} y={labelPos.y} fontSize={FONT * 0.85} textAnchor="middle" dominantBaseline="central" fill="var(--g-label)" fontWeight={emph ? 800 : 600} className="figure-text" pointerEvents="none">
                {shownAngles[i]}°
              </text>
            )}
            {showAll && onSelectAngle && (
              <circle
                cx={labelPos.x}
                cy={labelPos.y}
                r={0.6}
                fill="transparent"
                className="cursor-pointer"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onSelectAngle(selected ? null : i);
                }}
              >
                <title>Ketuk sudut {VERTEX_NAMES[i]}</title>
              </circle>
            )}
          </g>
        );
      })}

      {/* Highlighted sides and perimeter */}
      {hl('perimeter') && <polygon points={q.map(pt).join(' ')} fill="none" stroke="var(--g-perimeter)" strokeWidth={0.2} strokeLinejoin="round" pointerEvents="none" />}
      {SIDE_KEYS.map((k, i) =>
        hl(k) ? <line key={k} x1={q[i].x} y1={q[i].y} x2={q[next(i)].x} y2={q[next(i)].y} stroke="var(--g-perimeter)" strokeWidth={0.2} strokeLinecap="round" pointerEvents="none" /> : null,
      )}

      {/* Side lengths */}
      {has('sides') &&
        showText &&
        [0, 1, 2, 3].map((i) => {
          const p = outsideLabel(q, q[i], q[next(i)], 0.6);
          return (
            <text key={`len${i}`} x={p.x} y={p.y} fontSize={FONT * 0.85} textAnchor="middle" dominantBaseline="central" fill="var(--g-label)" fontWeight={600} className="figure-text" pointerEvents="none">
              {formatNumber(sides[i])}
            </text>
          );
        })}

      {/* Annotations placed on the figure (no split attention) */}
      {showText &&
        annotations.map((a, k) => {
          let p: Vec;
          let color = 'var(--g-label)';
          if (a.at === 'height') {
            // Put the label inside the shape (towards B) so it never collides with side DA's label.
            const mid = scale(add(q[3], foot), 0.5);
            const inward = unit(sub(q[1], foot));
            p = add(mid, scale(inward, 0.3 + 0.16 * a.text.length));
            color = 'var(--g-height)';
          } else if (a.at === 'AC' || a.at === 'BD') {
            const [s, e] = a.at === 'AC' ? [q[0], q[2]] : [q[1], q[3]];
            const along = add(s, scale(sub(e, s), 0.3));
            const n = unit({ x: -(e.y - s.y), y: e.x - s.x });
            p = add(along, scale(n, 0.45));
            color = 'var(--g-diagonal)';
          } else if (a.at.length === 2) {
            const i = SIDE_KEYS.indexOf(a.at as (typeof SIDE_KEYS)[number]);
            p = outsideLabel(q, q[i], q[next(i)], 0.6);
          } else {
            const i = VERTEX_NAMES.indexOf(a.at as (typeof VERTEX_NAMES)[number]);
            p = hideLabels ? vertexLabel(q, q[i], 0.6) : add(q[i], scale(interiorBisector(q[i], q[prev(i)], q[next(i)], angles[i]), 1.35));
          }
          return (
            <text key={`an${k}`} x={p.x} y={p.y} fontSize={FONT} textAnchor="middle" dominantBaseline="central" fill={color} fontWeight={800} className="figure-text" pointerEvents="none">
              {a.text}
            </text>
          );
        })}

      {/* Vertex letters */}
      {showText &&
        !hideLabels &&
        q.map((v, i) => {
          const p = vertexLabel(q, v, 0.62);
          return (
            <text key={`lbl${i}`} x={p.x} y={p.y} fontSize={FONT * 1.05} textAnchor="middle" dominantBaseline="central" fill="var(--g-label)" fontWeight={800} className="figure-text" pointerEvents="none">
              {VERTEX_NAMES[i]}
            </text>
          );
        })}

      {/* Drag handles: visible dot + large invisible touch target (≥ 44px) */}
      {interactive &&
        q.map((v, i) => (
          <g key={`h${i}`}>
            <circle cx={v.x} cy={v.y} r={drag?.kind === 'vertex' && drag.index === i ? 0.36 : 0.26} fill="var(--g-handle)" stroke="var(--g-bg)" strokeWidth={0.07} pointerEvents="none" />
            <circle
              cx={v.x}
              cy={v.y}
              r={0.85}
              fill="transparent"
              className="cursor-move outline-none focus-visible:stroke-[var(--g-handle)]"
              strokeWidth={0.06}
              tabIndex={0}
              role="slider"
              aria-label={`Titik ${VERTEX_NAMES[i]}. Gunakan tombol panah untuk menggeser.`}
              aria-valuetext={`x ${formatNumber(v.x)}, y ${formatNumber(-v.y)}`}
              onPointerDown={startVertexDrag(i)}
              onKeyDown={onHandleKey(i)}
            />
          </g>
        ))}
    </svg>
  );
}
