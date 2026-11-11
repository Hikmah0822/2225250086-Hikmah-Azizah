/**
 * Mathematical Literacy problems — from "Tabel 2 Soal dan Kisi-kisi Jawaban Mathematical
 * Literacy Materi Segiempat Kelas VII" (Hikmah Azizah, 2225250086).
 *
 * Each problem is split into the stages (Tahap) of the answer key. Stage points follow the
 * rubric exactly (6 points per problem, 24 in total). A stage may ask several small
 * questions (fields); its points are shared between them (partial credit, as in the
 * "Pedoman Umum Penskoran").
 */
import type { LiteracyIndicator, LiteracyTask } from '../types';

export const INDICATOR_LABELS: Record<LiteracyIndicator, { name: string; english: string; description: string }> = {
  reasoning: {
    name: 'Penalaran Matematis',
    english: 'Mathematical Reasoning',
    description: 'Mengidentifikasi hubungan matematis, membandingkan alternatif, memberi alasan, dan menentukan keputusan.',
  },
  formulating: {
    name: 'Merumuskan Situasi',
    english: 'Formulating Situations Mathematically',
    description: 'Mengidentifikasi informasi relevan dan menerjemahkan situasi nyata menjadi model matematika.',
  },
  employing: {
    name: 'Menerapkan Konsep dan Prosedur',
    english: 'Employing Mathematical Concepts, Facts, and Procedures',
    description: 'Memilih dan menggunakan konsep, operasi, dan prosedur matematika untuk memperoleh solusi.',
  },
  interpreting: {
    name: 'Menafsirkan dan Mengevaluasi',
    english: 'Interpreting, Applying, and Evaluating Mathematical Outcomes',
    description: 'Menafsirkan hasil dalam konteks, menilai kewajaran hasil, dan mengambil keputusan.',
  },
};

