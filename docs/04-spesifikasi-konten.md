# 04 — Spesifikasi Konten Matematika

> **Status: perlu divalidasi ahli materi (dosen/guru) sebelum diimplementasikan.**
> Dokumen ini adalah **sumber kebenaran** untuk semua sifat, rumus, dan kunci jawaban di aplikasi.

## 1. Konvensi Definisi

Aplikasi memakai **definisi inklusif** (standar matematika):

- Persegi **adalah** persegi panjang sekaligus belah ketupat.
- Persegi panjang dan belah ketupat **adalah** jajargenjang.
- Belah ketupat **adalah** layang-layang (kasus khusus).
- Trapesium: segiempat yang memiliki **tepat sepasang** sisi sejajar *(mengikuti buku teks SMP Indonesia pada umumnya; perlu dikonfirmasi ke kurikulum sekolah sasaran, lihat PRD §10)*.

### Hierarki Keluarga Segiempat

```
                    Segiempat
          ┌────────────┼──────────────┐
     Trapesium    Jajargenjang     Layang-layang
                  ┌─────┴─────┐          │
          Persegi panjang  Belah ketupat ┘ (belah ketupat juga layang-layang)
                  └─────┬─────┘
                     Persegi
```

## 2. Notasi dan Penanda Visual

| Elemen | Notasi teks | Penanda gambar |
|---|---|---|
| Titik sudut | Huruf kapital A, B, C, D (berlawanan arah jarum jam) | Titik bulat berlabel |
| Sisi sama panjang | AB = CD | 1, 2, atau 3 garis kecil melintang (pasangan berbeda = jumlah garis berbeda) |
| Sisi sejajar | AB ∥ DC | Panah kecil di tengah sisi (pasangan berbeda = jumlah panah berbeda) |
| Tegak lurus | AC ⊥ BD | Kotak kecil di sudut |
| Sudut sama besar | ∠A = ∠C | Busur (1 atau 2 busur) |
| Tinggi | t | Garis putus-putus + tanda siku-siku |
| Diagonal | AC, BD (d₁, d₂) | Garis putus-putus berwarna |
| Titik potong diagonal | O | Titik kecil |

## 3. Tabel Sifat (Sumber Kebenaran)

Keterangan: ✓ = selalu berlaku · ✗ = tidak harus berlaku (umumnya tidak)

### 3.1 Sisi

| Sifat | Persegi | Persegi panjang | Jajargenjang | Belah ketupat | Layang-layang | Trapesium |
|---|---|---|---|---|---|---|
| Keempat sisi sama panjang | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| Sisi berhadapan sama panjang | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Dua pasang sisi berdekatan sama panjang | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ |
| Dua pasang sisi berhadapan sejajar | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Tepat sepasang sisi sejajar | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### 3.2 Sudut

| Sifat | Persegi | Persegi panjang | Jajargenjang | Belah ketupat | Layang-layang | Trapesium |
|---|---|---|---|---|---|---|
| Jumlah keempat sudut 360° | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Keempat sudut siku-siku (90°) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Sudut berhadapan sama besar (kedua pasang) | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Sepasang sudut berhadapan sama besar | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Sudut berdekatan berjumlah 180° (semua pasangan) | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Sudut berdekatan di antara sisi sejajar berjumlah 180° | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ |

Catatan layang-layang: sudut yang sama besar adalah sepasang sudut berhadapan yang **diapit oleh sisi-sisi yang tidak sama panjang**.

### 3.3 Diagonal

| Sifat | Persegi | Persegi panjang | Jajargenjang | Belah ketupat | Layang-layang | Trapesium |
|---|---|---|---|---|---|---|
| Kedua diagonal sama panjang | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ (✓ pada trapesium sama kaki) |
| Kedua diagonal saling membagi dua sama panjang | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Hanya satu diagonal dibagi dua sama panjang oleh diagonal lain | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| Diagonal saling tegak lurus | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ |
| Diagonal membagi dua sudut yang dilaluinya sama besar | ✓ (semua) | ✗ | ✗ | ✓ (semua) | ✓ (hanya diagonal sumbu simetri) | ✗ |

