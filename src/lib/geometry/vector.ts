/** 2D vector helpers. World coordinates follow SVG: x to the right, y downward. */
export interface Vec {
  x: number;
  y: number;
}

/** Quadrilateral vertices in order A, B, C, D. */
export type Quad = [Vec, Vec, Vec, Vec];

/** Relative tolerance for exact geometric predicates. */
export const EPS = 1e-6;

export const vec = (x: number, y: number): Vec => ({ x, y });
export const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
export const scale = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k });
export const dot = (a: Vec, b: Vec): number => a.x * b.x + a.y * b.y;
export const cross = (a: Vec, b: Vec): number => a.x * b.y - a.y * b.x;
export const len = (a: Vec): number => Math.hypot(a.x, a.y);
export const dist = (a: Vec, b: Vec): number => len(sub(a, b));
export const midpoint = (a: Vec, b: Vec): Vec => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
/** Rotate +90° (cross(v, perp(v)) > 0). */
export const perp = (a: Vec): Vec => ({ x: -a.y, y: a.x });

export function unit(a: Vec): Vec {
  const l = len(a);
  return l === 0 ? { x: 0, y: 0 } : { x: a.x / l, y: a.y / l };
}

export function rotate(a: Vec, radians: number): Vec {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  return { x: a.x * c - a.y * s, y: a.x * s + a.y * c };
}

export function rotateAround(p: Vec, center: Vec, radians: number): Vec {
  return add(center, rotate(sub(p, center), radians));
}

/** Equality with a tolerance relative to the magnitude of the values. */
export function nearlyEqual(a: number, b: number, tol = EPS): boolean {
  return Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
}

export function samePoint(a: Vec, b: Vec, tol = EPS): boolean {
  return nearlyEqual(a.x, b.x, tol) && nearlyEqual(a.y, b.y, tol);
}

export const centroid = (q: Quad): Vec => ({
  x: (q[0].x + q[1].x + q[2].x + q[3].x) / 4,
  y: (q[0].y + q[1].y + q[2].y + q[3].y) / 4,
});

export const mapQuad = (q: Quad, f: (v: Vec) => Vec): Quad => [f(q[0]), f(q[1]), f(q[2]), f(q[3])];

export const toRad = (deg: number): number => (deg * Math.PI) / 180;
export const toDeg = (rad: number): number => (rad * 180) / Math.PI;
