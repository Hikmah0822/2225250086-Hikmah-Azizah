# 01 — Analisis Kebutuhan dari Hasil Wawancara

## 1. Identitas Data

| Keterangan | Isi |
|---|---|
| Responden | S01, siswa kelas VIII |
| Tanggal | 6 November 2026 |
| Pewawancara | Hikmah Azizah |
| Materi | Segiempat (dipelajari di kelas VII) |
| Durasi | 30 menit, direkam dengan persetujuan siswa |
| Artefak pemicu | Buku catatan rumus/sifat segiempat dan lembar soal latihan |

## 2. Skema Pengodean

| Kode | Makna (interpretasi) | Jumlah kutipan |
|---|---|---|
| **K** | Konteks/pengalaman belajar sebelumnya | 3 (K01–K03) |
| **IL** | *Intrinsic Load*: kesulitan yang berasal dari kompleksitas materi itu sendiri | 5 (IL01–IL05) |
| **EL** | *Extraneous Load*: beban dari cara materi disajikan | 3 (EL01, EL02, EL05) |
| **GL** | *Germane Load*: strategi yang membantu membangun skema pemahaman | 3 (GL01, GL02, GL05) |
| **DS** | *Design Suggestion*: harapan siswa terhadap aplikasi | 3 (DS01–DS03) |

> Catatan: penomoran EL03–EL04 dan GL03–GL04 tidak ada di laporan. Jika butir tersebut memang ada di rekaman, sebaiknya ditambahkan agar jejak data lengkap.

## 3. Temuan per Kategori

### 3.1 Konteks Belajar (K)

- Pembelajaran sebelumnya bersifat **ekspositori**: guru menjelaskan di papan, siswa mencatat, lalu mengerjakan latihan soal (K02).
- Siswa mudah mengenali sisi dan sudut, tetapi **ragu membedakan sifat diagonal belah ketupat dan layang-layang** (K03).
- **Implikasi:** buku catatan merupakan sumber belajar utama siswa. Aplikasi sebaiknya terasa seperti "catatan yang hidup": ringkas, rapi, dan dapat dimanipulasi.

### 3.2 Beban Intrinsik (IL): apa yang sulit dari materinya

| Kode | Kesulitan | Konsep yang terlibat | Tingkat interaktivitas elemen |
|---|---|---|---|
| IL01 | Membedakan sifat khusus serta simetri lipat/putar belah ketupat dan jajargenjang yang "mirip bentuknya" | Sisi, sudut, diagonal, simetri (4 elemen sekaligus) | Tinggi |
| IL02 | Menghubungkan sudut berdekatan yang berjumlah 180° pada jajargenjang/trapesium | Garis sejajar, sudut dalam sepihak | Sedang–tinggi |
| IL03 | Butuh pemahaman dasar panjang sisi, tinggi, dan garis sejajar sebelum memakai rumus | Prasyarat: tinggi ⟂ alas, sisi sejajar | Sedang |
| IL04 | Menentukan jenis bangun dari ciri diagonal (tegak lurus/sama panjang) | Penalaran terbalik: sifat → bangun | Tinggi |
| IL05 | Tertukar rumus keliling dan luas | Konsep ukuran 1D vs 2D | Sedang |

**Kesimpulan IL:** kesulitan utama ada pada **perbandingan antarbangun** (IL01, IL04, K03) dan **makna di balik rumus** (IL03, IL05). Beban intrinsik tidak bisa dihilangkan, tetapi bisa dikelola dengan **segmentasi**, **urutan sederhana ke kompleks**, dan **pengaktifan prasyarat** terlebih dahulu.

### 3.3 Beban Ekstrinsik (EL): apa yang menyulitkan dari cara penyajian

| Kode | Masalah penyajian | Prinsip yang dilanggar |
|---|---|---|
| EL01 | Sketsa di catatan kurang rapi, tanda sejajar tidak jelas | *Signaling* (penanda visual) |
| EL02 | Teks materi terlalu panjang ke bawah, membuat malas membaca | *Segmenting*, *Coherence* |
| EL05 | Soal cerita panjang dan kalimatnya rumit | *Split attention*, beban memori kerja |