**Perbedaan kunci belah ketupat vs layang-layang (K03):** kedua bangun memiliki diagonal yang tegak lurus. Pada belah ketupat, **kedua** diagonal saling membagi dua sama panjang. Pada layang-layang, **hanya satu** diagonal (sumbu simetri) yang membagi dua diagonal lainnya.

### 3.4 Simetri

| | Persegi | Persegi panjang | Jajargenjang | Belah ketupat | Layang-layang | Trapesium sama kaki | Trapesium sembarang/siku-siku |
|---|---|---|---|---|---|---|---|
| Simetri lipat | 4 | 2 | 0 | 2 | 1 | 1 | 0 |
| Simetri putar (tingkat) | 4 | 2 | 2 | 2 | 1* | 1* | 1* |

\* Tingkat 1 berarti bangun hanya kembali ke posisi semula setelah satu putaran penuh, sehingga **dianggap tidak memiliki simetri putar**. Tampilkan di aplikasi sebagai "tidak ada" dengan penjelasan ini.

**Perbedaan kunci belah ketupat vs jajargenjang (IL01):** keduanya bersimetri putar tingkat 2, tetapi **jajargenjang tidak memiliki simetri lipat**, sedangkan belah ketupat memiliki 2 (sepanjang kedua diagonalnya). Sumbu simetri jajargenjang yang "terlihat" sering keliru karena bentuknya mirip.

## 4. Rumus Keliling dan Luas

| Bangun | Keliling (K) | Luas (L) | Keterangan variabel |
|---|---|---|---|
| Persegi | K = 4s | L = s² | s = sisi |
| Persegi panjang | K = 2(p + l) | L = p × l | p = panjang, l = lebar |
| Jajargenjang | K = 2(a + b) | L = a × t | a = alas, b = sisi miring, t = tinggi (⊥ alas) |
| Belah ketupat | K = 4s | L = ½ × d₁ × d₂ | d₁, d₂ = diagonal |
| Layang-layang | K = 2(a + b) | L = ½ × d₁ × d₂ | a, b = panjang sisi pasangan berbeda |
| Trapesium | K = jumlah keempat sisi | L = ½ × (a + b) × t | a, b = sisi-sisi sejajar, t = jarak antara sisi sejajar |

Animasi turunan rumus luas (F05):

- **Jajargenjang:** potong segitiga di satu sisi, lalu geser ke sisi lain sehingga terbentuk persegi panjang a × t.
- **Trapesium:** gandakan, putar 180°, dan tempelkan sehingga terbentuk jajargenjang (a + b) × t, lalu bagi dua.
- **Belah ketupat/layang-layang:** bingkai dengan persegi panjang d₁ × d₂; bangun mengisi tepat setengahnya.

## 5. Miskonsepsi yang Ditargetkan

