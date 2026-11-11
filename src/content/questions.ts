/**
 * Question bank (F07). Schema: src/types (docs/04 §6).
 * Every answer must match docs/04-spesifikasi-konten.md. Misconception codes: docs/04 §5.
 *
 * Order within a shape follows fading: example → completion → independent.
 */
import type { ChoiceOption, Question } from '../types';
import { EXTRA_QUESTIONS } from './questionsExtra';

const TF = (correct: boolean, ifTrue: string, ifFalse: string, misconception?: ChoiceOption['misconception']): Pick<
  Extract<Question, { type: 'multiple-choice' }>,
  'options' | 'answer'
> => ({
  options: [
    { id: 'true', text: 'Benar', feedback: ifTrue, misconception: correct ? undefined : misconception },
    { id: 'false', text: 'Salah', feedback: ifFalse, misconception: correct ? misconception : undefined },
  ],
  answer: correct ? 'true' : 'false',
});

const CORE_QUESTIONS: Question[] = [
  // ───────────── Persegi panjang ─────────────
  {
    id: 'PP-1', shape: 'rectangle', concept: 'area', objective: 'TP5', level: 'example', difficulty: 1, type: 'numeric',
    stem: 'Sebuah persegi panjang memiliki panjang 12 cm dan lebar 5 cm. Berapa luasnya?',
    figure: { shape: 'rectangle', highlight: ['area'], annotations: [{ at: 'AB', text: '12 cm' }, { at: 'BC', text: '5 cm' }] },
    answer: 60, unit: 'cm²',
    hints: ['Luas adalah isi daerah di dalam bangun.', 'L = p × l', 'Kalikan panjang dengan lebar.'],
    solutionSteps: ['Diketahui p = 12 cm dan l = 5 cm.', 'Rumus luas persegi panjang: L = p × l.', 'L = 12 × 5 = 60.', 'Jadi, luasnya 60 cm² (satuan luas berpangkat dua).'],
  },
  {
    id: 'PP-2', shape: 'rectangle', concept: 'perimeter', objective: 'TP5', level: 'completion', difficulty: 1, type: 'numeric',
    stem: 'Persegi panjang memiliki panjang 9 cm dan lebar 4 cm. Berapa kelilingnya?',
    figure: { shape: 'rectangle', highlight: ['perimeter'], annotations: [{ at: 'AB', text: '9 cm' }, { at: 'BC', text: '4 cm' }] },
    answer: 26, unit: 'cm',
    wrongAnswers: [
      { value: 36, feedback: 'Kamu menghitung luas (9 × 4). Yang ditanya keliling, yaitu panjang pinggiran.', misconception: 'M02' },
      { value: 13, feedback: 'Hampir! Itu baru setengah keliling. Ada 2 panjang dan 2 lebar.' },
    ],
    hints: ['Keliling = jumlah panjang semua sisi.', 'K = 2 × (p + l)', 'Jumlahkan dulu p + l = 13.'],
    solutionSteps: ['Diketahui p = 9 cm dan l = 4 cm.', 'K = 2 × (p + l) = 2 × (9 + 4).', 'K = 2 × 13 = 26 cm.'],
  },
  {
    id: 'PP-3', shape: 'rectangle', concept: 'diagonals', objective: 'TP1', level: 'independent', difficulty: 1, type: 'multiple-choice',
    stem: 'Pada persegi panjang ABCD, panjang diagonal AC = 13 cm. Berapa panjang diagonal BD?',
    figure: { shape: 'rectangle', layers: ['diagonals'], annotations: [{ at: 'AC', text: '13 cm' }] },
    options: [
      { id: 'a', text: '13 cm', feedback: 'Betul! Diagonal persegi panjang selalu sama panjang.' },
      { id: 'b', text: '6,5 cm', feedback: '6,5 cm adalah setengah diagonal (AO). Yang ditanya diagonal BD utuh.' },
      { id: 'c', text: '26 cm', feedback: 'Diagonal persegi panjang sama panjang, bukan dua kali lipat.' },
      { id: 'd', text: 'Tidak dapat ditentukan', feedback: 'Bisa ditentukan! Coba ingat sifat diagonal persegi panjang di Lab.' },
    ],
    answer: 'a',
    hints: ['Ingat sifat diagonal persegi panjang.', 'Diagonal persegi panjang sama panjang.', 'BD = AC.'],
    solutionSteps: ['Diagonal persegi panjang sama panjang.', 'Jadi, BD = AC = 13 cm.'],
  },
  {
    id: 'PP-4', shape: 'rectangle', concept: 'word-problem', objective: 'TP6', level: 'independent', difficulty: 3, type: 'multiple-choice',
    stem: 'Kebun Pak Budi berbentuk persegi panjang, 12 m × 8 m, dan ditanami 30 pohon cabai. Panjangnya ditambah 3 m dan lebarnya dikurangi 2 m. Apa yang terjadi pada luas kebun?',
    story: { known: ['Ukuran lama: p = 12 m, l = 8 m', 'Ukuran baru: p = 12 + 3 = 15 m, l = 8 − 2 = 6 m'], asked: 'Perubahan luas kebun',
      facts: [{ text: 'Ukuran kebun 12 m × 8 m', needed: true }, { text: 'Panjang ditambah 3 m', needed: true }, { text: 'Lebar dikurangi 2 m', needed: true }, { text: 'Ada 30 pohon cabai', needed: false, why: 'banyak pohon tidak mengubah luas kebun' }],
      askedChoices: ['Keliling kebun yang baru', 'Banyak pohon cabai'],
    },
    figure: { shape: 'rectangle', highlight: ['area'], annotations: [{ at: 'AB', text: '12 m' }, { at: 'BC', text: '8 m' }] },
    options: [
      { id: 'a', text: 'Berkurang 6 m²', feedback: 'Betul! 96 m² menjadi 90 m².' },
      { id: 'b', text: 'Bertambah 6 m²', feedback: 'Selisihnya benar 6 m², tetapi bandingkan lagi: luas baru 90 m², luas lama 96 m².' },
      { id: 'c', text: 'Tetap', feedback: 'Panjang naik 3 m dan lebar turun 2 m tidak saling menghapus. Hitung luas lama dan luas baru.' },
      { id: 'd', text: 'Bertambah 2 m', feedback: 'Itu perubahan keliling (40 m → 42 m). Yang ditanya luas.', misconception: 'M02' },
    ],
    answer: 'a',
    hints: ['Hitung luas lama dan luas baru secara terpisah.', 'L = p × l untuk masing-masing ukuran.', 'Luas lama = 12 × 8 = 96 m².'],
    solutionSteps: ['Luas lama = 12 × 8 = 96 m².', 'Ukuran baru: p = 15 m, l = 6 m.', 'Luas baru = 15 × 6 = 90 m².', 'Selisih = 96 − 90 = 6 m². Luas berkurang 6 m².'],
  },
  {
    id: 'PP-5', shape: 'rectangle', concept: 'word-problem', objective: 'TP6', level: 'independent', difficulty: 2, type: 'numeric',
    stem: 'Halaman sekolah berbentuk persegi panjang 15 m × 10 m. Di halaman itu ada 3 tiang bendera. Halaman akan dipagari di sekelilingnya. Berapa meter panjang pagar yang diperlukan?',
    story: { known: ['p = 15 m', 'l = 10 m'], asked: 'Panjang pagar = keliling halaman',
      facts: [{ text: 'Ukuran halaman 15 m × 10 m', needed: true }, { text: 'Pagar dipasang di sekeliling halaman', needed: true }, { text: 'Ada 3 tiang bendera', needed: false, why: 'tiang bendera tidak memengaruhi panjang pagar' }],
      askedChoices: ['Luas halaman', 'Banyak tiang bendera'],
    },
    figure: { shape: 'rectangle', highlight: ['perimeter'], annotations: [{ at: 'AB', text: '15 m' }, { at: 'BC', text: '10 m' }] },
    answer: 50, unit: 'm',
    wrongAnswers: [
      { value: 150, feedback: 'Kamu menghitung luas. Pagar dipasang di pinggiran, jadi yang dihitung keliling.', misconception: 'M02' },
      { value: 25, feedback: 'Itu baru setengah keliling. Pagar mengelilingi 2 panjang dan 2 lebar.' },
    ],
    hints: ['Pagar dipasang di pinggir → keliling atau luas?', 'K = 2 × (p + l)', 'K = 2 × (15 + 10).'],
    solutionSteps: ['Pagar mengelilingi halaman, jadi yang dihitung keliling.', 'K = 2 × (15 + 10) = 2 × 25.', 'K = 50 m.'],
  },

  // ───────────── Persegi ─────────────
  {
    id: 'PS-1', shape: 'square', concept: 'perimeter', objective: 'TP5', level: 'example', difficulty: 1, type: 'numeric',
    stem: 'Sebuah persegi memiliki panjang sisi 7 cm. Berapa kelilingnya?',
    figure: { shape: 'square', highlight: ['perimeter'], annotations: [{ at: 'AB', text: '7 cm' }] },
    answer: 28, unit: 'cm',
    hints: ['Persegi punya 4 sisi yang sama panjang.', 'K = 4 × s', 'K = 4 × 7.'],
    solutionSteps: ['Diketahui s = 7 cm.', 'K = 4 × s = 4 × 7.', 'K = 28 cm.'],
  },
  {
    id: 'PS-2', shape: 'square', concept: 'area', objective: 'TP5', level: 'completion', difficulty: 1, type: 'numeric',
    stem: 'Sebuah persegi memiliki panjang sisi 9 cm. Berapa luasnya?',
    figure: { shape: 'square', highlight: ['area'], annotations: [{ at: 'AB', text: '9 cm' }] },
    answer: 81, unit: 'cm²',
    wrongAnswers: [
      { value: 36, feedback: 'Kamu menghitung keliling (4 × 9). Yang ditanya luas.', misconception: 'M02' },
      { value: 18, feedback: 's² artinya s × s, bukan s × 2.' },
    ],
    hints: ['Luas adalah isi daerah persegi.', 'L = s × s', 'L = 9 × 9.'],
    solutionSteps: ['Diketahui s = 9 cm.', 'L = s × s = 9 × 9.', 'L = 81 cm².'],
  },
  {
    id: 'PS-3', shape: 'square', concept: 'area', objective: 'TP5', level: 'independent', difficulty: 2, type: 'numeric',
    stem: 'Keliling sebuah persegi adalah 36 cm. Berapa luasnya?',
    figure: { shape: 'square', annotations: [{ at: 'AB', text: 's = ?' }] },
    answer: 81, unit: 'cm²',
    wrongAnswers: [
      { value: 9, feedback: '9 cm adalah panjang sisinya. Langkahmu benar, tinggal hitung luasnya.' },
      { value: 1296, feedback: 'Kamu mengkuadratkan keliling. Cari panjang sisi dulu: s = 36 : 4.' },
      { value: 36, feedback: '36 cm adalah kelilingnya. Yang ditanya luas.', misconception: 'M02' },
    ],
    hints: ['Cari panjang sisi dari keliling.', 's = K : 4, lalu L = s × s.', 's = 36 : 4 = 9 cm.'],
    solutionSteps: ['K = 4 × s, jadi s = 36 : 4 = 9 cm.', 'L = s × s = 9 × 9.', 'L = 81 cm².'],
  },
  {
    id: 'PS-4', shape: 'square', concept: 'symmetry', objective: 'TP1', level: 'independent', difficulty: 1, type: 'multiple-choice',
    stem: 'Berapa banyak simetri lipat persegi?',
    figure: { shape: 'square' },
    options: [
      { id: 'a', text: '2', feedback: 'Itu banyak simetri lipat persegi panjang. Pada persegi, diagonal juga sumbu simetri.' },
      { id: 'b', text: '4', feedback: 'Betul! 2 garis tengah dan 2 diagonal.' },
      { id: 'c', text: '1', feedback: 'Coba nyalakan lapisan Simetri di Lab.' },
      { id: 'd', text: '0', feedback: 'Persegi bisa dilipat menjadi dua bagian yang berimpit. Coba lapisan Simetri di Lab.' },
    ],
    answer: 'b',
    hints: ['Lipatan mana yang membuat kedua bagian berimpit?', 'Coba garis tengah dan diagonal.', 'Hitung: 2 garis tengah + 2 diagonal.'],
    solutionSteps: ['Garis tengah mendatar dan tegak: 2 sumbu.', 'Kedua diagonal juga sumbu simetri: 2 sumbu.', 'Total 4 simetri lipat.'],
  },
  {
    id: 'PS-5', shape: 'square', concept: 'classify', objective: 'TP2', level: 'independent', difficulty: 2, type: 'multiple-choice',
    stem: '"Setiap persegi adalah persegi panjang." Benar atau salah?',
    ...TF(true, 'Betul! Persegi memenuhi semua sifat persegi panjang: sisi berhadapan sama dan sejajar, semua sudut 90°.', 'Persegi memenuhi semua sifat persegi panjang. Jadi, persegi adalah persegi panjang yang istimewa.', 'M07'),
    hints: ['Sebutkan sifat persegi panjang.', 'Apakah persegi memenuhi semua sifat itu?', 'Cek: sudut 90°? sisi berhadapan sama dan sejajar?'],
    solutionSteps: ['Sifat persegi panjang: sisi berhadapan sama dan sejajar, semua sudut 90°.', 'Persegi memenuhi semuanya.', 'Jadi, pernyataan itu benar.'],
  },

  // ───────────── Jajargenjang ─────────────
  {
    id: 'JG-1', shape: 'parallelogram', concept: 'area', objective: 'TP5', level: 'example', difficulty: 2, type: 'numeric',
    stem: 'Jajargenjang ABCD memiliki alas AB = 10 cm, sisi miring BC = 6 cm, dan tinggi 5 cm. Berapa luasnya?',
    figure: { shape: 'parallelogram', highlight: ['height'], annotations: [{ at: 'AB', text: '10 cm' }, { at: 'BC', text: '6 cm' }, { at: 'height', text: '5 cm' }] },
    answer: 50, unit: 'cm²',
    hints: ['Tinggi harus tegak lurus alas.', 'L = a × t', 'Gunakan t = 5, bukan 6.'],
    solutionSteps: ['Rumus luas jajargenjang: L = a × t.', 'Tinggi adalah garis yang tegak lurus alas, yaitu 5 cm (bukan sisi miring 6 cm).', 'L = 10 × 5 = 50 cm².'],
  },
  {
    id: 'JG-2', shape: 'parallelogram', concept: 'angles', objective: 'TP4', level: 'completion', difficulty: 1, type: 'numeric',
    stem: 'Pada jajargenjang ABCD, ∠A = 65°. Berapa besar ∠B?',
    figure: { shape: 'parallelogram', layers: [], selectedAngle: 0, annotations: [{ at: 'A', text: '65°' }] },
    answer: 115, unit: '°',
    wrongAnswers: [
      { value: 65, feedback: '∠A dan ∠B berdekatan, bukan berhadapan. Sudut yang sama besar dengan ∠A adalah ∠C.' },
      { value: 295, feedback: 'Bukan 360° − 65°. Dua sudut berdekatan berjumlah 180°.' },
    ],
    hints: ['∠A dan ∠B berdekatan.', 'Sudut berdekatan pada jajargenjang berjumlah 180°.', '∠B = 180° − 65°.'],
    solutionSteps: ['∠A dan ∠B berdekatan (AD ∥ BC).', '∠A + ∠B = 180°.', '∠B = 180° − 65° = 115°.'],
  },
  {
    id: 'JG-3', shape: 'parallelogram', concept: 'area', objective: 'TP5', level: 'independent', difficulty: 2, type: 'multiple-choice',
    stem: 'Jajargenjang memiliki alas 12 cm, sisi miring 7 cm, dan tinggi 6 cm. Berapa luasnya?',
    figure: { shape: 'parallelogram', annotations: [{ at: 'AB', text: '12 cm' }, { at: 'BC', text: '7 cm' }, { at: 'height', text: '6 cm' }] },
    options: [
      { id: 'a', text: '84 cm²', feedback: 'Kamu mengalikan alas dengan sisi miring. Tinggi harus tegak lurus alas.', misconception: 'M01' },
      { id: 'b', text: '72 cm²', feedback: 'Betul! L = 12 × 6 = 72 cm².' },
      { id: 'c', text: '38 cm²', feedback: 'Itu keliling: 2 × (12 + 7) = 38. Satuannya pun cm, bukan cm².', misconception: 'M02' },
      { id: 'd', text: '36 cm²', feedback: 'Luas jajargenjang tidak dikali ½.', misconception: 'M03' },
    ],
    answer: 'b',
    hints: ['Mana yang tinggi: 7 cm atau 6 cm?', 'L = a × t', 'L = 12 × 6.'],
    solutionSteps: ['Tinggi = 6 cm (tegak lurus alas).', 'L = a × t = 12 × 6.', 'L = 72 cm².'],
  },
  {
    id: 'JG-4', shape: 'parallelogram', concept: 'symmetry', objective: 'TP1', level: 'independent', difficulty: 2, type: 'multiple-choice',
    stem: 'Berapa banyak simetri lipat jajargenjang (yang bukan persegi panjang atau belah ketupat)?',
    figure: { shape: 'parallelogram', layers: ['diagonals'] },
    options: [
      { id: 'a', text: '0', feedback: 'Betul! Tidak ada lipatan yang membuat kedua bagian berimpit.' },
      { id: 'b', text: '1', feedback: 'Coba lipat di sepanjang diagonal. Kedua bagian tidak berimpit.', misconception: 'M06' },
      { id: 'c', text: '2', feedback: 'Diagonal jajargenjang bukan sumbu simetri. Kamu mungkin teringat belah ketupat.', misconception: 'M06' },
      { id: 'd', text: '4', feedback: 'Itu banyak simetri lipat persegi.' },
    ],
    answer: 'a',
    hints: ['Bayangkan melipat kertas jajargenjang.', 'Coba diagonal dan garis tengah. Apakah ada yang berimpit?', 'Nyalakan lapisan Simetri di Lab.'],
    solutionSteps: ['Lipatan di diagonal: kedua bagian tidak berimpit.', 'Lipatan di garis tengah: kedua bagian tidak berimpit.', 'Jadi, jajargenjang tidak memiliki simetri lipat (0).'],
  },
  {
    id: 'JG-5', shape: 'parallelogram', concept: 'angles', objective: 'TP4', level: 'independent', difficulty: 1, type: 'numeric',
    stem: 'Pada jajargenjang PQRS, ∠P = 110°. Berapa besar ∠R?',
    figure: { shape: 'parallelogram', annotations: [{ at: 'A', text: 'P' }, { at: 'B', text: 'Q' }, { at: 'C', text: 'R' }, { at: 'D', text: 'S' }], hideLabels: true },
    answer: 110, unit: '°',
    wrongAnswers: [{ value: 70, feedback: '70° adalah besar sudut yang berdekatan (∠Q atau ∠S). ∠R berhadapan dengan ∠P.' }],
    hints: ['∠P dan ∠R berhadapan.', 'Sudut berhadapan pada jajargenjang sama besar.', '∠R = ∠P.'],
    solutionSteps: ['∠P dan ∠R berhadapan.', 'Sudut berhadapan jajargenjang sama besar.', '∠R = 110°.'],
  },

  // ───────────── Belah ketupat ─────────────
  {
    id: 'BK-1', shape: 'rhombus', concept: 'area', objective: 'TP5', level: 'example', difficulty: 1, type: 'numeric',
    stem: 'Belah ketupat memiliki diagonal 12 cm dan 16 cm. Berapa luasnya?',
    figure: { shape: 'rhombus', layers: ['diagonals'], annotations: [{ at: 'AC', text: '16 cm' }, { at: 'BD', text: '12 cm' }] },
    answer: 96, unit: 'cm²',
    hints: ['Luas memakai kedua diagonal.', 'L = ½ × d₁ × d₂', 'L = ½ × 12 × 16.'],
    solutionSteps: ['d₁ = 12 cm, d₂ = 16 cm.', 'L = ½ × d₁ × d₂ = ½ × 12 × 16.', 'L = ½ × 192 = 96 cm².'],
  },
  {
    id: 'BK-2', shape: 'rhombus', concept: 'area', objective: 'TP5', level: 'completion', difficulty: 1, type: 'numeric',
    stem: 'Belah ketupat memiliki diagonal 10 cm dan 8 cm. Berapa luasnya?',
    figure: { shape: 'rhombus', layers: ['diagonals'], annotations: [{ at: 'AC', text: '10 cm' }, { at: 'BD', text: '8 cm' }] },
    answer: 40, unit: 'cm²',
    wrongAnswers: [{ value: 80, feedback: 'Kamu lupa mengalikan ½. Belah ketupat hanya mengisi setengah persegi panjang pembingkainya.', misconception: 'M03' }],
    hints: ['Gunakan kedua diagonal.', 'L = ½ × d₁ × d₂', '10 × 8 = 80, lalu dikali ½.'],
    solutionSteps: ['L = ½ × d₁ × d₂.', 'L = ½ × 10 × 8 = ½ × 80.', 'L = 40 cm².'],
  },
  {
    id: 'BK-3', shape: 'rhombus', concept: 'diagonals', objective: 'TP1', level: 'independent', difficulty: 2, type: 'multi-select',
    stem: 'Pilih semua sifat diagonal belah ketupat.',
    figure: { shape: 'rhombus', layers: ['diagonals'] },
    options: [
      { id: 'a', text: 'Saling tegak lurus', feedback: 'Benar, diagonal belah ketupat tegak lurus.' },
      { id: 'b', text: 'Saling membagi dua sama panjang', feedback: 'Benar, kedua diagonal saling membagi dua.' },
      { id: 'c', text: 'Sama panjang', feedback: 'Diagonal belah ketupat hanya sama panjang jika bangunnya persegi. Coba geser titik di Lab.', misconception: 'M04' },
      { id: 'd', text: 'Membagi sudut menjadi dua sama besar', feedback: 'Benar, setiap diagonal membagi dua sudut yang dilaluinya.' },
    ],
    answer: ['a', 'b', 'd'],
    hints: ['Ingat tugas eksplorasi di Lab belah ketupat.', 'Ada 3 sifat yang benar.', 'Diagonal belah ketupat sama panjang hanya jika bangunnya persegi.'],
    solutionSteps: ['Diagonal belah ketupat saling tegak lurus.', 'Kedua diagonal saling membagi dua sama panjang.', 'Setiap diagonal membagi dua sudut yang dilaluinya.', 'Diagonal tidak harus sama panjang (hanya pada persegi).'],
  },
  {
    id: 'BK-4', shape: 'rhombus', concept: 'perimeter', objective: 'TP5', level: 'independent', difficulty: 1, type: 'numeric',
    stem: 'Panjang sisi sebuah belah ketupat 6,5 cm. Berapa kelilingnya?',
    figure: { shape: 'rhombus', highlight: ['perimeter'], annotations: [{ at: 'AB', text: '6,5 cm' }] },
    answer: 26, unit: 'cm',
    wrongAnswers: [{ value: 42.25, feedback: 'Kamu menghitung s × s. Keliling = jumlah keempat sisi.', misconception: 'M02' }],
    hints: ['Keempat sisi belah ketupat sama panjang.', 'K = 4 × s', 'K = 4 × 6,5.'],
    solutionSteps: ['K = 4 × s.', 'K = 4 × 6,5 = 26 cm.'],
  },
  {
    id: 'BK-5', shape: 'rhombus', concept: 'angles', objective: 'TP4', level: 'independent', difficulty: 2, type: 'multiple-choice',
    stem: 'Pada belah ketupat ABCD, ∠A = 70°. Berapa besar ∠B?',
    figure: { shape: 'rhombus', annotations: [{ at: 'A', text: '70°' }] },
    options: [
      { id: 'a', text: '70°', feedback: '∠B berdekatan dengan ∠A, bukan berhadapan.' },
      { id: 'b', text: '110°', feedback: 'Betul! ∠A + ∠B = 180°.' },
      { id: 'c', text: '140°', feedback: '∠A + ∠C = 140°, bukan besar ∠B.' },
      { id: 'd', text: '290°', feedback: 'Sudut berdekatan berjumlah 180°, bukan 360°.' },
    ],
    answer: 'b',
    hints: ['∠A dan ∠B berdekatan.', 'Belah ketupat adalah jajargenjang: sudut berdekatan berjumlah 180°.', '∠B = 180° − 70°.'],
    solutionSteps: ['∠A dan ∠B berdekatan.', '∠A + ∠B = 180°.', '∠B = 180° − 70° = 110°.'],
  },

  // ───────────── Layang-layang ─────────────
  {
    id: 'LL-1', shape: 'kite', concept: 'area', objective: 'TP5', level: 'example', difficulty: 1, type: 'numeric',
    stem: 'Layang-layang memiliki diagonal 10 cm dan 24 cm. Berapa luasnya?',
    figure: { shape: 'kite', layers: ['diagonals'], annotations: [{ at: 'AC', text: '24 cm' }, { at: 'BD', text: '10 cm' }] },
    answer: 120, unit: 'cm²',
    hints: ['Luas layang-layang memakai kedua diagonal.', 'L = ½ × d₁ × d₂', 'L = ½ × 10 × 24.'],
    solutionSteps: ['L = ½ × d₁ × d₂.', 'L = ½ × 10 × 24 = ½ × 240.', 'L = 120 cm².'],
  },
  {
    id: 'LL-2', shape: 'kite', concept: 'perimeter', objective: 'TP5', level: 'completion', difficulty: 1, type: 'numeric',
    stem: 'Layang-layang memiliki sisi pendek 5 cm dan sisi panjang 12 cm. Berapa kelilingnya?',
    figure: { shape: 'kite', highlight: ['perimeter'], annotations: [{ at: 'AB', text: '12 cm' }, { at: 'BC', text: '5 cm' }] },
    answer: 34, unit: 'cm',
    wrongAnswers: [
      { value: 17, feedback: 'Itu baru setengah. Layang-layang punya 2 sisi pendek dan 2 sisi panjang.' },
      { value: 60, feedback: 'Keliling dijumlahkan, bukan dikalikan.', misconception: 'M02' },
    ],
    hints: ['Ada 2 sisi 5 cm dan 2 sisi 12 cm.', 'K = 2 × (a + b)', 'K = 2 × (5 + 12).'],
    solutionSteps: ['K = 2 × (a + b).', 'K = 2 × (5 + 12) = 2 × 17.', 'K = 34 cm.'],
  },
  {
    id: 'LL-3', shape: 'kite', concept: 'diagonals', objective: 'TP2', level: 'independent', difficulty: 2, type: 'multi-select',
    stem: 'Pilih semua sifat yang dimiliki layang-layang.',
    figure: { shape: 'kite' },
    options: [
      { id: 'a', text: 'Diagonal saling tegak lurus', feedback: 'Benar.' },
      { id: 'b', text: 'Kedua diagonal saling membagi dua sama panjang', feedback: 'Pada layang-layang hanya satu diagonal yang terbagi dua. Itu sifat belah ketupat.', misconception: 'M05' },
      { id: 'c', text: 'Memiliki 1 simetri lipat', feedback: 'Benar, sumbunya adalah diagonal AC.' },
      { id: 'd', text: 'Keempat sisi sama panjang', feedback: 'Itu sifat belah ketupat. Layang-layang punya dua pasang sisi berdekatan yang sama.' },
    ],
    answer: ['a', 'c'],
    hints: ['Bandingkan layang-layang dengan belah ketupat.', 'Ada 2 sifat yang benar.', 'Cek diagonal: berapa yang terbagi dua?'],
    solutionSteps: ['Diagonal layang-layang saling tegak lurus.', 'Hanya satu diagonal (BD) yang dibagi dua sama panjang.', 'Ada 1 simetri lipat (diagonal AC).', 'Sisinya tidak semua sama panjang.'],
  },
  {
    id: 'LL-4', shape: 'kite', concept: 'symmetry', objective: 'TP1', level: 'independent', difficulty: 1, type: 'multiple-choice',
    stem: 'Berapa banyak simetri lipat layang-layang?',
    figure: { shape: 'kite' },
    options: [
      { id: 'a', text: '1', feedback: 'Betul! Sumbunya diagonal yang menghubungkan dua sudut yang tidak sama.' },
      { id: 'b', text: '2', feedback: 'Itu belah ketupat. Pada layang-layang hanya satu diagonal yang menjadi sumbu simetri.' },
      { id: 'c', text: '0', feedback: 'Layang-layang bisa dilipat sepanjang diagonal AC.' },
      { id: 'd', text: '4', feedback: 'Itu persegi.' },
    ],
    answer: 'a',
    hints: ['Lipat di sepanjang diagonal.', 'Coba kedua diagonal satu per satu.', 'Hanya diagonal AC yang membuat kedua bagian berimpit.'],
    solutionSteps: ['Lipatan di AC: kedua bagian berimpit.', 'Lipatan di BD: tidak berimpit.', 'Jadi, ada 1 simetri lipat.'],
  },
  {
    id: 'LL-5', shape: 'kite', concept: 'area', objective: 'TP5', level: 'independent', difficulty: 3, type: 'numeric',
    stem: 'Luas layang-layang 84 cm² dan salah satu diagonalnya 14 cm. Berapa panjang diagonal yang lain?',
    figure: { shape: 'kite', layers: ['diagonals'], annotations: [{ at: 'AC', text: '?' }, { at: 'BD', text: '14 cm' }] },
    answer: 12, unit: 'cm',
    wrongAnswers: [{ value: 6, feedback: 'Kamu lupa ½ pada rumus. 84 = ½ × 14 × d₂ → 84 = 7 × d₂.', misconception: 'M03' }],
    hints: ['Tuliskan rumus luas, lalu masukkan yang diketahui.', '84 = ½ × 14 × d₂', '84 = 7 × d₂.'],
    solutionSteps: ['L = ½ × d₁ × d₂.', '84 = ½ × 14 × d₂ = 7 × d₂.', 'd₂ = 84 : 7 = 12 cm.'],
  },

  // ───────────── Trapesium ─────────────
  {
    id: 'TR-1', shape: 'trapezoid', concept: 'area', objective: 'TP5', level: 'example', difficulty: 2, type: 'numeric',
    stem: 'Trapesium memiliki sisi sejajar 8 cm dan 14 cm serta tinggi 5 cm. Berapa luasnya?',
    figure: { shape: 'trapezoid', highlight: ['height'], annotations: [{ at: 'AB', text: '14 cm' }, { at: 'CD', text: '8 cm' }, { at: 'height', text: '5 cm' }] },
    answer: 55, unit: 'cm²',
    hints: ['Jumlahkan kedua sisi sejajar.', 'L = ½ × (a + b) × t', 'L = ½ × 22 × 5.'],
    solutionSteps: ['a = 14 cm, b = 8 cm, t = 5 cm.', 'L = ½ × (a + b) × t = ½ × (14 + 8) × 5.', 'L = ½ × 22 × 5 = 11 × 5 = 55 cm².'],
  },
  {
    id: 'TR-2', shape: 'trapezoid', concept: 'area', objective: 'TP5', level: 'completion', difficulty: 2, type: 'numeric',
    stem: 'Trapesium memiliki sisi sejajar 6 cm dan 10 cm serta tinggi 4 cm. Berapa luasnya?',
    figure: { shape: 'trapezoid', annotations: [{ at: 'AB', text: '10 cm' }, { at: 'CD', text: '6 cm' }, { at: 'height', text: '4 cm' }] },
    answer: 32, unit: 'cm²',
    wrongAnswers: [{ value: 64, feedback: 'Kamu lupa mengalikan ½.', misconception: 'M03' }],
    hints: ['Jumlahkan sisi sejajar dulu.', 'L = ½ × (a + b) × t', '(6 + 10) = 16.'],
    solutionSteps: ['a + b = 10 + 6 = 16 cm.', 'L = ½ × 16 × 4.', 'L = 32 cm².'],
  },
  {
    id: 'TR-3', shape: 'trapezoid', concept: 'angles', objective: 'TP4', level: 'independent', difficulty: 2, type: 'multiple-choice',
    stem: 'Pada trapesium ABCD, AB ∥ DC dan ∠A = 70°. Berapa besar ∠D?',
    figure: { shape: 'trapezoid', layers: ['sides'], annotations: [{ at: 'A', text: '70°' }] },
    options: [
      { id: 'a', text: '70°', feedback: '∠A dan ∠D terletak di antara sisi sejajar AB dan DC, jadi jumlahnya 180°.' },
      { id: 'b', text: '110°', feedback: 'Betul! ∠A + ∠D = 180°.' },
      { id: 'c', text: '20°', feedback: 'Bukan 90° − 70°. Sudut di antara sisi sejajar berjumlah 180°.' },
      { id: 'd', text: '290°', feedback: 'Bukan 360° − 70°. Hanya dua sudut, jumlahnya 180°.' },
    ],
    answer: 'b',
    hints: ['Sisi mana yang sejajar?', '∠A dan ∠D ada di antara AB dan DC.', '∠D = 180° − 70°.'],
    solutionSteps: ['AB ∥ DC, dan AD memotong keduanya.', '∠A dan ∠D adalah sudut dalam sepihak, jadi ∠A + ∠D = 180°.', '∠D = 180° − 70° = 110°.'],
  },
  {
    id: 'TR-4', shape: 'trapezoid', concept: 'diagonals', objective: 'TP1', level: 'independent', difficulty: 2, type: 'multiple-choice',
    stem: 'Sifat diagonal trapesium sama kaki adalah ...',
    figure: { shape: 'trapezoid-isosceles', layers: ['diagonals'] },
    options: [
      { id: 'a', text: 'Sama panjang', feedback: 'Betul!' },
      { id: 'b', text: 'Saling tegak lurus', feedback: 'Diagonal trapesium sama kaki tidak harus tegak lurus. Coba lihat di Lab.' },
      { id: 'c', text: 'Saling membagi dua sama panjang', feedback: 'Itu sifat jajargenjang. Trapesium bukan jajargenjang.' },
      { id: 'd', text: 'Tidak ada yang sama panjang', feedback: 'Pada trapesium sama kaki, kedua diagonal sama panjang.' },
    ],
    answer: 'a',
    hints: ['Buka Lab: Trapesium Sama Kaki, lapisan Diagonal.', 'Bandingkan panjang AC dan BD.', 'AC = BD.'],
    solutionSteps: ['Trapesium sama kaki simetris terhadap garis tengahnya.', 'Akibatnya, AC = BD.', 'Diagonalnya tidak harus tegak lurus dan tidak saling membagi dua.'],
  },
  {
    id: 'TR-5', shape: 'trapezoid', concept: 'word-problem', objective: 'TP6', level: 'independent', difficulty: 3, type: 'numeric',
    stem: 'Sawah berbentuk trapesium dengan sisi sejajar 20 m dan 30 m. Jarak kedua sisi sejajar 12 m. Sawah itu digarap oleh 3 orang petani. Berapa luas sawah?',
    story: { known: ['a = 30 m, b = 20 m', 't = 12 m (jarak sisi sejajar)'], asked: 'Luas sawah',
      facts: [{ text: 'Sisi sejajar 20 m dan 30 m', needed: true }, { text: 'Jarak kedua sisi sejajar 12 m', needed: true }, { text: 'Digarap 3 orang petani', needed: false, why: 'yang ditanya luas seluruh sawah' }],
      askedChoices: ['Keliling sawah', 'Luas yang digarap tiap petani'],
    },
    figure: { shape: 'trapezoid', highlight: ['area'], annotations: [{ at: 'AB', text: '30 m' }, { at: 'CD', text: '20 m' }, { at: 'height', text: '12 m' }] },
    answer: 300, unit: 'm²',
    wrongAnswers: [{ value: 600, feedback: 'Kamu lupa mengalikan ½.', misconception: 'M03' }],
    hints: ['"Jarak kedua sisi sejajar" adalah tinggi.', 'L = ½ × (a + b) × t', '½ × 50 × 12.'],
    solutionSteps: ['a + b = 30 + 20 = 50 m.', 'L = ½ × 50 × 12 = 25 × 12.', 'L = 300 m².'],
  },

  // ───────────── Campuran / Detektif ─────────────
  {
    id: 'CP-1', shape: 'mixed', concept: 'classify', objective: 'TP3', level: 'example', difficulty: 2, type: 'multiple-choice',
    stem: 'Diagonal sebuah segiempat sama panjang dan saling membagi dua sama panjang, tetapi tidak tegak lurus. Bangun apakah itu?',
    options: [
      { id: 'a', text: 'Persegi panjang', feedback: 'Betul!' },
      { id: 'b', text: 'Persegi', feedback: 'Diagonal persegi juga tegak lurus.' },
      { id: 'c', text: 'Belah ketupat', feedback: 'Diagonal belah ketupat tegak lurus dan tidak harus sama panjang.', misconception: 'M04' },
      { id: 'd', text: 'Jajargenjang', feedback: 'Diagonal jajargenjang tidak harus sama panjang.' },
    ],
    answer: 'a',
    hints: ['Saling membagi dua → keluarga jajargenjang.', 'Sama panjang → persegi panjang atau persegi.', 'Tidak tegak lurus → bukan persegi.'],
    solutionSteps: ['Diagonal saling membagi dua → keluarga jajargenjang.', 'Diagonal sama panjang → persegi panjang atau persegi.', 'Tidak tegak lurus → bukan persegi. Jadi, persegi panjang.'],
  },
  {
    id: 'CP-2', shape: 'mixed', concept: 'classify', objective: 'TP3', level: 'completion', difficulty: 2, type: 'multiple-choice',
    stem: 'Diagonal sebuah segiempat saling tegak lurus dan saling membagi dua sama panjang, tetapi tidak sama panjang. Bangun apakah itu?',
    options: [
      { id: 'a', text: 'Persegi', feedback: 'Diagonal persegi sama panjang.' },
      { id: 'b', text: 'Layang-layang', feedback: 'Pada layang-layang hanya satu diagonal yang terbagi dua.', misconception: 'M05' },
      { id: 'c', text: 'Belah ketupat', feedback: 'Betul!' },
      { id: 'd', text: 'Jajargenjang', feedback: 'Diagonal jajargenjang tidak tegak lurus.' },
    ],
    answer: 'c',
    hints: ['Saling membagi dua → keluarga jajargenjang.', 'Tegak lurus → belah ketupat atau persegi.', 'Tidak sama panjang → bukan persegi.'],
    solutionSteps: ['Saling membagi dua → keluarga jajargenjang.', 'Tegak lurus → belah ketupat atau persegi.', 'Tidak sama panjang → belah ketupat.'],
  },
  {
    id: 'CP-3', shape: 'mixed', concept: 'classify', objective: 'TP3', level: 'independent', difficulty: 2, type: 'multiple-choice',
    stem: 'Diagonal sebuah segiempat saling tegak lurus. Hanya satu diagonal yang dibagi dua sama panjang oleh diagonal lainnya. Bangun apakah itu?',
    options: [
      { id: 'a', text: 'Belah ketupat', feedback: 'Pada belah ketupat, kedua diagonal saling membagi dua.' },
      { id: 'b', text: 'Layang-layang', feedback: 'Betul!' },
      { id: 'c', text: 'Trapesium sama kaki', feedback: 'Diagonal trapesium sama kaki tidak harus tegak lurus.' },
      { id: 'd', text: 'Persegi panjang', feedback: 'Diagonal persegi panjang tidak tegak lurus dan saling membagi dua.' },
    ],
    answer: 'b',
    hints: ['Tegak lurus → belah ketupat, persegi, atau layang-layang.', 'Berapa diagonal yang terbagi dua?', 'Hanya satu → layang-layang.'],
    solutionSteps: ['Diagonal tegak lurus: belah ketupat, persegi, atau layang-layang.', 'Hanya satu diagonal terbagi dua → bukan belah ketupat/persegi.', 'Jadi, layang-layang.'],
  },
  {
    id: 'CP-4', shape: 'mixed', concept: 'classify', objective: 'TP2', level: 'independent', difficulty: 2, type: 'multiple-choice',
    stem: '"Setiap belah ketupat adalah jajargenjang." Benar atau salah?',
    ...TF(true, 'Betul! Belah ketupat memiliki dua pasang sisi berhadapan yang sejajar.', 'Belah ketupat memiliki dua pasang sisi berhadapan yang sejajar, jadi ia memenuhi definisi jajargenjang.', 'M07'),
    hints: ['Apa definisi jajargenjang?', 'Jajargenjang: dua pasang sisi berhadapan sejajar.', 'Apakah sisi berhadapan belah ketupat sejajar?'],
    solutionSteps: ['Jajargenjang: segiempat dengan dua pasang sisi berhadapan sejajar.', 'Sisi berhadapan belah ketupat sejajar.', 'Jadi, setiap belah ketupat adalah jajargenjang.'],
  },
  {
    id: 'CP-5', shape: 'mixed', concept: 'symmetry', objective: 'TP2', level: 'independent', difficulty: 3, type: 'multi-select',
    stem: 'Sebuah bangun memiliki tepat 2 simetri lipat dan simetri putar tingkat 2. Bangun apa saja yang mungkin?',
    options: [
      { id: 'a', text: 'Persegi panjang', feedback: 'Benar: 2 simetri lipat, simetri putar tingkat 2.' },
      { id: 'b', text: 'Belah ketupat', feedback: 'Benar: 2 simetri lipat (diagonal), simetri putar tingkat 2.' },
      { id: 'c', text: 'Jajargenjang', feedback: 'Jajargenjang tidak memiliki simetri lipat.', misconception: 'M06' },
      { id: 'd', text: 'Persegi', feedback: 'Persegi memiliki 4 simetri lipat, bukan tepat 2.' },
    ],
    answer: ['a', 'b'],
    hints: ['Buka tabel di Catatanku, aspek Simetri.', 'Cari yang simetri lipatnya tepat 2.', 'Ada 2 jawaban.'],
    solutionSteps: ['Simetri lipat tepat 2: persegi panjang dan belah ketupat.', 'Keduanya bersimetri putar tingkat 2.', 'Jajargenjang (0 lipat) dan persegi (4 lipat) tidak memenuhi.'],
  },
  {
    id: 'CP-6', shape: 'mixed', concept: 'word-problem', objective: 'TP6', level: 'independent', difficulty: 2, type: 'numeric',
    stem: 'Taman berbentuk persegi panjang 20 m × 15 m dibuat pada bulan Juli. Taman itu akan ditanami rumput seluruhnya. Berapa m² rumput yang diperlukan?',
    story: { known: ['p = 20 m', 'l = 15 m'], asked: 'Rumput menutupi seluruh taman → luas',
      facts: [{ text: 'Ukuran taman 20 m × 15 m', needed: true }, { text: 'Rumput menutupi seluruh taman', needed: true }, { text: 'Dibuat pada bulan Juli', needed: false, why: 'waktu pembuatan tidak memengaruhi luas' }],
      askedChoices: ['Panjang pagar taman (keliling)', 'Banyak bulan pembuatan taman'],
    },
    figure: { shape: 'rectangle', highlight: ['area'], annotations: [{ at: 'AB', text: '20 m' }, { at: 'BC', text: '15 m' }] },
    answer: 300, unit: 'm²',
    wrongAnswers: [{ value: 70, feedback: 'Itu keliling. Rumput menutupi seluruh isi taman, jadi yang dihitung luas.', misconception: 'M02' }],
    hints: ['Rumput menutupi isi taman → keliling atau luas?', 'L = p × l', 'L = 20 × 15.'],
    solutionSteps: ['Rumput menutupi isi taman, jadi yang dihitung luas.', 'L = 20 × 15 = 300 m².'],
  },
];

/** Core questions (validated draft v0.1) + additional questions (draft v0.3). */
export const QUESTIONS: Question[] = [...CORE_QUESTIONS, ...EXTRA_QUESTIONS];

export const questionsFor = (shape: Question['shape']): Question[] => QUESTIONS.filter((q) => q.shape === shape);
