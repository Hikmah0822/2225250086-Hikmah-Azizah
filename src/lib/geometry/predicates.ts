import { type Quad, type Vec, EPS, add, centroid, cross, dist, dot, len, nearlyEqual, rotateAround, samePoint, scale, sub, toRad, unit } from './vector';
import { diagonalIntersection, diagonalLengths, interiorAngles, isConvex, sideLengths, sideVectors } from './measure';

export const isParallel = (u: Vec, v: Vec): boolean => Math.abs(cross(u, v)) <= EPS * len(u) * len(v);
export const isPerpendicular = (u: Vec, v: Vec): boolean => Math.abs(dot(u, v)) <= EPS * len(u) * len(v);

/** A straight line given by a point and a direction. */
export interface Line {
  point: Vec;
  dir: Vec;
}

export function reflect(p: Vec, line: Line): Vec {
  const d = unit(line.dir);
  const ap = sub(p, line.point);
  const proj = add(line.point, scale(d, dot(ap, d)));
  return sub(scale(proj, 2), p);
}

/** True when both quads contain the same set of points (any order). */
function sameVertexSet(a: Quad, b: Quad): boolean {
  const tol = 1e-5;
  return a.every((p) => b.some((q) => samePoint(p, q, tol)));
}

/**
 * Lines of (fold) symmetry. For a quadrilateral the only candidates are the two diagonals
 * and the two lines through the midpoints of opposite sides perpendicular to a side.
 */
export function foldAxes(q: Quad): Line[] {
  return candidateAxes(q).filter((line) => isFoldAxis(q, line));
}

/** The four candidate fold lines: diagonal AC, diagonal BD, and the two mid-lines. */
export function candidateAxes(q: Quad): Line[] {
  const [ab, bc] = sideVectors(q);
  return [
    { point: q[0], dir: sub(q[2], q[0]) },
    { point: q[1], dir: sub(q[3], q[1]) },
    { point: scale(add(q[0], q[1]), 0.5), dir: { x: -ab.y, y: ab.x } },
    { point: scale(add(q[1], q[2]), 0.5), dir: { x: -bc.y, y: bc.x } },
  ];
}

export const reflectQuad = (q: Quad, line: Line): Quad => q.map((p) => reflect(p, line)) as Quad;

/** Folding along `line` lands the shape exactly on itself. */
export const isFoldAxis = (q: Quad, line: Line): boolean => sameVertexSet(q, reflectQuad(q, line));

/** Turning the shape by `degrees` about its centre lands it exactly on itself. */
export function matchesAfterRotation(q: Quad, degrees: number): boolean {
  const c = centroid(q);
  return sameVertexSet(q, q.map((p) => rotateAround(p, c, toRad(degrees))) as Quad);
}

/** Order of rotational symmetry (1 means none). */
export function rotationOrder(q: Quad): 1 | 2 | 4 {
  if (matchesAfterRotation(q, 90)) return 4;
  if (matchesAfterRotation(q, 180)) return 2;
  return 1;
}

/**
 * Vertices whose angle is supplementary to the angle at `i` because the two angles are
 * co-interior angles between parallel sides (e.g. ∠A + ∠B = 180° when AD ∥ BC).
 */
export function supplementaryPartners(q: Quad, i: number): number[] {
  const sv = sideVectors(q); // side k goes from vertex k to k+1
  const s = (k: number) => sv[(k + 4) % 4];
  const partners: number[] = [];
  // Transversal is side i (i → i+1); its neighbours are sides i-1 and i+1.
  if (isParallel(s(i - 1), s(i + 1))) partners.push((i + 1) % 4);
  // Transversal is side i-1 (i-1 → i); its neighbours are sides i-2 and i.
  if (isParallel(s(i - 2), s(i))) partners.push((i + 3) % 4);
  return partners;
}

/** Live properties of an arbitrary quadrilateral, used by the Lab panel and classifier. */
export interface QuadProperties {
  allSidesEqual: boolean;
  oppositeSidesEqual: boolean;
  bothPairsParallel: boolean;
  exactlyOnePairParallel: boolean;
  /** [AB ∥ DC, BC ∥ AD] */
  parallelPairs: [boolean, boolean];
  twoPairsAdjacentEqual: boolean;
  angleSum360: boolean;
  allRightAngles: boolean;
  oppositeAnglesEqual: boolean;
  diagonalsEqual: boolean;
  diagonalsBisectEachOther: boolean;
  /** Exactly one diagonal is cut in half by the other. */
  oneDiagonalBisected: boolean;
  diagonalsPerpendicular: boolean;
  foldAxisCount: number;
  rotationOrder: 1 | 2 | 4;
  convex: boolean;
}

export function computeProperties(q: Quad): QuadProperties {
  const [ab, bc, cd, da] = sideLengths(q);
  const [vAB, vBC, vCD, vDA] = sideVectors(q);
  const angles = interiorAngles(q);
  const [ac, bd] = diagonalLengths(q);
  const o = diagonalIntersection(q);
  const convex = isConvex(q);

  const par1 = isParallel(vAB, vCD);
  const par2 = isParallel(vBC, vDA);

  let acBisected = false;
  let bdBisected = false;
  if (o && convex) {
    acBisected = nearlyEqual(dist(q[0], o), dist(o, q[2]));
    bdBisected = nearlyEqual(dist(q[1], o), dist(o, q[3]));
  }

  const right = (a: number) => nearlyEqual(a, 90);
  return {
    allSidesEqual: nearlyEqual(ab, bc) && nearlyEqual(bc, cd) && nearlyEqual(cd, da),
    oppositeSidesEqual: nearlyEqual(ab, cd) && nearlyEqual(bc, da),
    bothPairsParallel: par1 && par2,
    exactlyOnePairParallel: par1 !== par2,
    parallelPairs: [par1, par2],
    twoPairsAdjacentEqual: (nearlyEqual(ab, bc) && nearlyEqual(cd, da)) || (nearlyEqual(ab, da) && nearlyEqual(bc, cd)),
    angleSum360: nearlyEqual(angles.reduce((s, a) => s + a, 0), 360),
    allRightAngles: angles.every(right),
    oppositeAnglesEqual: nearlyEqual(angles[0], angles[2]) && nearlyEqual(angles[1], angles[3]),
    diagonalsEqual: nearlyEqual(ac, bd),
    diagonalsBisectEachOther: acBisected && bdBisected,
    oneDiagonalBisected: acBisected !== bdBisected,
    diagonalsPerpendicular: isPerpendicular(sub(q[2], q[0]), sub(q[3], q[1])),
    foldAxisCount: foldAxes(q).length,
    rotationOrder: rotationOrder(q),
    convex,
  };
}