| Kode | Miskonsepsi | Diagnosis jawaban | Umpan balik |
|---|---|---|---|
| M01 | Luas jajargenjang = alas × sisi miring | Jawaban = a × b | "Tinggi harus **tegak lurus** alas. Sisi miring bukan tinggi. Ketuk `t` untuk melihatnya." |
| M02 | Tertukar keliling dan luas | Jawaban = nilai keliling saat ditanya luas (atau sebaliknya) | "Kamu menghitung **keliling** (pinggiran). Yang ditanya **luas** (isi)." |
| M03 | Lupa ½ pada luas belah ketupat/layang-layang/trapesium | Jawaban = 2 × kunci | "Bangun ini hanya mengisi **setengah** persegi panjang pembingkainya." |
| M04 | Diagonal belah ketupat sama panjang | Memilih "sama panjang" untuk belah ketupat | "Coba geser titik di Lab. Diagonal belah ketupat hanya sama panjang jika bangunnya persegi." |
| M05 | Layang-layang: kedua diagonal saling membagi dua | Memilih sifat itu untuk layang-layang | "Hanya **satu** diagonal yang terbagi dua sama panjang, yaitu diagonal yang bukan sumbu simetri." |
| M06 | Jajargenjang memiliki simetri lipat (pada diagonal) | Menjawab 1 atau 2 | "Coba lipat di sepanjang diagonal. Kedua bagian tidak berimpit." |
| M07 | Persegi bukan persegi panjang | Menolak pernyataan inklusif | Tampilkan hierarki: persegi memenuhi semua sifat persegi panjang. |
| M08 | Semua sudut berdekatan trapesium = 180° | Menjumlahkan pasangan yang salah | Sorot sisi sejajar: hanya sudut **di antara** sisi sejajar yang berjumlah 180°. |
| M09 | Satuan luas memakai cm | Satuan tidak berpangkat dua | "Luas diukur dengan **petak persegi**, jadi satuannya cm²." |

## 6. Format Bank Soal

Soal disimpan di `src/content/questions/*.json` dengan skema berikut (TypeScript):

```ts
type ShapeId = 'square' | 'rectangle' | 'parallelogram' | 'rhombus' | 'kite' | 'trapezoid';
type Concept = 'sides' | 'angles' | 'diagonals' | 'symmetry' | 'perimeter' | 'area' | 'classify' | 'word-problem';
type Level = 'example' | 'completion' | 'independent';   // fading
type Difficulty = 1 | 2 | 3;                              // mudah / sedang / sulit

interface Question {
  id: string;                    // contoh: "PG-JG-L-003"
  shape: ShapeId | 'mixed';
  concept: Concept;
  learningObjective: 'TP1' | 'TP2' | 'TP3' | 'TP4' | 'TP5' | 'TP6';
  level: Level;
  difficulty: Difficulty;
  type: 'multiple-choice' | 'multi-select' | 'numeric' | 'true-false' | 'matching' | 'tap-figure';
  stem: string;                  // teks soal, maksimal 3 kalimat
  figure?: FigureSpec;           // gambar yang dirender aplikasi, bukan file gambar
  story?: { known: string[]; asked: string };   // khusus soal cerita
  options?: { id: string; text: string; feedback: string; misconception?: string }[];
  answer: string | number | string[];
  unit?: 'cm' | 'cm²' | 'm' | 'm²' | '°';
  tolerance?: number;            // untuk isian angka
  hints: [string, string, string];       // konsep → rumus → langkah pertama
  solutionSteps: string[];       // pembahasan bertahap; mendukung LaTeX di antara $...$
  twinOf?: string;               // id soal kembar untuk konsolidasi
}
```

## 7. Contoh Soal

### S1 — Luas jajargenjang (TP5, mandiri, sedang)

**Soal:** Jajargenjang ABCD memiliki alas AB = 10 cm, sisi miring BC = 6 cm, dan tinggi 5 cm. Berapa luasnya?

| Opsi | Umpan balik |
|---|---|
| A. 60 cm² | M01: memakai sisi miring sebagai tinggi |
| **B. 50 cm²** | Benar: L = a × t = 10 × 5 |
| C. 32 cm² | M02: itu keliling, 2(10 + 6) = 32, dan satuannya pun cm |
| D. 25 cm² | M03: luas jajargenjang tidak dikali ½ |

**Pembahasan:** (1) Rumus luas jajargenjang L = a × t. (2) Tinggi adalah garis yang tegak lurus alas, yaitu 5 cm, **bukan** sisi miring 6 cm. (3) L = 10 × 5 = 50 cm².

### S2 — Sudut berdekatan (TP4, mandiri, mudah)

