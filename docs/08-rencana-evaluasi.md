# 08 — Rencana Evaluasi dan Pengujian

Evaluasi terdiri atas dua bagian: **pengujian teknis** (apakah aplikasi berfungsi dengan benar) dan **evaluasi pendidikan** (apakah aplikasi valid, praktis, dan efektif menurunkan beban kognitif).

## 1. Pengujian Teknis

| Jenis | Alat | Cakupan |
|---|---|---|
| Unit test | Vitest | `lib/geometry`, `lib/shapes`, `lib/classify`, `lib/quiz`, `format.ts` (cakupan ≥ 90%) |
| Validasi konten | Skrip + skema (Zod/JSON Schema) | Semua soal sesuai skema; setiap soal memiliki pembahasan dan 3 petunjuk; kunci jawaban numerik diperiksa ulang dengan rumus |
| Komponen | Testing Library | QuestionView, NumericInput (koma/titik), StepReveal |
| End-to-end | Playwright (viewport HP dan desktop) | Alur: Beranda → Materi → Lab → Latihan → Pembahasan → Progres tersimpan |
| Perangkat nyata | Manual | ≥ 3 HP Android (termasuk satu RAM 2–3 GB), Chrome, Firefox, Safari |
| Offline | Manual (mode pesawat) | Semua halaman inti dapat dibuka |
| Performa | Lighthouse, Chrome DevTools | Skor Performance dan Accessibility ≥ 90; drag ≥ 50 fps |

### Kasus Uji Penting Logika Geometri

- Persegi diklasifikasikan **juga** sebagai persegi panjang, belah ketupat, jajargenjang, dan layang-layang.
- Belah ketupat yang digeser **tidak pernah** menghasilkan diagonal tidak tegak lurus.
- Jumlah sudut yang ditampilkan selalu 360° (setelah pembulatan, tampilkan nilai yang konsisten; hindari 89° + 91° + 90° + 89° = 359°).
- Luas dari rumus sama dengan luas dari *shoelace formula* untuk bangun acak.
- Bangun degenerat (titik berimpit/segaris) ditolak.

## 2. Evaluasi Pendidikan

### 2.1 Validasi Ahli

| Validator | Aspek | Instrumen |
|---|---|---|
| Ahli materi (dosen/guru matematika) | Kebenaran konsep, kesesuaian kurikulum, kualitas soal dan pembahasan, bahasa | Angket skala Likert 1–4 |
| Ahli media | Tampilan, navigasi, interaktivitas, keterbacaan, kesesuaian prinsip beban kognitif | Angket skala Likert 1–4 |

Kriteria kevalidan (contoh, sesuaikan dengan acuan dosen pembimbing): rata-rata ≥ 3,26 atau persentase ≥ 81% = **sangat valid**.

### 2.2 Kepraktisan

- Angket respons siswa (kemudahan, kemenarikan, kebermanfaatan).
- Opsional: **System Usability Scale (SUS)** versi Bahasa Indonesia, dengan target skor ≥ 68.
- Observasi saat uji coba: catat di mana siswa macet atau bertanya.

### 2.3 Pengukuran Beban Kognitif

Instrumen yang disarankan:

1. **Leppink dkk. (2013)**, 10 butir yang mengukur IL, EL, dan GL secara terpisah (skala 0–10). Instrumen ini **paling sesuai** karena memetakan langsung ke kode wawancara (IL/EL/GL). Gunakan versi terjemahan yang sudah divalidasi atau lakukan validasi terjemahan.
2. **Skala Paas (1992)**, 1 butir *mental effort* (skala 1–9), diberikan setelah setiap segmen (mis. setelah Lab, setelah Latihan). Instrumen ini ringan dan dapat ditanam di aplikasi (F11).

Hipotesis yang dapat diuji:

- Skor **EL** saat memakai aplikasi lebih rendah dibanding belajar dari catatan/buku.
- Skor **GL** lebih tinggi.
- Skor **IL** relatif sama (karena materinya sama), atau sedikit lebih rendah berkat segmentasi.

### 2.4 Hasil Belajar (opsional, untuk uji efektivitas)

- Pretes dan postes paralel yang mencakup TP1–TP6, dengan kisi-kisi berdasarkan [04-spesifikasi-konten.md](04-spesifikasi-konten.md).
- Analisis **N-gain** (Hake): g ≥ 0,7 tinggi; 0,3 ≤ g < 0,7 sedang; g < 0,3 rendah.
- Analisis butir: apakah miskonsepsi M01–M09 berkurang pada postes.

### 2.4a Instrumen di dalam aplikasi

Pretes, postes, dan angket di atas sudah tersedia di aplikasi (⚙️ Pengaturan → **Mode Penelitian**). Siswa mengirim hasilnya sendiri dengan tombol **Salin hasil** atau **Bagikan**. Tempelkan baris CSV dari setiap siswa ke satu lembar Excel untuk dianalisis. Kolomnya meliputi skor, N-gain, rata-rata IL/EL/GL, skor benar/salah per butir, jawaban per butir, dan durasi.

### 2.5 Wawancara Pasca-Uji

Gunakan kembali format wawancara awal (kode K/IL/EL/GL/DS) kepada S01 dan beberapa siswa lain, agar hasil **sebelum dan sesudah** dapat dibandingkan langsung. Contoh pertanyaan:

- "Sekarang, bagaimana cara kamu membedakan diagonal belah ketupat dan layang-layang?" (K03)
- "Bagian aplikasi mana yang masih membuat pusing?" (EL)
- "Fitur apa yang paling membantu saat kamu salah menjawab?" (GL02)

## 3. Etika Penelitian

- Persetujuan tertulis dari sekolah dan orang tua/wali, serta persetujuan dari siswa.
- Siswa diberi kode (S01, S02, ...), bukan nama, di semua data dan file ekspor.
- Foto dokumentasi wajah siswa hanya dipakai dengan izin; pertimbangkan untuk mengaburkan wajah pada laporan publik.
- Aplikasi tidak mengirim data apa pun ke server. Data penelitian diambil melalui ekspor manual (F11) atau angket terpisah.
