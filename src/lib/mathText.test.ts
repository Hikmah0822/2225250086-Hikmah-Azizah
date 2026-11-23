import { describe, expect, it } from 'vitest';
import { splitMath } from './mathText';

describe('splitMath', () => {
  it('turns a/b into a stacked fraction', () => {
    expect(splitMath('Jumlah mobil = 240/7 ≈ 34,29')).toEqual([
      { kind: 'text', text: 'Jumlah mobil = ' },
      { kind: 'frac', num: '240', den: '7' },
      { kind: 'text', text: ' ≈ 34,29' },
    ]);
  });

  it('handles spaces, decimals, words and parentheses', () => {
    expect(splitMath('24 / 0,16')).toEqual([{ kind: 'frac', num: '24', den: '0,16' }]);
    expect(splitMath('(14 + 26)/2')).toEqual([{ kind: 'frac', num: '14 + 26', den: '2' }]);
    expect(splitMath('L = 1/2 × d1 × d2')[1]).toEqual({ kind: 'frac', num: '1', den: '2' });
  });

  it('turns ½ and ¾ into fractions', () => {
    expect(splitMath('L = ½ × (a + b) × t')).toEqual([
      { kind: 'text', text: 'L = ' },
      { kind: 'frac', num: '1', den: '2' },
      { kind: 'text', text: ' × (a + b) × t' },
    ]);
    expect(splitMath('¾')).toEqual([{ kind: 'frac', num: '3', den: '4' }]);
  });

  it('writes a unit rate as "per", not as a fraction', () => {
    expect(splitMath('Toko A: Rp9.000/buah')).toEqual([{ kind: 'text', text: 'Toko A: Rp9.000 per buah' }]);
    expect(splitMath('biaya Rp12.000/m²')).toEqual([{ kind: 'text', text: 'biaya Rp12.000 per m²' }]);
  });

  it('keeps thousands separators inside a fraction', () => {
    expect(splitMath('1.350.000/150 = 9.000')).toEqual([
      { kind: 'frac', num: '1.350.000', den: '150' },
      { kind: 'text', text: ' = 9.000' },
    ]);
  });

  it('stacks a word formula in brackets, but never splits a lone word pair', () => {
    expect(splitMath('(Luas lantai / Luas keramik) × harga')).toEqual([
      { kind: 'frac', num: 'Luas lantai', den: 'Luas keramik' },
      { kind: 'text', text: ' × harga' },
    ]);
    expect(splitMath('lantai/keramik')).toEqual([{ kind: 'text', text: 'lantai per keramik' }]);
    expect(splitMath('Total Rp1.296.000')).toEqual([{ kind: 'text', text: 'Total Rp1.296.000' }]);
  });

  it('leaves text without fractions unchanged', () => {
    expect(splitMath('L = 20 × 12 = 240 m²')).toEqual([{ kind: 'text', text: 'L = 20 × 12 = 240 m²' }]);
    expect(splitMath('')).toEqual([]);
  });
});