**Soal:** Pada jajargenjang PQRS, ∠P = 65°. Tentukan besar ∠Q.
**Jawab:** 115°. **Pembahasan:** ∠P dan ∠Q berdekatan dan berada di antara sisi sejajar PS ∥ QR, sehingga ∠P + ∠Q = 180°, maka ∠Q = 180° − 65° = 115°.

### S3 — Detektif (TP3, mandiri, sedang)

**Soal:** Sebuah segiempat memiliki diagonal yang sama panjang dan saling membagi dua sama panjang, tetapi **tidak** saling tegak lurus. Bangun apakah itu?
**Jawab:** Persegi panjang. **Pembahasan:** saling membagi dua → keluarga jajargenjang; sama panjang → persegi panjang (atau persegi); tidak tegak lurus → bukan persegi.

### S4 — Belah ketupat vs layang-layang (TP2, multi-select, sedang)

**Soal:** Pilih semua sifat yang dimiliki **layang-layang**.
☐ Diagonal saling tegak lurus ✓ ☐ Kedua diagonal saling membagi dua sama panjang ✗ (M05) ☐ Memiliki 1 simetri lipat ✓ ☐ Keempat sisi sama panjang ✗

### S5 — Luas layang-layang (TP5, mudah)

**Soal:** Layang-layang memiliki diagonal 10 cm dan 24 cm. Luasnya adalah ... cm².
**Jawab:** 120. **Pembahasan:** L = ½ × 10 × 24 = 120 cm². Jika kamu menjawab 240, kamu lupa mengalikan ½ (M03).

### S6 — Luas trapesium (TP5, sedang)

**Soal:** Trapesium memiliki sisi sejajar 8 cm dan 14 cm serta tinggi 5 cm. Hitung luasnya.
**Jawab:** 55 cm². **Pembahasan:** L = ½ × (8 + 14) × 5 = ½ × 22 × 5 = 55 cm².

### S7 — Soal cerita perubahan ukuran (TP6, sulit) — menanggapi EL05

**Soal:** Kebun Pak Budi berbentuk persegi panjang dengan panjang 12 m dan lebar 8 m. Panjangnya ditambah 3 m dan lebarnya dikurangi 2 m. Apakah luas kebun bertambah atau berkurang, dan berapa selisihnya?

- **Diketahui:** p = 12 m, l = 8 m; p baru = 12 + 3 = 15 m; l baru = 8 − 2 = 6 m
- **Ditanya:** perubahan luas
- **Gambar:** dua persegi panjang (lama dan baru) ditumpuk
- **Jawab:** L lama = 12 × 8 = 96 m². L baru = 15 × 6 = 90 m². Luas **berkurang** 96 − 90 = **6 m²**.

### S8 — Benar/Salah hierarki (TP2, mudah)

**Pernyataan:** "Setiap belah ketupat adalah jajargenjang."
**Jawab:** Benar. **Pembahasan:** belah ketupat memiliki dua pasang sisi berhadapan yang sejajar, sehingga memenuhi definisi jajargenjang.

### S9 — Simetri (TP1, mudah)

**Soal:** Berapa banyak simetri lipat jajargenjang (yang bukan persegi panjang/belah ketupat)?
**Jawab:** 0. Umpan balik untuk jawaban 2: M06.

## 8. Target Jumlah Soal (MVP)

| Bangun | Contoh | Lengkapi | Mandiri | Total |
|---|---|---|---|---|
| Persegi panjang | 2 | 3 | 7 | 12 |
| Persegi | 2 | 2 | 6 | 10 |
| Jajargenjang | 2 | 3 | 7 | 12 |
| Belah ketupat | 2 | 3 | 7 | 12 |
| Layang-layang | 2 | 2 | 6 | 10 |
| Trapesium | 2 | 3 | 7 | 12 |
| Campuran/Detektif/Soal cerita | 2 | 3 | 10 | 15 |
| **Total** | | | | **83** |

Setiap soal mandiri sebaiknya memiliki minimal satu **soal kembar** (angka berbeda, struktur sama) untuk konsolidasi setelah pembahasan.
