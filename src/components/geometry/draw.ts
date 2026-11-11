/** SVG path builders for standard geometry marks (docs/04 §2). World units. */
import { type Quad, type Vec, add, centroid, cross, dot, len, perp, scale, sub, unit } from '../../lib/geometry/vector';

export const pt = (p: Vec) => `${p.x.toFixed(3)} ${p.y.toFixed(3)}`;

/** n short ticks across the middle of segment ab (equal-length mark). */
export function tickPath(a: Vec, b: Vec, n: number, size = 0.32, gap = 0.16): string {
  const d = unit(sub(b, a));
  const nrm = perp(d);
  const mid = scale(add(a, b), 0.5);
  let path = '';
  for (let k = 0; k < n; k++) {
    const c = add(mid, scale(d, (k - (n - 1) / 2) * gap));
    path += `M${pt(add(c, scale(nrm, size / 2)))}L${pt(sub(c, scale(nrm, size / 2)))}`;
  }
  return path;
}

/** n chevrons in the middle of ab pointing from a to b (parallel mark). */
export function arrowPath(a: Vec, b: Vec, n: number, size = 0.24, gap = 0.2): string {
  const d = unit(sub(b, a));
  const nrm = perp(d);
  const mid = scale(add(a, b), 0.5);
  let path = '';
  for (let k = 0; k < n; k++) {
    const tip = add(mid, scale(d, (k - (n - 1) / 2) * gap + size / 2));
    const back = sub(tip, scale(d, size));
    path += `M${pt(add(back, scale(nrm, size * 0.8)))}L${pt(tip)}L${pt(sub(back, scale(nrm, size * 0.8)))}`;
  }
  return path;
}

/** Small square at `corner` between directions u and v. */
export function rightAnglePath(corner: Vec, u: Vec, v: Vec, size = 0.42): string {
  const a = add(corner, scale(unit(u), size));
  const c = add(corner, scale(unit(v), size));
  const b = add(a, scale(unit(v), size));
  return `M${pt(a)}L${pt(b)}L${pt(c)}`;
}

/** Arc for the interior angle at vertex v (from towards prev to towards next). */
export function angleArc(v: Vec, prev: Vec, next: Vec, interiorDeg: number, r = 0.75, sector = false): string {
  const toPrev = unit(sub(prev, v));
  const toNext = unit(sub(next, v));
  const start = add(v, scale(toPrev, r));
  const end = add(v, scale(toNext, r));
  const reflex = interiorDeg > 180;
  const shortIsPositive = cross(toPrev, toNext) > 0;
  const sweep = reflex ? (shortIsPositive ? 0 : 1) : shortIsPositive ? 1 : 0;
  const arc = `A${r} ${r} 0 ${reflex ? 1 : 0} ${sweep} ${pt(end)}`;
  return sector ? `M${pt(v)}L${pt(start)}${arc}Z` : `M${pt(start)}${arc}`;
}

/** Unit vector along the interior angle bisector at vertex v. */
export function interiorBisector(v: Vec, prev: Vec, next: Vec, interiorDeg: number): Vec {
  const a = unit(sub(prev, v));
  const b = unit(sub(next, v));
  let bis = add(a, b);
  if (len(bis) < 1e-6) bis = perp(a);
  bis = unit(bis);
  return interiorDeg > 180 ? scale(bis, -1) : bis;
}

/** Point beside the middle of side ab, on the outside of the shape. */
export function outsideLabel(q: Quad, a: Vec, b: Vec, offset = 0.55): Vec {
  const mid = scale(add(a, b), 0.5);
  let n = perp(unit(sub(b, a)));
  if (dot(n, sub(mid, centroid(q))) < 0) n = scale(n, -1);
  return add(mid, scale(n, offset));
}

/** Position for a vertex letter, pushed away from the centre. */
export function vertexLabel(q: Quad, v: Vec, offset = 0.6): Vec {
  return add(v, scale(unit(sub(v, centroid(q))), offset));
}
