import { type Quad, type Vec, EPS, cross, dist, dot, len, sub, toDeg } from './vector';

/** Side names in vertex order. */
export const SIDE_NAMES = ['AB', 'BC', 'CD', 'DA'] as const;
export type SideName = (typeof SIDE_NAMES)[number];
export const VERTEX_NAMES = ['A', 'B', 'C', 'D'] as const;

export const next = (i: number): number => (i + 1) % 4;
export const prev = (i: number): number => (i + 3) % 4;

/** Side lengths [AB, BC, CD, DA]. */
export function sideLengths(q: Quad): [number, number, number, number] {
  return [dist(q[0], q[1]), dist(q[1], q[2]), dist(q[2], q[3]), dist(q[3], q[0])];
}

/** Side vectors following vertex order: AB, BC, CD, DA. */
export function sideVectors(q: Quad): [Vec, Vec, Vec, Vec] {
  return [sub(q[1], q[0]), sub(q[2], q[1]), sub(q[3], q[2]), sub(q[0], q[3])];
}

/** Shoelace formula. Sign depends on vertex orientation. */
export function signedArea(q: Quad): number {
  let s = 0;
  for (let i = 0; i < 4; i++) s += cross(q[i], q[next(i)]);
  return s / 2;
}

export const area = (q: Quad): number => Math.abs(signedArea(q));

export const perimeter = (q: Quad): number => sideLengths(q).reduce((a, b) => a + b, 0);

/** Interior angles in degrees at A, B, C, D. Handles concave (reflex) vertices. */
export function interiorAngles(q: Quad): [number, number, number, number] {
  const orientation = Math.sign(signedArea(q)) || 1;
  const result = [0, 0, 0, 0] as [number, number, number, number];
  for (let i = 0; i < 4; i++) {
    const toPrev = sub(q[prev(i)], q[i]);
    const toNext = sub(q[next(i)], q[i]);
    const cos = dot(toPrev, toNext) / (len(toPrev) * len(toNext));
    const unsigned = toDeg(Math.acos(Math.max(-1, Math.min(1, cos))));
    const turn = cross(sub(q[i], q[prev(i)]), sub(q[next(i)], q[i]));
    const convex = Math.sign(turn) === orientation || Math.abs(turn) < EPS;
    result[i] = convex ? unsigned : 360 - unsigned;
  }
  return result;
}

/** Diagonal lengths [AC, BD]. */
export const diagonalLengths = (q: Quad): [number, number] => [dist(q[0], q[2]), dist(q[1], q[3])];

/** Intersection of lines AC and BD, or null when they are parallel. */
export function diagonalIntersection(q: Quad): Vec | null {
  return lineIntersection(q[0], q[2], q[1], q[3]);
}

export function lineIntersection(p1: Vec, p2: Vec, p3: Vec, p4: Vec): Vec | null {
  const r = sub(p2, p1);
  const s = sub(p4, p3);
  const denom = cross(r, s);
  if (Math.abs(denom) < EPS * len(r) * len(s)) return null;
  const t = cross(sub(p3, p1), s) / denom;
  return { x: p1.x + r.x * t, y: p1.y + r.y * t };
}

/** Proper (crossing) intersection of segments p1p2 and p3p4. */
export function segmentsCross(p1: Vec, p2: Vec, p3: Vec, p4: Vec): boolean {
  const d1 = cross(sub(p4, p3), sub(p1, p3));
  const d2 = cross(sub(p4, p3), sub(p2, p3));
  const d3 = cross(sub(p2, p1), sub(p3, p1));
  const d4 = cross(sub(p2, p1), sub(p4, p1));
  return d1 * d2 < 0 && d3 * d4 < 0;
}

/** A simple quadrilateral has no crossing sides. */
export function isSimple(q: Quad): boolean {
  return !segmentsCross(q[0], q[1], q[2], q[3]) && !segmentsCross(q[1], q[2], q[3], q[0]);
}

/** Strictly convex: every turn has the same non-zero sign. */
export function isConvex(q: Quad): boolean {
  let sign = 0;
  for (let i = 0; i < 4; i++) {
    const t = cross(sub(q[next(i)], q[i]), sub(q[next(next(i))], q[next(i)]));
    if (Math.abs(t) < EPS) return false;
    const s = Math.sign(t);
    if (sign === 0) sign = s;
    else if (s !== sign) return false;
  }
  return true;
}

/** Foot of the perpendicular from p onto the line through a and b. */
export function footOfPerpendicular(p: Vec, a: Vec, b: Vec): Vec {
  const ab = sub(b, a);
  const t = dot(sub(p, a), ab) / dot(ab, ab);
  return { x: a.x + ab.x * t, y: a.y + ab.y * t };
}
