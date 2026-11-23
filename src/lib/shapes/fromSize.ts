/**
 * Build a figure's vertices from the sizes stated in a problem, so a photographed problem is
 * drawn in its real proportions (e.g. base 20 m visibly longer than height 12 m).
 * Vertex convention as in SHAPE_MODELS (screen coordinates, y down):
 *  - rectangle, square, parallelogram, trapezoids: A bottom-left, B bottom-right, C top-right, D top-left;
 *    AB = base, CD = top side, height = distance between AB and CD.
 *  - rhombus, kite: A bottom, B right, C top, D left; AC vertical diagonal, BD horizontal diagonal.
 * Returns null when the sizes are missing or impossible; the caller then uses the default figure.
 */
import type { LabShapeId } from '../../types';
import { type Quad, vec } from '../geometry/vector';

export type SizeKey = 'AB' | 'BC' | 'CD' | 'DA' | 'AC' | 'BD' | 'height';
export type FigureSize = Partial<Record<SizeKey, number>>;

/** Drawing box (world units) and the most extreme width : height ratio still drawn. */
const BOX = { w: 11, h: 7 };
const MAX_RATIO = 4;

const ok = (n: number | undefined): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;

/** Raw vertices in problem units, before scaling. */
function raw(shape: LabShapeId, s: FigureSize): Quad | null {
  switch (shape) {
    case 'square': {
      const a = s.AB ?? s.BC ?? s.CD ?? s.DA;
      return ok(a) ? [vec(0, 0), vec(a, 0), vec(a, -a), vec(0, -a)] : null;
    }
    case 'rectangle': {
      const w = s.AB ?? s.CD;
      const h = s.BC ?? s.DA ?? s.height;
      return ok(w) && ok(h) ? [vec(0, 0), vec(w, 0), vec(w, -h), vec(0, -h)] : null;
    }
    case 'parallelogram': {
      const b = s.AB ?? s.CD;
      const side = s.BC ?? s.DA;
      // Height from the problem; without it, a side alone gives a 60° slant.
      const h = s.height ?? (ok(side) ? side * Math.sin(Math.PI / 3) : undefined);
      if (!ok(b) || !ok(h)) return null;
      const dx = ok(side) && side > h ? Math.sqrt(side * side - h * h) : 0.3 * b;
      return [vec(0, 0), vec(b, 0), vec(b + dx, -h), vec(dx, -h)];
    }
    case 'trapezoid':
    case 'trapezoid-isosceles':
    case 'trapezoid-right': {
      // AB is the longer parallel side (bottom), CD the shorter one (top).
      const [a, b] = [s.AB, s.CD].sort((x, y) => (y ?? 0) - (x ?? 0));
      if (!ok(a) || !ok(b) || a === b) return null;
      const leg = s.DA ?? s.BC;
      const h = s.height ?? (shape === 'trapezoid-isosceles' && ok(leg) && leg > (a - b) / 2 ? Math.sqrt(leg * leg - ((a - b) / 2) ** 2) : undefined);
      if (!ok(h)) return null;
      let dx = (a - b) / 2;
      if (shape === 'trapezoid-right') dx = 0;
      if (shape === 'trapezoid' && ok(s.DA) && s.DA > h) dx = Math.min(Math.sqrt(s.DA * s.DA - h * h), a - b);
      return [vec(0, 0), vec(a, 0), vec(dx + b, -h), vec(dx, -h)];
    }
    case 'rhombus':
    case 'kite': {
      const d1 = s.AC; // vertical
      const d2 = s.BD; // horizontal
      if (!ok(d1) || !ok(d2)) return null;
      // Rhombus diagonals bisect each other; a kite's cross bar sits nearer the top.
      const y = shape === 'rhombus' ? 0 : -d1 * 0.2;
      return [vec(0, d1 / 2), vec(d2 / 2, y), vec(0, -d1 / 2), vec(-d2 / 2, y)];
    }
    default:
      return null;
  }
}

export function quadFromSize(shape: LabShapeId, size: FigureSize): Quad | null {
  const q = raw(shape, size);
  if (!q) return null;
  const xs = q.map((p) => p.x);
  const ys = q.map((p) => p.y);
  let w = Math.max(...xs) - Math.min(...xs);
  let h = Math.max(...ys) - Math.min(...ys);
  if (!(w > 0 && h > 0)) return null;
  // Very long or very flat figures would leave no room for labels: limit the ratio.
  let sx = 1;
  let sy = 1;
  if (w / h > MAX_RATIO) sy = w / h / MAX_RATIO;
  if (h / w > MAX_RATIO) sx = h / w / MAX_RATIO;
  w *= sx;
  h *= sy;
  const k = Math.min(BOX.w / w, BOX.h / h);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  return q.map((p) => vec((p.x - cx) * sx * k, (p.y - cy) * sy * k)) as Quad;
}
