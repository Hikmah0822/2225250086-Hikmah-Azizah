import type { ShapeId } from '../../types';
import type { Quad } from '../geometry/vector';
import { interiorAngles, sideLengths } from '../geometry/measure';
import { computeProperties } from '../geometry/predicates';
import { nearlyEqual } from '../geometry/vector';

export type TrapezoidKind = 'isosceles' | 'right' | 'general';

export interface Classification {
  /** Every shape the quad belongs to (inclusive definitions, see docs/04 §1). */
  types: ShapeId[];
  /** The most specific name, for display. */
  mostSpecific: ShapeId | 'general';
  trapezoidKind?: TrapezoidKind;
}

const SPECIFICITY: ShapeId[] = ['square', 'rectangle', 'rhombus', 'parallelogram', 'kite', 'trapezoid'];

export function classifyQuadrilateral(q: Quad): Classification {
  const p = computeProperties(q);
  const types: ShapeId[] = [];
  if (!p.convex) return { types, mostSpecific: 'general' };

  const isParallelogram = p.bothPairsParallel;
  const isRectangle = isParallelogram && p.allRightAngles;
  const isRhombus = isParallelogram && p.allSidesEqual;
  if (isRectangle && isRhombus) types.push('square');
  if (isRectangle) types.push('rectangle');
  if (isRhombus) types.push('rhombus');
  if (isParallelogram) types.push('parallelogram');
  if (p.twoPairsAdjacentEqual) types.push('kite');

  let trapezoidKind: TrapezoidKind | undefined;
  if (p.exactlyOnePairParallel) {
    types.push('trapezoid');
    const [ab, bc, cd, da] = sideLengths(q);
    // Legs are the non-parallel sides.
    const legsEqual = p.parallelPairs[0] ? nearlyEqual(bc, da) : nearlyEqual(ab, cd);
    const hasRight = interiorAngles(q).some((a) => nearlyEqual(a, 90));
    trapezoidKind = legsEqual ? 'isosceles' : hasRight ? 'right' : 'general';
  }

  const mostSpecific = SPECIFICITY.find((s) => types.includes(s)) ?? 'general';
  return { types, mostSpecific, trapezoidKind };
}
