import { describe, expect, it } from 'vitest';
import { vec } from '../geometry/vector';
import { classifyQuadrilateral } from '.';
import { SHAPE_MODELS, transformQuad } from '../shapes';

describe('classifyQuadrilateral (inclusive definitions)', () => {
  it('a square is also a rectangle, rhombus, parallelogram and kite', () => {
    const c = classifyQuadrilateral(SHAPE_MODELS.square.initial);
    expect(c.mostSpecific).toBe('square');
    expect(c.types.sort()).toEqual(['kite', 'parallelogram', 'rectangle', 'rhombus', 'square']);
  });

  it('a rhombus is also a parallelogram and kite, but not a rectangle', () => {
    const c = classifyQuadrilateral(SHAPE_MODELS.rhombus.initial);
    expect(c.mostSpecific).toBe('rhombus');
    expect(c.types).toContain('kite');
    expect(c.types).not.toContain('rectangle');
  });

  it('a kite is not a parallelogram', () => {
    const c = classifyQuadrilateral(SHAPE_MODELS.kite.initial);
    expect(c.types).toEqual(['kite']);
  });

  it('a trapezoid is not a parallelogram and knows its kind', () => {
    expect(classifyQuadrilateral(SHAPE_MODELS.trapezoid.initial)).toMatchObject({ types: ['trapezoid'], trapezoidKind: 'general' });
    expect(classifyQuadrilateral(SHAPE_MODELS['trapezoid-right'].initial).trapezoidKind).toBe('right');
    expect(classifyQuadrilateral(SHAPE_MODELS['trapezoid-isosceles'].initial).trapezoidKind).toBe('isosceles');
  });

  it('works regardless of orientation', () => {
    const c = classifyQuadrilateral(transformQuad(SHAPE_MODELS.rectangle.initial, 37, 0.8));
    expect(c.mostSpecific).toBe('rectangle');
  });

  it('a general quadrilateral has no special type', () => {
    expect(classifyQuadrilateral([vec(0, 0), vec(5, 0), vec(4, 3), vec(1, 4)]).mostSpecific).toBe('general');
  });

  it('a concave quadrilateral is not classified', () => {
    expect(classifyQuadrilateral([vec(0, 0), vec(4, 0), vec(1, 1), vec(0, 4)]).types).toEqual([]);
  });
});