export const LITERACY_TASKS: LiteracyTask[] = [
  // ─────────────────────────── 1. Mathematical Reasoning ───────────────────────────
  {
    id: 'ML-1',
    no: 1,
    indicator: 'reasoning',
    title: 'Memilih Keramik Lantai',
    story:
      'Pak Budi akan memasang keramik pada lantai ruang tamu berbentuk persegi panjang berukuran 6 m × 4 m. Keramik hanya dapat dibeli per buah dan sambungan antarkeramik diabaikan. Tersedia tiga pilihan keramik berbentuk persegi:\n• Toko A: sisi 40 cm, Rp9.000 per buah\n• Toko B: sisi 50 cm, Rp13.500 per buah\n• Toko C: sisi 60 cm, Rp20.000 per buah\nPak Budi ingin menutup seluruh lantai dengan biaya sesedikit mungkin.',
    question: 'Keramik dari toko mana yang sebaiknya dipilih Pak Budi? Jelaskan alasan matematismu.',
    figure: { shape: 'rectangle', highlight: ['area'], annotations: [{ at: 'AB', text: '6 m' }, { at: 'BC', text: '4 m' }] },
    stages: [
      {
        tahap: 1,
        score: 1,
        title: 'Menentukan apa yang dibandingkan',
        hint: 'Biaya total = banyak keramik × harga per buah. Ukuran keramik dalam cm, ukuran lantai dalam m.',
        fields: [
          {
            kind: 'choice',
            id: 'compare',
            label: 'Agar biaya sesedikit mungkin, apa yang harus dibandingkan?',
            options: [
              { id: 'a', text: 'Harga satu keramik', feedback: 'Keramik termurah per buah belum tentu paling hemat, karena jumlah yang dibutuhkan bisa jauh lebih banyak.' },
              { id: 'b', text: 'Total biaya untuk menutup seluruh lantai', feedback: 'Betul! Total biaya = banyak keramik × harga per buah.' },
              { id: 'c', text: 'Ukuran keramik yang paling besar', feedback: 'Keramik besar memang lebih sedikit, tetapi harganya per buah juga lebih mahal. Bandingkan total biayanya.' },
            ],
            answer: 'b',
          },
          { kind: 'numeric', id: 'p-cm', label: 'Samakan satuan: 6 m = … cm', answer: 600, unit: 'cm', wrongAnswers: [{ value: 60, feedback: '1 m = 100 cm, jadi 6 m = 6 × 100 cm.' }] },
          { kind: 'numeric', id: 'l-cm', label: '4 m = … cm', answer: 400, unit: 'cm', wrongAnswers: [{ value: 40, feedback: '1 m = 100 cm, jadi 4 m = 4 × 100 cm.' }] },
        ],
        explanation: [
          'Yang dibandingkan adalah total biaya untuk menutup seluruh lantai, bukan harga satu keramik.',
          'Banyak keramik = luas lantai : luas satu keramik, dan biaya = banyak keramik × harga per buah.',
          'Satuan harus sama, jadi ukuran lantai diubah ke cm: 6 m = 600 cm dan 4 m = 400 cm.',
        ],
      },
      {
        tahap: 2,
        score: 2,
        title: 'Menghitung luas dan banyak keramik',
        hint: 'Luas persegi panjang = p × l. Luas keramik persegi = s × s. Keramik dibeli per buah, jadi pikirkan pembulatannya.',
        fields: [
          {
            kind: 'numeric',
            id: 'floor',
            label: 'Luas lantai = 600 × 400 = … cm²',
            answer: 240000,
            unit: 'cm²',
            wrongAnswers: [
              { value: 24, feedback: '24 adalah luas dalam m². Karena keramik diukur dalam cm, hitung luas lantai dalam cm².', misconception: 'M09' },
              { value: 2000, feedback: 'Itu keliling lantai (2 × (600 + 400)). Yang dibutuhkan luas lantai.', misconception: 'M02' },
            ],
          },
          { kind: 'numeric', id: 'nA', label: 'Banyak keramik Toko A (sisi 40 cm)', answer: 150, unit: 'buah', wrongAnswers: [{ value: 6000, feedback: 'Kamu membagi dengan sisi keramik (40). Bagilah dengan luas keramik: 40 × 40 = 1.600 cm².' }] },
          { kind: 'numeric', id: 'nB', label: 'Banyak keramik Toko B (sisi 50 cm)', answer: 96, unit: 'buah', wrongAnswers: [{ value: 4800, feedback: 'Bagilah dengan luas keramik: 50 × 50 = 2.500 cm², bukan dengan sisinya.' }] },
          {
            kind: 'numeric',
            id: 'nC',
            label: 'Banyak keramik Toko C (sisi 60 cm)',
            answer: 67,
            unit: 'buah',
            wrongAnswers: [
              { value: 66, feedback: '240.000 : 3.600 ≈ 66,67. Dengan 66 buah, lantai belum tertutup seluruhnya, jadi bulatkan ke atas.' },
              { value: 66.67, feedback: 'Keramik hanya dapat dibeli per buah. Bulatkan hasilnya, dan pastikan seluruh lantai tertutup.' },
            ],
          },
        ],
        explanation: [
          'Luas lantai = 600 × 400 = 240.000 cm² (= 24 m²).',
          'Luas keramik: Toko A = 40 × 40 = 1.600 cm²; Toko B = 50 × 50 = 2.500 cm²; Toko C = 60 × 60 = 3.600 cm².',
          'Banyak keramik: Toko A = 240.000 : 1.600 = 150 buah; Toko B = 240.000 : 2.500 = 96 buah.',
          'Toko C = 240.000 : 3.600 ≈ 66,67, dibulatkan ke atas menjadi 67 buah (66 buah belum menutup seluruh lantai).',
        ],
      },
      {
        tahap: 3,
        score: 1,
        title: 'Menghitung total biaya tiap toko',
        hint: 'Biaya = banyak keramik × harga per buah.',
        fields: [
          { kind: 'numeric', id: 'cA', label: 'Biaya Toko A = 150 × Rp9.000', answer: 1350000, prefix: 'Rp' },
          { kind: 'numeric', id: 'cB', label: 'Biaya Toko B = 96 × Rp13.500', answer: 1296000, prefix: 'Rp' },
          {
            kind: 'numeric',
            id: 'cC',
            label: 'Biaya Toko C = 67 × Rp20.000',
            answer: 1340000,
            prefix: 'Rp',
            wrongAnswers: [{ value: 1320000, feedback: 'Itu biaya 66 keramik. Ingat, Toko C membutuhkan 67 buah.' }],
          },
        ],
        explanation: ['Biaya Toko A = 150 × Rp9.000 = Rp1.350.000.', 'Biaya Toko B = 96 × Rp13.500 = Rp1.296.000.', 'Biaya Toko C = 67 × Rp20.000 = Rp1.340.000.'],
      },
      {
        tahap: 4,
        score: 1,
        title: 'Membandingkan dan memutuskan',
        hint: 'Urutkan ketiga total biaya dari yang terkecil.',
        fields: [
          {
            kind: 'choice',
            id: 'choose',
            label: 'Keramik dari toko mana yang sebaiknya dipilih?',
            options: [
              { id: 'A', text: 'Toko A', feedback: 'Toko A paling murah per buah, tetapi total biayanya Rp1.350.000, paling mahal.' },
              { id: 'B', text: 'Toko B', feedback: 'Betul! Rp1.296.000 adalah total biaya paling sedikit.' },
              { id: 'C', text: 'Toko C', feedback: 'Total biaya Toko C Rp1.340.000, masih lebih mahal daripada Toko B.' },
            ],
            answer: 'B',
          },
        ],
        explanation: ['Dibandingkan: Rp1.296.000 < Rp1.340.000 < Rp1.350.000.', 'Pak Budi sebaiknya memilih keramik Toko B.'],
      },
      {
        tahap: 5,
        score: 1,
        title: 'Memberikan alasan matematis',
        hint: 'Alasan yang kuat menjelaskan mengapa toko lain lebih mahal, bukan hanya menyebut angkanya.',
        fields: [
          {
            kind: 'choice',
            id: 'reason',
            label: 'Alasan mana yang paling tepat?',
            options: [
              { id: 'a', text: 'Keramik Toko A paling murah per buah, jadi pasti paling hemat.', feedback: 'Justru Toko A butuh keramik paling banyak (150 buah), sehingga total biayanya paling mahal.' },
              {
                id: 'b',
                text: 'Toko B memberi total biaya paling sedikit. Toko A butuh keramik paling banyak, sedangkan Toko C harga per buahnya paling mahal dan jumlahnya harus dibulatkan ke atas.',
                feedback: 'Betul! Alasan ini membandingkan semua pilihan berdasarkan total biaya.',
              },
              { id: 'c', text: 'Keramik Toko C paling besar, jadi jumlahnya paling sedikit dan pasti paling hemat.', feedback: 'Jumlahnya memang paling sedikit, tetapi harga per buahnya paling mahal sehingga totalnya tidak paling murah.' },
            ],
            answer: 'b',
          },
          {
            kind: 'numeric',
            id: 'save',
            label: 'Berapa rupiah Pak Budi hemat jika memilih Toko B dibanding Toko C?',
            answer: 44000,
            prefix: 'Rp',
            wrongAnswers: [{ value: 54000, feedback: 'Rp54.000 adalah selisih dengan Toko A. Yang ditanya selisih dengan Toko C.' }],
          },
        ],
        explanation: [
          'Keramik Toko A paling murah per buah tetapi dibutuhkan paling banyak (150 buah), sehingga total biayanya paling mahal.',
          'Keramik Toko C paling besar tetapi harga per buahnya paling mahal dan jumlahnya harus dibulatkan ke atas.',
          'Keramik Toko B memberi total biaya paling sedikit, yaitu hemat Rp44.000 dibanding Toko C dan Rp54.000 dibanding Toko A.',
        ],
      },
    ],
    conclusion: 'Pak Budi sebaiknya memilih keramik Toko B dengan total biaya Rp1.296.000.',
  },

  // ─────────────────────────── 2. Formulating ───────────────────────────
  {
    id: 'ML-2',
    no: 2,
    indicator: 'formulating',
    title: 'Taman Sekolah',
    story:
      'Sekolah akan membuat taman berbentuk persegi panjang di halaman depan. Panjang taman 6 m lebih panjang daripada lebarnya. Seluruh tepi taman akan dipagari tanpa celah dengan panjang pagar seluruhnya 52 m. Di dalam taman akan ditanam 8 pohon palem, dan seluruh permukaan taman akan ditutup rumput.',
    question: 'Ubahlah situasi tersebut menjadi model matematika untuk menentukan ukuran taman, lalu tentukan luas rumput yang diperlukan.',
    figure: { shape: 'rectangle', annotations: [{ at: 'AB', text: 'x + 6' }, { at: 'BC', text: 'x' }] },
    stages: [
      {
        tahap: 1,
        score: 1,
        title: 'Memilah informasi',
        hint: 'Pagar dipasang di tepi taman (keliling). Rumput menutup permukaan taman (luas).',
        fields: [
          {
            kind: 'choice',
            id: 'irrelevant',
            label: 'Informasi mana yang TIDAK diperlukan untuk menjawab soal?',
            options: [
              { id: 'a', text: 'Panjang taman 6 m lebih panjang daripada lebarnya', feedback: 'Informasi ini diperlukan untuk menyatakan panjang dengan lebar.' },
              { id: 'b', text: 'Panjang pagar seluruhnya 52 m', feedback: 'Informasi ini diperlukan: panjang pagar adalah keliling taman.' },
              { id: 'c', text: 'Di dalam taman ditanam 8 pohon palem', feedback: 'Betul! Banyak pohon palem tidak memengaruhi ukuran maupun luas taman.' },
            ],
            answer: 'c',
          },
          {
            kind: 'choice',
            id: 'asked',
            label: 'Luas rumput yang diperlukan sama dengan …',
            options: [
              { id: 'a', text: 'Luas taman', feedback: 'Betul! Rumput menutup seluruh permukaan taman.' },
              { id: 'b', text: 'Keliling taman', feedback: 'Keliling adalah panjang pagar. Rumput menutup permukaan, jadi yang dihitung luas.', misconception: 'M02' },
              { id: 'c', text: 'Panjang pagar dikurangi 8 pohon', feedback: 'Pohon palem tidak memengaruhi luas rumput dalam soal ini.' },
            ],
            answer: 'a',
          },
        ],
        explanation: ['Diketahui: taman persegi panjang, panjang = lebar + 6 m, panjang pagar (keliling) = 52 m.', 'Ditanya: luas rumput, yaitu luas taman.', 'Informasi 8 pohon palem tidak diperlukan.'],
      },
      {
        tahap: 2,
        score: 1,
        title: 'Membuat pemisalan',
        hint: '"6 m lebih panjang daripada lebar" artinya panjang = lebar ditambah 6.',
        fields: [
          {
            kind: 'choice',
            id: 'var',
            label: 'Jika lebar taman = x meter, maka panjang taman = …',
            options: [
              { id: 'a', text: '(x + 6) meter', feedback: 'Betul!' },
              { id: 'b', text: '6x meter', feedback: '"6 m lebih panjang" berarti ditambah 6, bukan dikali 6.' },
              { id: 'c', text: '(x − 6) meter', feedback: 'Panjang lebih besar daripada lebar, jadi ditambah 6.' },
              { id: 'd', text: '(52 − x) meter', feedback: 'Panjang dinyatakan dengan hubungannya terhadap lebar, yaitu 6 m lebih panjang.' },
            ],
            answer: 'a',
          },
        ],
        explanation: ['Pemisalan: lebar taman = x meter, maka panjang taman = (x + 6) meter.'],
      },
      {
        tahap: 3,
        score: 1,
        title: 'Menyusun model matematika',
        hint: 'Keliling persegi panjang = 2 × (panjang + lebar), dan keliling taman = panjang pagar.',
        fields: [
          {
            kind: 'choice',
            id: 'model',
            label: 'Model matematika yang tepat adalah …',
            options: [
              { id: 'a', text: '2 × ((x + 6) + x) = 52', feedback: 'Betul! Disederhanakan menjadi 4x + 12 = 52.' },
              { id: 'b', text: '(x + 6) × x = 52', feedback: '(x + 6) × x adalah luas, padahal 52 m adalah panjang pagar (keliling).', misconception: 'M02' },
              { id: 'c', text: '(x + 6) + x = 52', feedback: 'Keliling terdiri atas 2 panjang dan 2 lebar, jadi perlu dikali 2.' },
              { id: 'd', text: '4x = 52', feedback: 'Itu keliling persegi. Panjang dan lebar taman tidak sama.' },
            ],
            answer: 'a',
          },
        ],
        explanation: ['Keliling = 2 × (panjang + lebar), sehingga 2 × ((x + 6) + x) = 52, atau 4x + 12 = 52.'],
      },
      {
        tahap: 4,
        score: 1,
        title: 'Menyelesaikan model',
        hint: '4x + 12 = 52 → 4x = 52 − 12.',
        fields: [
          {
            kind: 'numeric',
            id: 'x',
            label: 'Lebar taman (x) = … m',
            answer: 10,
            unit: 'm',
            wrongAnswers: [
              { value: 23, feedback: 'Kamu memakai (x + 6) + x = 52. Keliling = 2 × (panjang + lebar).' },
              { value: 13, feedback: 'Dari 4x + 12 = 52, kurangi dulu dengan 12 sebelum dibagi 4.' },
              { value: 16, feedback: '16 m adalah panjang taman. Yang ditanya lebar (x).' },
            ],
          },
        ],
        explanation: ['4x = 52 − 12 = 40, maka x = 40 : 4 = 10.', 'Jadi lebar taman = 10 m.'],
      },
      {
        tahap: 5,
        score: 1,
        title: 'Menentukan panjang dan memeriksa',
        hint: 'Panjang = x + 6. Periksa dengan menghitung keliling.',
        fields: [
          { kind: 'numeric', id: 'p', label: 'Panjang taman = … m', answer: 16, unit: 'm', wrongAnswers: [{ value: 10, feedback: '10 m adalah lebarnya. Panjang = lebar + 6.' }] },
          { kind: 'numeric', id: 'check', label: 'Pemeriksaan: keliling = 2 × (panjang + lebar) = … m', answer: 52, unit: 'm', wrongAnswers: [{ value: 26, feedback: 'Jangan lupa dikali 2.' }] },
        ],
        explanation: ['Panjang taman = 10 + 6 = 16 m.', 'Pemeriksaan: keliling = 2 × (16 + 10) = 52 m, sesuai dengan panjang pagar.'],
      },
      {
        tahap: 6,
        score: 1,
        title: 'Menghitung luas rumput',
        hint: 'Luas = panjang × lebar.',
        fields: [
          {
            kind: 'numeric',
            id: 'area',
            label: 'Luas rumput = … m²',
            answer: 160,
            unit: 'm²',
            wrongAnswers: [
              { value: 52, feedback: '52 m adalah keliling (panjang pagar). Rumput menutup luas taman.', misconception: 'M02' },
              { value: 26, feedback: '16 + 10 = 26. Luas dihitung dengan panjang × lebar.', misconception: 'M02' },
            ],
          },
        ],
        explanation: ['Luas rumput = luas taman = panjang × lebar = 16 × 10 = 160 m².'],
      },
    ],
    conclusion: 'Taman berukuran 16 m × 10 m, sehingga rumput yang diperlukan seluas 160 m².',
  },

  // ─────────────────────────── 3. Employing ───────────────────────────
  {
    id: 'ML-3',
    no: 3,
    indicator: 'employing',
    title: 'Kolam Ikan',
    story:
      'Sebuah kolam ikan berbentuk trapesium sama kaki. Panjang kedua sisi sejajarnya 14 m dan 26 m, tinggi kolam (jarak antara kedua sisi sejajar) 8 m, dan panjang masing-masing kaki 10 m. Dasar kolam akan dilapisi terpal dengan biaya Rp12.000 per m², sedangkan seluruh tepi kolam akan dipagari dengan biaya Rp30.000 per m.',
    question: 'Berapa total biaya yang diperlukan untuk terpal dan pagar? Tunjukkan langkah perhitunganmu.',
    figure: {
      shape: 'trapezoid-isosceles',
      annotations: [
        { at: 'AB', text: '26 m' },
        { at: 'CD', text: '14 m' },
        { at: 'BC', text: '10 m' },
        { at: 'DA', text: '10 m' },
        { at: 'height', text: '8 m' },
      ],
    },
    stages: [
      {
        tahap: 1,
        score: 1,
        title: 'Memilih konsep yang tepat',
        hint: 'Terpal menutup bagian dalam (daerah). Pagar mengelilingi tepi (garis).',
        fields: [
          {
            kind: 'choice',
            id: 'tarp',
            label: 'Terpal melapisi dasar kolam. Yang dihitung adalah …',
            options: [
              { id: 'a', text: 'Luas trapesium', feedback: 'Betul! Terpal menutup bagian dalam kolam.' },
              { id: 'b', text: 'Keliling trapesium', feedback: 'Terpal menutup daerah di dalam kolam, jadi yang dihitung luas.', misconception: 'M02' },
            ],
            answer: 'a',
          },
          {
            kind: 'choice',
            id: 'fence',
            label: 'Pagar dipasang di seluruh tepi kolam. Yang dihitung adalah …',
            options: [
              { id: 'a', text: 'Luas trapesium', feedback: 'Pagar berada di pinggir kolam, jadi yang dihitung keliling.', misconception: 'M02' },
              { id: 'b', text: 'Keliling trapesium', feedback: 'Betul! Keliling = jumlah panjang keempat sisi.' },
            ],
            answer: 'b',
          },
        ],
        explanation: [
          'Terpal menutup bagian dalam kolam, jadi yang dihitung luas trapesium = ½ × (jumlah sisi sejajar) × tinggi.',
          'Pagar mengelilingi tepi kolam, jadi yang dihitung keliling = jumlah panjang keempat sisi.',
        ],
      },
      {
        tahap: 2,
        score: 2,
        title: 'Luas kolam dan biaya terpal',
        hint: 'L = ½ × (a + b) × t, lalu kalikan dengan Rp12.000.',
        fields: [
          {
            kind: 'numeric',
            id: 'area',
            label: 'Luas kolam = ½ × (14 + 26) × 8 = … m²',
            answer: 160,
            unit: 'm²',
            wrongAnswers: [
              { value: 320, feedback: 'Kamu lupa mengalikan ½.', misconception: 'M03' },
              { value: 60, feedback: '60 m adalah keliling kolam. Terpal membutuhkan luas.', misconception: 'M02' },
              { value: 200, feedback: 'Gunakan tinggi 8 m, bukan panjang kaki 10 m.', misconception: 'M01' },
            ],
          },
          {
            kind: 'numeric',
            id: 'tarpCost',
            label: 'Biaya terpal = 160 × Rp12.000',
            answer: 1920000,
            prefix: 'Rp',
            wrongAnswers: [{ value: 3840000, feedback: 'Itu memakai luas 320 m². Luas kolam 160 m².', misconception: 'M03' }],
          },
        ],
        explanation: ['Luas kolam = ½ × (14 + 26) × 8 = ½ × 40 × 8 = 160 m².', 'Biaya terpal = 160 × Rp12.000 = Rp1.920.000.'],
      },
      {
        tahap: 3,
        score: 2,
        title: 'Keliling kolam dan biaya pagar',
        hint: 'Trapesium sama kaki punya dua kaki yang sama panjang (10 m).',
        fields: [
          {
            kind: 'numeric',
            id: 'perimeter',
            label: 'Keliling kolam = 14 + 26 + 10 + 10 = … m',
            answer: 60,
            unit: 'm',
            wrongAnswers: [
              { value: 50, feedback: 'Ada dua kaki yang masing-masing 10 m. Sepertinya baru satu kaki yang dijumlahkan.' },
              { value: 40, feedback: 'Itu hanya jumlah sisi sejajar. Keliling mencakup keempat sisi.' },
              { value: 56, feedback: 'Tinggi (8 m) bukan sisi kolam. Gunakan panjang kaki 10 m.' },
            ],
          },
          { kind: 'numeric', id: 'fenceCost', label: 'Biaya pagar = 60 × Rp30.000', answer: 1800000, prefix: 'Rp' },
        ],
        explanation: ['Keliling kolam = 14 + 26 + 10 + 10 = 60 m.', 'Biaya pagar = 60 × Rp30.000 = Rp1.800.000.'],
      },
      {
        tahap: 4,
        score: 1,
        title: 'Total biaya',
        hint: 'Jumlahkan biaya terpal dan biaya pagar.',
        fields: [{ kind: 'numeric', id: 'total', label: 'Total biaya = Rp1.920.000 + Rp1.800.000', answer: 3720000, prefix: 'Rp' }],
        explanation: ['Total biaya = Rp1.920.000 + Rp1.800.000 = Rp3.720.000.'],
      },
    ],
    conclusion: 'Biaya yang diperlukan untuk terpal dan pagar adalah Rp3.720.000.',
  },

  // ─────────────────────────── 4. Interpreting ───────────────────────────
  {
    id: 'ML-4',
    no: 4,
    indicator: 'interpreting',
    title: 'Lahan Parkir',
    story:
      'Sebuah lahan parkir berbentuk jajargenjang dengan alas 20 m, sisi miring 13 m, dan tinggi 12 m. Setiap mobil memerlukan lahan seluas 7 m². Dina menghitung luas lahan = 20 × 13 = 260 m², lalu 260 : 7 ≈ 37,14, sehingga ia menyimpulkan bahwa lahan tersebut dapat menampung 37 mobil.',
    question: 'Apakah kamu setuju dengan kesimpulan Dina? Tentukan banyak mobil maksimal yang dapat ditampung dan jelaskan alasanmu.',
    figure: { shape: 'parallelogram', annotations: [{ at: 'AB', text: '20 m' }, { at: 'BC', text: '13 m' }, { at: 'height', text: '12 m' }] },
    stages: [
      {
        tahap: 1,
        score: 1,
        title: 'Menilai cara Dina',
        hint: 'Perhatikan bilangan yang dipakai Dina sebagai tinggi.',
        fields: [
          {
            kind: 'choice',
            id: 'agree',
            label: 'Apakah kamu setuju dengan Dina?',
            options: [
              { id: 'a', text: 'Setuju, karena 260 : 7 memang ≈ 37,14.', feedback: 'Pembagiannya benar, tetapi luas 260 m² sudah salah sejak awal.' },
              { id: 'b', text: 'Tidak setuju, karena Dina memakai sisi miring (13 m) sebagai tinggi. Tinggi adalah jarak tegak lurus alas, yaitu 12 m.', feedback: 'Betul!' },
              { id: 'c', text: 'Tidak setuju, karena luas jajargenjang = ½ × 20 × 13.', feedback: 'Luas jajargenjang tidak dikali ½. Kesalahan Dina ada pada tinggi yang dipakai.', misconception: 'M03' },
              { id: 'd', text: 'Tidak setuju, karena seharusnya menghitung keliling lahan.', feedback: 'Mobil menempati daerah lahan, jadi yang dihitung memang luas.', misconception: 'M02' },
            ],
            answer: 'b',
          },
        ],
        explanation: [
          'Tidak setuju. Dina memakai sisi miring (13 m) sebagai tinggi.',
          'Tinggi jajargenjang adalah jarak tegak lurus dari alas ke sisi sejajarnya, yaitu 12 m, bukan panjang sisi miring.',
        ],
      },
      {
        tahap: 2,
        score: 1,
        title: 'Luas lahan sebenarnya',
        hint: 'L = alas × tinggi.',
        fields: [
          {
            kind: 'numeric',
            id: 'area',
            label: 'Luas lahan = … m²',
            answer: 240,
            unit: 'm²',
            wrongAnswers: [
              { value: 260, feedback: 'Itu cara Dina (alas × sisi miring). Gunakan tinggi 12 m.', misconception: 'M01' },
              { value: 120, feedback: 'Luas jajargenjang tidak dikali ½.', misconception: 'M03' },
              { value: 66, feedback: 'Itu keliling lahan. Yang dibutuhkan luas.', misconception: 'M02' },
            ],
          },
        ],
        explanation: ['Luas lahan sebenarnya = alas × tinggi = 20 × 12 = 240 m².'],
      },
      {
        tahap: 3,
        score: 1,
        title: 'Membagi dengan kebutuhan satu mobil',
        hint: 'Bagi luas lahan dengan 7 m². Tulis hasilnya dengan dua angka di belakang koma.',
        fields: [
          { kind: 'numeric', id: 'div', label: '240 : 7 ≈ … (dua angka di belakang koma)', answer: 34.29, tolerance: 0.02, wrongAnswers: [{ value: 37.14, feedback: 'Itu hasil Dina dengan luas 260 m². Gunakan luas 240 m².', misconception: 'M01' }] },
        ],
        explanation: ['Banyak mobil = 240 : 7 ≈ 34,29.'],
      },
      {
        tahap: 4,
        score: 1,
        title: 'Menafsirkan hasil dalam konteks',
        hint: 'Mobil tidak bisa dibagi, dan setiap mobil harus muat seluruhnya.',
        fields: [
          {
            kind: 'numeric',
            id: 'cars',
            label: 'Banyak mobil maksimal = … mobil',
            answer: 34,
            unit: 'mobil',
            wrongAnswers: [
              { value: 35, feedback: '35 mobil memerlukan 35 × 7 = 245 m², melebihi 240 m². Bulatkan ke bawah.' },
              { value: 34.29, feedback: 'Banyak mobil harus bilangan bulat.' },
              { value: 37, feedback: '37 adalah kesimpulan Dina yang memakai luas yang salah.', misconception: 'M01' },
            ],
          },
        ],
        explanation: [
          'Mobil tidak dapat dibagi dan harus muat seluruhnya, jadi hasil dibulatkan ke bawah menjadi 34 mobil.',
          'Jika dipaksakan 35 mobil, lahan yang diperlukan 35 × 7 = 245 m², melebihi 240 m².',
        ],
      },
      {
        tahap: 5,
        score: 1,
        title: 'Menilai kewajaran hasil Dina',
        hint: 'Bandingkan jajargenjang dengan persegi panjang 20 m × 13 m.',
        fields: [
          {
            kind: 'choice',
            id: 'why',
            label: 'Mengapa hasil Dina (260 m²) tidak wajar?',
            options: [
              { id: 'a', text: 'Karena 260 tidak habis dibagi 7.', feedback: 'Hasil pembagian tidak harus bulat. Masalahnya ada pada luasnya.' },
              {
                id: 'b',
                text: '260 m² adalah luas persegi panjang 20 m × 13 m. Luas jajargenjang selalu lebih kecil karena tingginya (12 m) kurang dari sisi miringnya (13 m).',
                feedback: 'Betul!',
              },
              { id: 'c', text: 'Karena luas jajargenjang selalu setengah luas persegi panjang.', feedback: 'Luas jajargenjang = alas × tinggi, bukan setengah persegi panjang.', misconception: 'M03' },
            ],
            answer: 'b',
          },
          { kind: 'numeric', id: 'extra', label: 'Dina kelebihan menghitung berapa mobil? (37 − hasilmu)', answer: 3, unit: 'mobil' },
        ],
        explanation: [
          'Luas 260 m² sama dengan luas persegi panjang 20 m × 13 m, sedangkan luas jajargenjang selalu lebih kecil karena tingginya (12 m) kurang dari sisi miringnya (13 m).',
          'Akibatnya Dina menghitung kelebihan 20 m² dan 3 mobil (37 − 34), yang sebenarnya tidak muat.',
        ],
      },
      {
        tahap: 6,
        score: 1,
        title: 'Menarik kesimpulan',
        hint: 'Gabungkan penilaianmu (Tahap 1) dan hasil hitunganmu (Tahap 4).',
        fields: [
          {
            kind: 'choice',
            id: 'conclusion',
            label: 'Kesimpulan yang tepat adalah …',
            options: [
              { id: 'a', text: 'Kesimpulan Dina benar: lahan menampung 37 mobil.', feedback: '37 mobil memerlukan 259 m², padahal luas lahan hanya 240 m².' },
              { id: 'b', text: 'Kesimpulan Dina tidak tepat: lahan hanya dapat menampung paling banyak 34 mobil.', feedback: 'Betul!' },
              { id: 'c', text: 'Kesimpulan Dina tidak tepat: lahan dapat menampung 35 mobil (dibulatkan ke atas).', feedback: '35 mobil memerlukan 245 m² > 240 m². Untuk banyak barang yang harus muat, bulatkan ke bawah.' },
            ],
            answer: 'b',
          },
        ],
        explanation: ['Kesimpulan Dina tidak tepat. Lahan parkir tersebut hanya dapat menampung paling banyak 34 mobil.'],
      },
    ],
    conclusion: 'Kesimpulan Dina tidak tepat. Lahan parkir hanya dapat menampung paling banyak 34 mobil.',
  },
];

export const LITERACY_MAX_SCORE = LITERACY_TASKS.reduce((s, t) => s + t.stages.reduce((a, st) => a + st.score, 0), 0);
