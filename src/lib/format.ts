/** Format a number the Indonesian way: decimal comma, trailing zeros removed. */
export function formatNumber(value: number, decimals = 1): string {
  const factor = 10 ** decimals;
  let rounded = Math.round(value * factor) / factor;
  if (Object.is(rounded, -0)) rounded = 0;
  return rounded.toLocaleString('id-ID', { maximumFractionDigits: decimals, useGrouping: false });
}

export const formatLength = (value: number, unit = ''): string => `${formatNumber(value, 1)}${unit ? ` ${unit}` : ''}`;

/**
 * Round angles to whole degrees while keeping their sum equal to the rounded total
 * (largest-remainder method), so the four angles shown always add up to 360°.
 */
export function roundPreservingSum(values: number[]): number[] {
  const target = Math.round(values.reduce((s, v) => s + v, 0));
  const floors = values.map(Math.floor);
  let remaining = target - floors.reduce((s, v) => s + v, 0);
  const order = values
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  const result = [...floors];
  for (const { i } of order) {
    if (remaining <= 0) break;
    result[i] += 1;
    remaining -= 1;
  }
  return result;
}

/**
 * Parse a number typed by a student. Accepts "12,5" and "12.5" as decimals, Indonesian
 * thousands separators ("240.000", "1.350.000", "1.234,5") and an optional "Rp" prefix.
 */
export function parseStudentNumber(input: string): number | null {
  let s = input.trim().replace(/\s/g, '').replace(/^rp\.?/i, '');
  if (s.includes('.') && s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  else s = s.replace(',', '.');
  if (s === '' || !/^-?\d*\.?\d+$/.test(s)) return null;
  return Number(s);
}
