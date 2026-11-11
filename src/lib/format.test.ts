import { describe, expect, it } from 'vitest';
import { formatNumber, parseStudentNumber, roundPreservingSum } from './format';

describe('formatNumber', () => {
  it('uses a decimal comma and drops trailing zeros', () => {
    expect(formatNumber(12.5)).toBe('12,5');
    expect(formatNumber(8)).toBe('8');
    expect(formatNumber(7.3846)).toBe('7,4');
    expect(formatNumber(-0.01)).toBe('0');
  });
});

describe('roundPreservingSum', () => {
  it('keeps the angle total at 360', () => {
    const r = roundPreservingSum([89.6, 90.4, 89.6, 90.4]);
    expect(r.reduce((s, v) => s + v, 0)).toBe(360);
  });
  it('fixes values that naive rounding would sum to 359', () => {
    const tricky = [72.4, 107.4, 72.4, 107.8]; // naive: 72+107+72+108 = 359
    expect(roundPreservingSum(tricky).reduce((s, v) => s + v, 0)).toBe(360);
  });
});

describe('parseStudentNumber', () => {
  it('accepts comma and dot decimals', () => {
    expect(parseStudentNumber('12,5')).toBe(12.5);
    expect(parseStudentNumber(' 12.5 ')).toBe(12.5);
    expect(parseStudentNumber('96')).toBe(96);
  });
  it('accepts Indonesian thousands separators and rupiah', () => {
    expect(parseStudentNumber('240.000')).toBe(240000);
    expect(parseStudentNumber('Rp1.350.000')).toBe(1350000);
    expect(parseStudentNumber('Rp 1.296.000')).toBe(1296000);
    expect(parseStudentNumber('1.234,5')).toBe(1234.5);
    expect(parseStudentNumber('34,29')).toBe(34.29);
    expect(parseStudentNumber('6.5')).toBe(6.5);
  });
  it('rejects non-numbers', () => {
    expect(parseStudentNumber('')).toBeNull();
    expect(parseStudentNumber('abc')).toBeNull();
    expect(parseStudentNumber('1,2,3')).toBeNull();
  });
});
