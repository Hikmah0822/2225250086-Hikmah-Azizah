/**
 * Detektif Segiempat decision tree (F06, docs/03 §5.6). Asked one question at a time.
 */
import type { ShapeId } from '../types';

export type DetectiveNode =
  | { kind: 'question'; id: string; text: string; yes: string; no: string }
  | { kind: 'result'; id: string; shape: ShapeId | 'general'; label: string; explanation: string };

export const DETECTIVE_ROOT = 'q-bisect';

export const DETECTIVE_NODES: Record<string, DetectiveNode> = {
  'q-bisect': { kind: 'question', id: 'q-bisect', text: 'Apakah kedua diagonal saling membagi dua sama panjang?', yes: 'q-equal-par', no: 'q-perp-other' },
  'q-equal-par': { kind: 'question', id: 'q-equal-par', text: 'Apakah kedua diagonal sama panjang?', yes: 'q-perp-rect', no: 'q-perp-par' },
  'q-perp-rect': { kind: 'question', id: 'q-perp-rect', text: 'Apakah kedua diagonal saling tegak lurus?', yes: 'r-square', no: 'r-rectangle' },
  'q-perp-par': { kind: 'question', id: 'q-perp-par', text: 'Apakah kedua diagonal saling tegak lurus?', yes: 'r-rhombus', no: 'r-parallelogram' },
  'q-perp-other': { kind: 'question', id: 'q-perp-other', text: 'Apakah kedua diagonal saling tegak lurus?', yes: 'q-one-bisect', no: 'q-equal-other' },
  'q-one-bisect': { kind: 'question', id: 'q-one-bisect', text: 'Apakah salah satu diagonal membagi dua sama panjang diagonal yang lain?', yes: 'r-kite', no: 'r-general' },
  'q-equal-other': { kind: 'question', id: 'q-equal-other', text: 'Apakah kedua diagonal sama panjang?', yes: 'r-trapezoid-iso', no: 'r-trapezoid' },

  'r-square': { kind: 'result', id: 'r-square', shape: 'square', label: 'Persegi', explanation: 'Diagonal saling membagi dua, sama panjang, dan tegak lurus.' },
  'r-rectangle': { kind: 'result', id: 'r-rectangle', shape: 'rectangle', label: 'Persegi Panjang', explanation: 'Diagonal saling membagi dua dan sama panjang, tetapi tidak tegak lurus.' },
  'r-rhombus': { kind: 'result', id: 'r-rhombus', shape: 'rhombus', label: 'Belah Ketupat', explanation: 'Diagonal saling membagi dua dan tegak lurus, tetapi tidak sama panjang.' },
  'r-parallelogram': { kind: 'result', id: 'r-parallelogram', shape: 'parallelogram', label: 'Jajargenjang', explanation: 'Diagonal saling membagi dua, tetapi tidak sama panjang dan tidak tegak lurus.' },
  'r-kite': { kind: 'result', id: 'r-kite', shape: 'kite', label: 'Layang-layang', explanation: 'Diagonal tegak lurus, dan hanya satu diagonal yang terbagi dua.' },
  'r-general': { kind: 'result', id: 'r-general', shape: 'general', label: 'Segiempat sembarang', explanation: 'Diagonal tegak lurus, tetapi tidak ada yang terbagi dua sama panjang.' },
  'r-trapezoid-iso': { kind: 'result', id: 'r-trapezoid-iso', shape: 'trapezoid', label: 'Trapesium sama kaki', explanation: 'Diagonal sama panjang tetapi tidak saling membagi dua (jika ada sepasang sisi sejajar).' },
  'r-trapezoid': { kind: 'result', id: 'r-trapezoid', shape: 'trapezoid', label: 'Trapesium / segiempat sembarang', explanation: 'Diagonal tidak memiliki sifat khusus. Periksa sisinya: apakah ada sepasang sisi sejajar?' },
};
