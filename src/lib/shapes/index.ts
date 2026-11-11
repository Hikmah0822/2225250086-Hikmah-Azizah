/**
 * Constrained shape models for the Lab (F02).
 *
 * Each model takes the current vertices, the index of the dragged vertex and the pointer
 * target, and returns new vertices that still belong to the same kind of shape — or null
 * when the move is not allowed. Vertex order is A, B, C, D (A bottom-left, counter-clockwise
 * on screen).
 */
import type { LabShapeId } from '../../types';
import {
  type Quad,
  type Vec,
  add,
  cross,
  dist,
  dot,
  len,
  mapQuad,
  perp,
  rotate,
  scale,
  sub,
  unit,
  vec,
} from '../geometry/vector';
import { diagonalLengths, isConvex, isSimple, sideLengths, area } from '../geometry/measure';

export interface ShapeModel {
  id: LabShapeId;
  initial: Quad;
  /** Free mode allows concave shapes; all other models require convex ones. */
  requireConvex: boolean;
  drag(q: Quad, index: number, target: Vec): Quad | null;
}

/** World area in which vertices must stay. */
export const BOUNDS = { minX: -7.5, maxX: 7.5, minY: -5.5, maxY: 5.5 };
export const MIN_LENGTH = 1;

const sign = (x: number): 1 | -1 => (x < 0 ? -1 : 1);

// ---------- Square: centre fixed, dragged vertex sets size and rotation ----------
const square: ShapeModel = {
  id: 'square',
  requireConvex: true,
  initial: [vec(-3, 3), vec(3, 3), vec(3, -3), vec(-3, -3)],
  drag(q, i, t) {
    const o = scale(add(q[0], q[2]), 0.5);
    const s = sign(cross(sub(q[0], o), sub(q[1], o)));
    const r = sub(t, o);
    return [0, 1, 2, 3].map((k) => add(o, rotate(r, ((k - i) * s * Math.PI) / 2))) as Quad;
  },
};

// ---------- Rectangle ----------
const rectangle: ShapeModel = {
  id: 'rectangle',
  requireConvex: true,
  initial: [vec(-4, 2), vec(4, 2), vec(4, -2), vec(-4, -2)],
  drag(q, i, t) {
    const [a, b, c, d] = q;
    const u = unit(sub(b, a));
    const n = unit(sub(d, a));
    const s = sign(cross(u, n));
    let p = dist(a, b);
    let l = dist(a, d);
    const build = (origin: Vec, uu: Vec, nn: Vec): Quad => [
      origin,
      add(origin, scale(uu, p)),
      add(add(origin, scale(uu, p)), scale(nn, l)),
      add(origin, scale(nn, l)),
    ];
    switch (i) {
      case 1: {
        // B sets the direction and length of AB; width is kept.
        const u2 = unit(sub(t, a));
        p = dist(a, t);
        return build(a, u2, scale(perp(u2), s));
      }
      case 3:
        l = dot(sub(t, a), n);
        return build(a, u, n);
      case 2:
        p = dot(sub(t, a), u);
        l = dot(sub(t, a), n);
        return build(a, u, n);
      default: {
        // A moves with C fixed, orientation kept.
        p = dot(sub(c, t), u);
        l = dot(sub(c, t), n);
        const origin = sub(sub(c, scale(u, p)), scale(n, l));
        return build(origin, u, n);
      }
    }
  },
};

// ---------- Parallelogram: the dragged vertex moves, its neighbour on the opposite side follows ----------
const parallelogram: ShapeModel = {
  id: 'parallelogram',
  requireConvex: true,
  initial: [vec(-5, 2.5), vec(3, 2.5), vec(5, -2.5), vec(-3, -2.5)],
  drag(q, i, t) {
    const r = [...q] as Quad;
    r[i] = t;
    // Keep vertices i+1 and i+2 fixed, recompute i-1 = i + (i+2) - (i+1).
    r[(i + 3) % 4] = add(t, sub(q[(i + 2) % 4], q[(i + 1) % 4]));
    return r;
  },
};

// ---------- Rhombus: centre O fixed, diagonals AC ⊥ BD ----------
const rhombus: ShapeModel = {
  id: 'rhombus',
  requireConvex: true,
  initial: [vec(0, 4), vec(3, 0), vec(0, -4), vec(-3, 0)],
  drag(q, i, t) {
    const o = scale(add(q[0], q[2]), 0.5);
    let e = unit(sub(q[0], o));
    let f = unit(sub(q[1], o));
    let a = dist(q[0], o);
    let b = dist(q[1], o);
    const s = sign(cross(e, f));
    if (i === 0 || i === 2) {
      a = dist(t, o);
      e = unit(i === 0 ? sub(t, o) : sub(o, t));
      f = scale(perp(e), s);
    } else {
      b = dist(t, o);
      f = unit(i === 1 ? sub(t, o) : sub(o, t));
      e = scale(perp(f), -s);
    }
    return [add(o, scale(e, a)), add(o, scale(f, b)), sub(o, scale(e, a)), sub(o, scale(f, b))];
  },
};

