import { describe, expect, it } from 'vitest';
import { NAME_MAX, cleanName, firstName } from './profileStore';

describe('profile helpers', () => {
  it('cleans spaces and limits length', () => {
    expect(cleanName('  Siti   Nur  Aisyah ')).toBe('Siti Nur Aisyah');
    expect(cleanName('a'.repeat(100))).toHaveLength(NAME_MAX);
  });
  it('takes the first name for the greeting', () => {
    expect(firstName('Siti Nur Aisyah')).toBe('Siti');
    expect(firstName('  Budi ')).toBe('Budi');
    expect(firstName('')).toBe('');
  });
});
