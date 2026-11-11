# 07 — Roadmap Pengembangan

Model pengembangan mengikuti **ADDIE** (umum dipakai pada penelitian R&D pendidikan), dengan tahap *Development* dikerjakan per sprint (±2 minggu per sprint).

| Tahap ADDIE | Kegiatan | Dokumen/Output |
|---|---|---|
| **Analysis** | Wawancara siswa ✅, analisis kurikulum, analisis perangkat | [01-analisis-kebutuhan.md](01-analisis-kebutuhan.md) |
| **Design** | PRD, desain pembelajaran, konten, arsitektur, wireframe | Dokumen 02–06, prototipe Figma |
| **Development** | Sprint 0–6 di bawah, validasi ahli | Aplikasi web + APK |
| **Implementation** | Uji coba siswa | Data angket, log |
| **Evaluation** | Analisis kevalidan, kepraktisan, beban kognitif, hasil belajar | [08-rencana-evaluasi.md](08-rencana-evaluasi.md) |

## Fase 0 — Penyempurnaan Analisis dan Desain

- [ ] Tambah wawancara/angket kebutuhan ke 3–5 siswa lain dan 1 guru
- [ ] Analisis jawaban tertulis siswa di lembar latihan untuk menemukan pola kesalahan
- [ ] Konfirmasi kurikulum dan definisi trapesium (lihat PRD §10)
- [ ] Validasi [04-spesifikasi-konten.md](04-spesifikasi-konten.md) oleh dosen pembimbing/guru
- [ ] Prototipe Figma untuk 4 layar utama dan uji ke siswa
- [ ] Tetapkan nama aplikasi dan ikon

## Sprint 0 — Fondasi Proyek

- [x] Inisialisasi Vite + React + TypeScript + Tailwind
- [x] ESLint, Vitest *(Prettier dan Playwright belum)*
- [x] Router dan kerangka halaman (kosong) + BottomNav
- [x] `format.ts` (angka Indonesia)
- [x] Setup PWA (manifest, ikon, service worker)
- [ ] GitHub repo + GitHub Actions (lint, typecheck, test, build)
- [ ] Deploy otomatis ke Netlify/Vercel

**Selesai jika:** aplikasi kosong dapat dibuka di HP melalui URL dan bisa dipasang sebagai PWA.

## Sprint 1 — Mesin Geometri (inti teknis, risiko tertinggi)

- [x] `lib/geometry`: vektor, jarak, sudut, sejajar, tegak lurus, luas (shoelace), titik potong diagonal + tes
- [x] `lib/shapes`: model parametrik **jajargenjang** dan **belah ketupat** + tes
- [x] `ShapeFigure` (pointer events, mouse, sentuh, dan keyboard)
- [x] Penanda: sama panjang, sejajar, siku-siku, busur sudut (di dalam `ShapeFigure`)
- [x] Lapisan Sisi dan Diagonal
- [ ] **Uji performa drag di HP Android murah** *(drag sudah diuji di emulasi browser, belum di HP nyata)*

**Selesai jika:** belah ketupat dapat digeser di HP dengan lancar dan diagonal selalu tampak tegak lurus.

## Sprint 2 — Lab Lengkap (F02)

- [x] Model parametrik untuk 4 bangun lainnya (+ trapesium sama kaki/siku-siku)
- [x] Lapisan Sudut (termasuk sorotan pasangan 180°) dan Simetri (sumbu statis)
- [x] Panel "Sifat yang berlaku" (✓/✗ langsung)
- [x] Tugas eksplorasi terarah per bangun
- [x] `lib/classify` + Mode Bebas (Could)

## Sprint 3 — Materi dan Ringkasan (F01, F08, Persiapan)

- [x] Halaman kartu materi + navigasi swipe + indikator
- [x] Data kartu untuk Persiapan dan 6 bangun
- [x] Tautan "Coba di Lab" dengan lapisan yang sudah aktif
- [x] Halaman Catatanku per bangun + tabel sifat semua bangun dengan filter
- [x] `InteractiveFormula` (F05): ketuk variabel → sorot di gambar

## Sprint 4 — Latihan (F07)

- [x] Skema soal (tipe TypeScript) + validator konten di `content.test.ts`
- [x] Tipe soal: pilihan ganda, multi-select, isian angka, benar/salah
- [x] Petunjuk bertingkat, pembahasan bertahap (`StepReveal`)
- [x] `lib/quiz/grade.ts`: pemetaan jawaban → miskonsepsi + umpan balik
- [x] Format soal cerita (Diketahui/Ditanya/Gambar)
- [x] Alur fading: Contoh → Lengkapi → Mandiri
- [x] Input ≥ 70 soal *(71 soal; 35 soal tambahan v0.3 masih draf dan perlu divalidasi ahli)*

## Sprint 5 — Bandingkan, Simetri, Keliling vs Luas, Detektif (F03, F04, F05, F06)

- [x] Mode Bandingkan dengan tabel perbedaan
- [x] Animasi lipat dan putar (`SymmetryDemo`)
- [x] Animasi keliling (telusur tepi) dan luas (petak, potong-geser) (`PerimeterAreaDemo`)
- [x] Detektif Segiempat (pohon keputusan bertahap)

## Sprint 6 — Progres, Pengaturan, Android, Pemolesan (F09, F10)

- [x] Progress store + halaman Progres + daftar "Perlu diulang"
- [x] Pengaturan: ukuran teks, mode gelap, kurangi animasi
- [ ] Capacitor: build APK, ikon, splash, orientasi potret *(proyek `android/` dan orientasi potret sudah; APK dibuat di Android Studio; ikon Android masih bawaan Capacitor)*
- [ ] Uji di minimal 3 perangkat Android berbeda dan 3 browser
- [ ] Audit aksesibilitas (Lighthouse ≥ 90) dan ukuran bundle
- [ ] Uji offline penuh (mode pesawat)

**Rilis v1.0 (MVP)** → masuk validasi ahli.

## Fase Validasi dan Uji Coba

- [ ] Validasi ahli materi dan ahli media → revisi
- [ ] Uji coba perorangan (3 siswa) → revisi
- [ ] Uji coba kelompok kecil (6–10 siswa) → revisi
- [ ] Uji coba lapangan (1 kelas) → analisis data

## Prioritas Jika Waktu Terbatas

Urutan minimal yang tetap menjawab temuan wawancara:

1. **F02 Lab** (DS01: permintaan utama siswa)
2. **F07 Latihan + pembahasan** (DS02)
3. **F01 Kartu materi** + **F08 Ringkasan** (DS03, EL02)
4. **F03 Bandingkan** (IL01, K03)
5. F05, F06, F04, F09, F10
