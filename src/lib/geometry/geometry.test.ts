import { describe, expect, it } from 'vitest';
import { type Quad, vec } from './vector';
import { area, diagonalIntersection, interiorAngles, isConvex, isSimple, perimeter, sideLengths } from './measure';
import { computeProperties, foldAxes, rotationOrder, supplementaryPartners } from './predicates';
import { SHAPE_MODELS } from '../shapes';

const rect: Quad = [vec(0, 0), vec(4, 0), vec(4, 3), vec(0, 3)];
const concave: Quad = [vec(0, 0), vec(4, 0), vec(1, 1), vec(0, 4)];
const bowtie: Quad = [vec(0, 0), vec(4, 4), vec(4, 0), vec(0, 4)];

describe('measure', () => {
  it('computes side lengths, perimeter and area', () => {
    expect(sideLengths(rect)).toEqual([4, 3, 4, 3]);
    expect(perimeter(rect)).toBe(14);
    expect(area(rect)).toBe(12);
  });

  it('interior angles of a convex quad sum to 360', () => {
    const angles = interiorAngles(SHAPE_MODELS.parallelogram.initial);
    expect(angles.reduce((s, a) => s + a, 0)).toBeCloseTo(360, 6);
    expect(angles[0]).toBeCloseTo(angles[2], 6);
  });

  it('detects a reflex angle in a concave quad', () => {
    const angles = interiorAngles(concave);
    expect(Math.max(...angles)).toBeGreaterThan(180);
    expect(angles.reduce((s, a) => s + a, 0)).toBeCloseTo(360, 6);
  });

  it('distinguishes convex, concave and self-crossing quads', () => {
    expect(isConvex(rect)).toBe(true);
    expect(isConvex(concave)).toBe(false);
    expect(isSimple(concave)).toBe(true);
    expect(isSimple(bowtie)).toBe(false);
  });

  it('finds where the diagonals cross', () => {
    expect(diagonalIntersection(rect)).toEqual({ x: 2, y: 1.5 });
  });
});

describe('symmetry', () => {
  // Expected values follow docs/04-spesifikasi-konten.md §3.4
  const cases: [string, Quad, number, number][] = [
    ['persegi', SHAPE_MODELS.square.initial, 4, 4],
    ['persegi panjang', SHAPE_MODELS.rectangle.initial, 2, 2],
    ['jajargenjang', SHAPE_MODELS.parallelogram.initial, 0, 2],
    ['belah ketupat', SHAPE_MODELS.rhombus.initial, 2, 2],
    ['layang-layang', SHAPE_MODELS.kite.initial, 1, 1],
    ['trapesium sama kaki', SHAPE_MODELS['trapezoid-isosceles'].initial, 1, 1],
    ['trapesium sembarang', SHAPE_MODELS.trapezoid.initial, 0, 1],
    ['trapesium siku-siku', SHAPE_MODELS['trapezoid-right'].initial, 0, 1],
  ];
  it.each(cases)('%s: simetri lipat %i, simetri putar %i', (_name, q, fold, rot) => {
    expect(foldAxes(q)).toHaveLength(fold);
    expect(rotationOrder(q)).toBe(rot);
  });
});

describe('supplementaryPartners', () => {
  it('parallelogram: both neighbours are supplementary', () => {
    expect(supplementaryPartners(SHAPE_MODELS.parallelogram.initial, 0).sort()).toEqual([1, 3]);
  });
  it('trapezoid (AB ∥ DC): only the angle across a leg', () => {
    expect(supplementaryPartners(SHAPE_MODELS.trapezoid.initial, 0)).toEqual([3]); // ∠A + ∠D
    expect(supplementaryPartners(SHAPE_MODELS.trapezoid.initial, 1)).toEqual([2]); // ∠B + ∠C
  });
  it('kite: none', () => {
    expect(supplementaryPartners(SHAPE_MODELS.kite.initial, 0)).toEqual([]);
  });
});

describe('diagonal properties (docs/04 §3.3)', () => {
  it('rhombus: perpendicular and bisecting, not equal', () => {
    const p = computeProperties(SHAPE_MODELS.rhombus.initial);
    expect(p.diagonalsPerpendicular).toBe(true);
    expect(p.diagonalsBisectEachOther).toBe(true);
    expect(p.diagonalsEqual).toBe(false);
  });

  it('kite: perpendicular, only one diagonal bisected', () => {
    const p = computeProperties(SHAPE_MODELS.kite.initial);
    expect(p.diagonalsPerpendicular).toBe(true);
    expect(p.diagonalsBisectEachOther).toBe(false);
    expect(p.oneDiagonalBisected).toBe(true);
  });

  it('rectangle: equal and bisecting, not perpendicular', () => {
    const p = computeProperties(SHAPE_MODELS.rectangle.initial);
    expect(p.diagonalsEqual).toBe(true);
    expect(p.diagonalsBisectEachOther).toBe(true);
    expect(p.diagonalsPerpendicular).toBe(false);
  });

  it('isosceles trapezoid: equal diagonals that do not bisect each other', () => {
    const p = computeProperties(SHAPE_MODELS['trapezoid-isosceles'].initial);
    expect(p.diagonalsEqual).toBe(true);
    expect(p.diagonalsBisectEachOther).toBe(false);
  });
});
