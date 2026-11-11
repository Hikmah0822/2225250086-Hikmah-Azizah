import { describe, expect, it } from 'vitest';
import { toSpeech } from './speech';

describe('toSpeech', () => {
  it('reads angles and degrees', () => {
    expect(toSpeech('Pada jajargenjang ABCD, ∠A = 65°.')).toBe('Pada jajargenjang ABCD, sudut A sama dengan 65 derajat.');
  });
  it('reads units and multiplication', () => {
    expect(toSpeech('12 cm × 5 cm')).toBe('12 sentimeter kali 5 sentimeter');
    expect(toSpeech('96 cm²')).toBe('96 sentimeter persegi');
    expect(toSpeech('Kebun 12 m × 8 m')).toBe('Kebun 12 meter kali 8 meter');
  });
  it('reads rupiah and thousands', () => {
    expect(toSpeech('Rp13.500 per buah')).toBe('13500 rupiah per buah');
    expect(toSpeech('240.000 cm²')).toBe('240000 sentimeter persegi');
  });
  it('reads fractions, decimals and diagonals', () => {
    expect(toSpeech('L = ½ × d₁ × d₂')).toBe('L sama dengan setengah kali d satu kali d dua');
    expect(toSpeech('6,5 cm')).toBe('6 koma 5 sentimeter');
  });
  it('reads division but keeps ordinary colons', () => {
    expect(toSpeech('l = 72 : 9')).toBe('l sama dengan 72 dibagi 9');
    expect(toSpeech('Diketahui: p = 9 cm')).toBe('Diketahui: p sama dengan 9 sentimeter');
  });
  it('spells out segment names', () => {
    expect(toSpeech('AB ∥ DC')).toBe('A B sejajar D C');
  });
});