// ---------- Kite: symmetry axis AC, B and D are mirror images over AC ----------
const kite: ShapeModel = {
  id: 'kite',
  requireConvex: true,
  initial: [vec(0, 4.5), vec(3, -1.5), vec(0, -3.5), vec(-3, -1.5)],
  drag(q, i, target) {
    const [a, b, c] = q;
    const axis = sub(c, a);
    const d = unit(axis);
    const n = perp(d);
    const s = sign(dot(sub(b, a), n));
    let tPos = dot(sub(b, a), d) / len(axis);
    let h = Math.abs(dot(sub(b, a), n));
    let A = a;
    let C = c;
    if (i === 0) A = target;
    else if (i === 2) C = target;
    else {
      const rel = sub(target, a);
      tPos = dot(rel, d) / len(axis);
      if (tPos < 0.05 || tPos > 0.95) return null;
      h = dot(rel, n) * s * (i === 1 ? 1 : -1);
      if (h < 0.5) return null;
    }
    const axis2 = sub(C, A);
    const n2 = scale(perp(unit(axis2)), s);
    const p = add(A, scale(axis2, tPos));
    return [A, add(p, scale(n2, h)), C, sub(p, scale(n2, h))];
  },
};

// ---------- Trapezoid family: AB ∥ DC ----------
type TrapezoidKind = 'general' | 'isosceles' | 'right';

function trapezoidModel(id: LabShapeId, kind: TrapezoidKind, initial: Quad): ShapeModel {
  return {
    id,
    initial,
    requireConvex: true,
    drag(q, i, target) {
      const [a, b, c, d] = q;
      const u = unit(sub(b, a));
      const n = scale(perp(u), sign(dot(sub(d, a), perp(u))));
      const local = (p: Vec) => ({ x: dot(sub(p, a), u), y: dot(sub(p, a), n) });
      let p = dist(a, b);
      const dl = local(d);
      const cl = local(c);
      let dx = dl.x;
      let h = dl.y;
      let top = cl.x - dl.x;
      let origin = a;
      let uu = u;
      let nn = n;

      if (i === 0 || i === 1) {
        // Moving a bottom vertex rotates/resizes the base; the top keeps its local shape.
        origin = i === 0 ? target : a;
        const end = i === 0 ? b : target;
        uu = unit(sub(end, origin));
        nn = scale(perp(uu), sign(dot(n, perp(u))));
        p = dist(origin, end);
      } else {
        const t = local(target);
        h = t.y;
        if (kind === 'right') {
          if (i === 2) top = t.x;
        } else if (kind === 'isosceles') {
          top = i === 3 ? p - 2 * t.x : 2 * t.x - p;
        } else if (i === 3) {
          top = cl.x - t.x;
          dx = t.x;
        } else {
          top = t.x - dx;
        }
      }
      if (kind === 'isosceles') dx = (p - top) / 2;
      if (kind === 'right') dx = 0;

      if (h < MIN_LENGTH || top < MIN_LENGTH || Math.abs(top - p) < 0.5) return null;
      const at = (x: number, y: number) => add(add(origin, scale(uu, x)), scale(nn, y));
      return [origin, at(p, 0), at(dx + top, h), at(dx, h)];
    },
  };
}

const free: ShapeModel = {
  id: 'free',
  requireConvex: false,
  initial: [vec(-5, 3), vec(4, 3.5), vec(3, -2.5), vec(-3, -3)],
  drag(q, i, t) {
    const r = [...q] as Quad;
    r[i] = t;
    return r;
  },
};

export const SHAPE_MODELS: Record<LabShapeId, ShapeModel> = {
  square,
  rectangle,
  parallelogram,
  rhombus,
  kite,
  trapezoid: trapezoidModel('trapezoid', 'general', [vec(-5, 2.5), vec(5, 2.5), vec(2, -2.5), vec(-3, -2.5)]),
  'trapezoid-isosceles': trapezoidModel('trapezoid-isosceles', 'isosceles', [
    vec(-5, 2.5),
    vec(5, 2.5),
    vec(2.5, -2.5),
    vec(-2.5, -2.5),
  ]),
  'trapezoid-right': trapezoidModel('trapezoid-right', 'right', [vec(-4, 2.5), vec(5, 2.5), vec(1, -2.5), vec(-4, -2.5)]),
  free,
};

const inBounds = (p: Vec) => p.x >= BOUNDS.minX && p.x <= BOUNDS.maxX && p.y >= BOUNDS.minY && p.y <= BOUNDS.maxY;

/** Rejects degenerate, out-of-bounds, self-crossing (or, if required, non-convex) shapes. */
export function isValidQuad(q: Quad, requireConvex: boolean): boolean {
  if (!q.every(inBounds)) return false;
  if (q.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))) return false;
  if (sideLengths(q).some((l) => l < MIN_LENGTH)) return false;
  if (diagonalLengths(q).some((l) => l < MIN_LENGTH)) return false;
  if (area(q) < 1) return false;
  return requireConvex ? isConvex(q) : isSimple(q);
}

/** Snap a point to a 0.5 grid so measurements stay readable. */
export const snap = (p: Vec, step = 0.5): Vec => ({
  x: Math.round(p.x / step) * step,
  y: Math.round(p.y / step) * step,
});

export function applyDrag(shape: LabShapeId, q: Quad, index: number, target: Vec, snapToGrid = true): Quad | null {
  const model = SHAPE_MODELS[shape];
  const t = snapToGrid ? snap(target) : target;
  const result = model.drag(q, index, t);
  return result && isValidQuad(result, model.requireConvex) ? result : null;
}

export function applyTranslate(shape: LabShapeId, q: Quad, delta: Vec): Quad | null {
  const result = mapQuad(q, (p) => add(p, delta));
  return isValidQuad(result, SHAPE_MODELS[shape].requireConvex) ? result : null;
}

/** Rotate and scale a quad around the origin (used to show shapes in varied orientations). */
export function transformQuad(q: Quad, degrees: number, factor = 1): Quad {
  return mapQuad(q, (p) => scale(rotate(p, (degrees * Math.PI) / 180), factor));
}
