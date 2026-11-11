/**
 * Guided exploration tasks for the Lab (docs/03 §5.1). Unguided simulation adds
 * extraneous load, so every shape gets one short task with self-explanation feedback.
 */
import type { ChoiceOption, LabShapeId, Layer } from '../types';

export interface LabTask {
  shape: LabShapeId;
  layers: Layer[];
  instruction: string;
  question: string;
  options: ChoiceOption[];
  answer: string[];
  summary: string;
}

export const LAB_TASKS: Partial<Record<LabShapeId, LabTask>> = {
  square: {
    shape: 'square',
    layers: ['diagonals'],
    instruction: 'Geser salah satu titik sudut persegi.',
    question: 'Apa yang selalu berlaku pada diagonal persegi?',
    options: [
      { id: 'a', text: 'Sama panjang', feedback: '' },
      { id: 'b', text: 'Saling tegak lurus', feedback: '' },
      { id: 'c', text: 'Saling membagi dua sama panjang', feedback: '' },
      { id: 'd', text: 'Sama panjang dengan sisinya', feedback: 'Diagonal persegi lebih panjang dari sisinya.' },
    ],
    answer: ['a', 'b', 'c'],
    summary: 'Diagonal persegi memiliki ketiga sifat: sama panjang, tegak lurus, dan saling membagi dua.',
  },
  rectangle: {
    shape: 'rectangle',
    layers: ['diagonals'],
    instruction: 'Geser titik B atau C untuk mengubah ukuran persegi panjang.',
    question: 'Apa yang selalu berlaku pada diagonalnya?',
    options: [
      { id: 'a', text: 'Sama panjang', feedback: '' },
      { id: 'b', text: 'Saling membagi dua sama panjang', feedback: '' },
      { id: 'c', text: 'Saling tegak lurus', feedback: 'Lihat tanda di titik potong. Tidak ada tanda siku-siku, kecuali saat bangunnya menjadi persegi.' },
    ],
    answer: ['a', 'b'],
    summary: 'Diagonal persegi panjang sama panjang dan saling membagi dua, tetapi tidak tegak lurus.',
  },
  parallelogram: {
    shape: 'parallelogram',
    layers: ['angles'],
    instruction: 'Ketuk sudut A, lalu geser titik D ke kiri dan ke kanan.',
    question: 'Apa yang selalu berlaku?',
    options: [
      { id: 'a', text: '∠A + ∠B = 180°', feedback: '' },
      { id: 'b', text: '∠A = ∠C', feedback: '' },
      { id: 'c', text: 'Semua sudut 90°', feedback: 'Itu hanya terjadi jika jajargenjangnya menjadi persegi panjang.' },
    ],
    answer: ['a', 'b'],
    summary: 'Sudut berdekatan jajargenjang berjumlah 180°, sudut berhadapan sama besar.',
  },
  rhombus: {
    shape: 'rhombus',
    layers: ['diagonals'],
    instruction: 'Geser titik A ke mana saja.',
    question: 'Apa yang selalu terjadi pada kedua diagonal belah ketupat?',
    options: [
      { id: 'a', text: 'Sama panjang', feedback: 'Diagonal belah ketupat hanya sama panjang jika bangunnya menjadi persegi.', misconception: 'M04' },
      { id: 'b', text: 'Saling tegak lurus', feedback: '' },
      { id: 'c', text: 'Saling membagi dua sama panjang', feedback: '' },
    ],
    answer: ['b', 'c'],
    summary: 'Diagonal belah ketupat tegak lurus dan saling membagi dua. Ingat, pada layang-layang hanya satu diagonal yang terbagi dua.',
  },
  kite: {
    shape: 'kite',
    layers: ['diagonals'],
    instruction: 'Geser titik B ke atas dan ke bawah.',
    question: 'Apa yang selalu terjadi?',
    options: [
      { id: 'a', text: 'Diagonal saling tegak lurus', feedback: '' },
      { id: 'b', text: 'BD dibagi dua sama panjang oleh AC', feedback: '' },
      { id: 'c', text: 'AC dibagi dua sama panjang oleh BD', feedback: 'Perhatikan AO dan OC. Keduanya hanya sama jika bangunnya menjadi belah ketupat.', misconception: 'M05' },
      { id: 'd', text: 'Diagonal sama panjang', feedback: 'Panjang AC dan BD berubah sendiri-sendiri.' },
    ],
    answer: ['a', 'b'],
    summary: 'Diagonal layang-layang tegak lurus, dan hanya satu diagonal (BD) yang dibagi dua sama panjang.',
  },
  trapezoid: {
    shape: 'trapezoid',
    layers: ['angles'],
    instruction: 'Ketuk sudut A, lalu geser titik D.',
    question: 'Pasangan sudut mana yang selalu berjumlah 180°?',
    options: [
      { id: 'a', text: '∠A + ∠D', feedback: '' },
      { id: 'b', text: '∠B + ∠C', feedback: '' },
      { id: 'c', text: '∠A + ∠B', feedback: '∠A dan ∠B tidak berada di antara sisi sejajar.', misconception: 'M08' },
    ],
    answer: ['a', 'b'],
    summary: 'Hanya pasangan sudut di antara sisi sejajar (AB ∥ DC) yang berjumlah 180°.',
  },
};
