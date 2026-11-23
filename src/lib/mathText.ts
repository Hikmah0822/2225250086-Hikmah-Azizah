/**
 * Split text into plain parts and fractions, so "240/7" or "1/2 × (14 + 26) × 8" can be shown
 * as a stacked fraction (numerator over denominator) like in a textbook, not with a slash.
 * Only numbers, single-letter variables (a, t, d1) and bracketed expressions become fractions.
 * A rate such as "Rp9.000/buah" or "Rp12.000/m²" is written as "Rp9.000 per buah".
 */
export type MathPart = { kind: 'text'; text: string } | { kind: 'frac'; num: string; den: string };

const VULGAR: Record<string, [string, string]> = {
  '½': ['1', '2'],
  '⅓': ['1', '3'],
  '⅔': ['2', '3'],
  '¼': ['1', '4'],
  '¾': ['3', '4'],
};

// Numbers in Indonesian format: 1.350.000 or 0,25; a single-letter variable (optionally d1, d₂);
// or an expression in brackets.
const NUM = String.raw`\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?`;
const VAR = String.raw`[A-Za-z](?:[0-9₁₂])?`;
const OPERAND = String.raw`\([^()]{1,60}\)|${NUM}|${VAR}`;
// Not inside a longer token on either side (so "Rp9.000/buah" or "lantai/Luas" never match).
// A word formula in brackets, "(Luas lantai / Luas keramik)", is also written stacked.
const WORDS = String.raw`[A-Za-z][A-Za-z ]{0,38}[A-Za-z]`;
const FRACTION = new RegExp(
  String.raw`\((${WORDS})\s+/\s+(${WORDS})\)|(?<![\w.,²³])(${OPERAND})\s*/\s*(${OPERAND})(?![\w²³])|([½⅓⅔¼¾])`,
  'g',
);
// "…/buah", "…/m²": a unit rate, read as "per".
const RATE = /(\S)\/(?=[A-Za-z])/g;

/** Outer parentheses are not needed once the fraction bar groups the expression. */
const unwrap = (s: string) => (/^\([^()]*\)$/.test(s) ? s.slice(1, -1).trim() : s);

const text = (t: string): MathPart => ({ kind: 'text', text: t.replace(RATE, '$1 per ') });

export function splitMath(input: string): MathPart[] {
  const parts: MathPart[] = [];
  let last = 0;
  for (const m of input.matchAll(FRACTION)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(text(input.slice(last, at)));
    if (m[5]) {
      const [num, den] = VULGAR[m[5]];
      parts.push({ kind: 'frac', num, den });
    } else if (m[1]) {
      parts.push({ kind: 'frac', num: m[1].trim(), den: m[2].trim() });
    } else {
      parts.push({ kind: 'frac', num: unwrap(m[3]), den: unwrap(m[4]) });
    }
    last = at + m[0].length;
  }
  if (last < input.length) parts.push(text(input.slice(last)));
  return parts;
}
