import { describe, expect, it } from 'vitest';
import type { LabShapeId, ShapeId } from '../../types';
import { type Quad, vec } from '../geometry/vector';
import { applyDrag, applyTranslate, isValidQuad, SHAPE_MODELS } from '.';
import { classifyQuadrilateral } from '../classify';
import { area } from '../geometry/measure';

/** Pseudo-random but deterministic drag targets. */
function* targets(n: number) {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < n; i++) yield { index: Math.floor(rnd() * 4), target: vec(rnd() * 14 - 7, rnd() * 10 - 5) };
}

const expectedType: Record<Exclude<LabShapeId, 'free'>, ShapeId> = {
  square: 'square',
  rectangle: 'rectangle',
  parallelogram: 'parallelogram',
  rhombus: 'rhombus',
  kite: 'kite',
  trapezoid: 'trapezoid',
  'trapezoid-isosceles': 'trapezoid',
  'trapezoid-right': 'trapezoid',
};

describe('shape models keep their type while dragged', () => {
  for (const [shape, type] of Object.entries(expectedType) as [Exclude<LabShapeId, 'free'>, ShapeId][]) {
    it(`${shape} stays a ${type}`, () => {
      let q: Quad = SHAPE_MODELS[shape].initial;
      expect(isValidQuad(q, true)).toBe(true);
      let accepted = 0;
      for (const { index, target } of targets(400)) {
        const next = applyDrag(shape, q, index, target);
        if (!next) continue;
        accepted++;
        q = next;
        const c = classifyQuadrilateral(q);
        expect(c.types).toContain(type);
        if (shape === 'trapezoid-isosceles') expect(c.trapezoidKind).toBe('isosceles');
      }
      // The model must actually let the student move things.
      expect(accepted).toBeGreaterThan(20);
    });
  }

  it('rejects moves that leave the canvas', () => {
    expect(applyDrag('rectangle', SHAPE_MODELS.rectangle.initial, 2, vec(50, 50))).toBeNull();
  });

  it('free mode rejects self-crossing quads', () => {
    const q = SHAPE_MODELS.free.initial;
    // Moving C to the far left makes BC cross DA.
    expect(applyDrag('free', q, 2, vec(-6, -1))).toBeNull();
  });

  it('translation keeps area', () => {
    const q = SHAPE_MODELS.kite.initial;
    const moved = applyTranslate('kite', q, vec(1, 0.5));
    expect(moved).not.toBeNull();
    expect(area(moved!)).toBeCloseTo(area(q), 9);
  });
});
