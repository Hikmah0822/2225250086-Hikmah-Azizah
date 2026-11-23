import { describe, expect, it } from 'vitest';
import { classifyQuadrilateral } from '../classify';
import { dist } from '../geometry/vector';
import { quadFromSize } from './fromSize';

const EPS = 1e-6;
const height = (q: ReturnType<typeof quadFromSize>) => (q ? Math.abs(q[3].y - q[0].y) : 0);

describe('quadFromSize', () => {
  it('keeps the rectangle ratio 6 : 4', () => {
    const q = quadFromSize('rectangle', { AB: 6, BC: 4 })!;
    expect(dist(q[0], q[1]) / dist(q[1], q[2])).toBeCloseTo(1.5, 6);
    expect(classifyQuadrilateral(q).types.includes('rectangle')).toBe(true);
  });

  it('draws a parallelogram with base 20, slanted side 13 and height 12 in proportion', () => {
    const q = quadFromSize('parallelogram', { AB: 20, BC: 13, height: 12 })!;
    const k = dist(q[0], q[1]) / 20;
    expect(height(q) / k).toBeCloseTo(12, 6);
    expect(dist(q[1], q[2]) / k).toBeCloseTo(13, 6);
    expect(classifyQuadrilateral(q).types.includes('parallelogram')).toBe(true);
  });

  it('draws an isosceles trapezoid 26 / 14 with legs 10 and height 8', () => {
    const q = quadFromSize('trapezoid-isosceles', { AB: 26, CD: 14, BC: 10, DA: 10, height: 8 })!;
    const k = dist(q[0], q[1]) / 26;
    expect(dist(q[2], q[3]) / k).toBeCloseTo(14, 6);
    expect(dist(q[1], q[2]) / k).toBeCloseTo(10, 6);
    expect(dist(q[3], q[0]) / k).toBeCloseTo(10, 6);
  });

  it('works out the trapezoid height from the legs when it is not given', () => {
    const q = quadFromSize('trapezoid-isosceles', { AB: 26, CD: 14, DA: 10 })!;
    expect(height(q) / (dist(q[0], q[1]) / 26)).toBeCloseTo(8, 6);
  });

  it('puts D above A in a right trapezoid, and AB is always the longer side', () => {
    const q = quadFromSize('trapezoid-right', { AB: 5, CD: 9, height: 4 })!;
    expect(Math.abs(q[3].x - q[0].x)).toBeLessThan(EPS);
    expect(dist(q[0], q[1])).toBeGreaterThan(dist(q[2], q[3]));
  });

  it('draws rhombus and kite from their diagonals', () => {
    const r = quadFromSize('rhombus', { AC: 8, BD: 6 })!;
    expect(dist(r[0], r[2]) / dist(r[1], r[3])).toBeCloseTo(8 / 6, 6);
    expect(classifyQuadrilateral(r).types.includes('rhombus')).toBe(true);
    const k = quadFromSize('kite', { AC: 10, BD: 6 })!;
    expect(classifyQuadrilateral(k).types.includes('kite')).toBe(true);
  });

  it('fits the drawing box and limits extreme ratios', () => {
    const q = quadFromSize('rectangle', { AB: 100, BC: 2 })!;
    const w = dist(q[0], q[1]);
    const h = dist(q[1], q[2]);
    expect(w).toBeLessThanOrEqual(11 + EPS);
    expect(w / h).toBeCloseTo(4, 6);
  });

  it('returns null for missing or impossible sizes', () => {
    expect(quadFromSize('rectangle', { AB: 6 })).toBeNull();
    expect(quadFromSize('parallelogram', { AB: -3, height: 2 })).toBeNull();
    expect(quadFromSize('trapezoid', { AB: 5, CD: 5, height: 2 })).toBeNull();
    expect(quadFromSize('kite', { AC: 4 })).toBeNull();
    expect(quadFromSize('free', { AB: 4, BC: 4 })).toBeNull();
  });
});