**Kesimpulan EL:** inilah peluang terbesar aplikasi. Gambar digital yang presisi dengan penanda konsisten, teks ringkas, dan soal cerita yang terstruktur dapat **langsung menurunkan beban ekstrinsik**.

### 3.4 Beban Germane (GL): apa yang sudah membantu siswa

| Kode | Strategi efektif | Fitur yang mendukung |
|---|---|---|
| GL01 | Gambar jelas dan contoh soal *step by step* | *Worked example* bertahap |
| GL02 | Membuka kembali catatan dan menghitung ulang untuk menemukan kesalahan | Tautan "Lihat contoh serupa" dan pembahasan yang menunjukkan langkah yang salah |
| GL05 | Mencocokkan ciri dari soal dengan catatan sifat | Fitur "Detektif Segiempat" (pencocokan sifat → bangun) dan tabel ringkasan sifat |

**Kesimpulan GL:** siswa sudah memiliki strategi metakognitif yang baik (mencocokkan, merefleksi kesalahan). Aplikasi perlu **memfasilitasi strategi tersebut**, bukan menggantinya.

### 3.5 Harapan Desain (DS)

| Kode | Harapan |
|---|---|
| DS01 | Gambar yang bisa digeser (diagonal/sudut) sehingga perubahannya langsung terlihat |
| DS02 | Simulasi dan latihan soal dengan pembahasan, agar bisa belajar mandiri di rumah |
| DS03 | Sedikit teks, sederhana, dan rapi seperti ringkasan rumus di buku catatan |

## 4. Matriks Keterlacakan: Temuan → Kebutuhan → Fitur

| Temuan | Kebutuhan | Fitur PRD |
|---|---|---|
| DS01, IL01, IL04, K03 | Visualisasi interaktif sifat bangun yang dapat dimanipulasi | **F02** Simulasi Interaktif |
| IL01, K03 | Perbandingan langsung dua bangun berdampingan | **F03** Mode Bandingkan |
| IL01 | Visualisasi simetri lipat dan putar | **F04** Animasi Simetri |
| IL02 | Visualisasi pasangan sudut berdekatan = 180° | F02 (lapisan "Sudut") |
| IL03 | Penjelasan komponen rumus yang terhubung ke gambar | **F05** Rumus Interaktif |
| IL05 | Pembedaan visual keliling (garis tepi) dan luas (daerah) | **F05** Keliling vs Luas |
| IL04, GL05 | Latihan penalaran dari sifat ke bangun | **F06** Detektif Segiempat |
| EL01 | Penanda geometri standar dan konsisten | **F02** + standar penanda (UI) |
| EL02, DS03 | Materi ringkas dan tersegmentasi | **F01** Kartu Materi Ringkas |
| DS03, GL05 | Ringkasan sifat dan rumus yang bisa dibuka cepat | **F08** Ringkasan |
| EL05 | Soal cerita yang terstruktur | **F07** Latihan (format soal cerita) |
| GL01, DS02 | Contoh soal langkah demi langkah | **F07** *Worked example* bertahap |
| GL02, DS02 | Umpan balik spesifik dan pembahasan | **F07** Umpan balik dan pembahasan |
| DS02 | Belajar mandiri dan memantau kemajuan | **F09** Progres |

## 5. Keterbatasan Data dan Rekomendasi

1. **Responden tunggal (n = 1).** Temuan belum dapat digeneralisasi. Disarankan menambah 3–5 siswa dengan tingkat kemampuan berbeda (tinggi/sedang/rendah) atau menambahkan wawancara guru untuk triangulasi.
2. **Data berupa persepsi siswa.** Disarankan juga menganalisis **jawaban tertulis** siswa pada lembar latihan (artefak) untuk melihat pola kesalahan nyata, misalnya rumus luas jajargenjang memakai sisi miring, bukan tinggi.
3. **Belum ada data perangkat.** Tanyakan jenis HP, kuota/koneksi internet, dan kebiasaan belajar (durasi, waktu belajar). Data ini memengaruhi keputusan offline dan ukuran aplikasi.
4. Validasi temuan ini dengan **kurikulum yang berlaku** (Capaian Pembelajaran Fase D) agar cakupan materi sesuai.
