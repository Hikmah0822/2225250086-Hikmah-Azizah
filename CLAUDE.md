# CLAUDE.md

Panduan bagi Claude Code (dan pengembang lain) saat bekerja di repositori ini. **Baca file ini sebelum menulis kode.**

## 1. Konteks Proyek

- **Apa:** Aplikasi belajar interaktif materi *segiempat* untuk siswa SMP (kelas VII–VIII).
- **Siapa pembuatnya:** Mahasiswa S1 Pendidikan Matematika. Penjelasan teknis ke pemilik proyek harus jelas dan tidak berasumsi ia developer berpengalaman.
- **Untuk siapa:** Siswa SMP usia ±12–14 tahun yang belajar mandiri di rumah, sebagian besar memakai HP Android kelas menengah ke bawah.
- **Landasan:** Teori Beban Kognitif (Sweller). Setiap fitur harus **mengurangi beban ekstrinsik (EL)**, **mengelola beban intrinsik (IL)**, dan **mendorong beban germane (GL)**. Lihat [docs/01-analisis-kebutuhan.md](docs/01-analisis-kebutuhan.md) dan [docs/03-desain-pembelajaran.md](docs/03-desain-pembelajaran.md).
- **Platform:** Web (PWA) dan Android (melalui Capacitor) dari satu basis kode.

## 2. Dokumen Acuan

| Butuh info tentang... | Buka |
|---|---|
| Fitur, prioritas, kriteria penerimaan | [docs/02-prd.md](docs/02-prd.md) |
| Aturan desain pembelajaran | [docs/03-desain-pembelajaran.md](docs/03-desain-pembelajaran.md) |
| Sifat, rumus, dan soal yang benar | [docs/04-spesifikasi-konten.md](docs/04-spesifikasi-konten.md) |
| Stack, struktur folder, model data | [docs/05-arsitektur-teknis.md](docs/05-arsitektur-teknis.md) |
| Tampilan dan komponen UI | [docs/06-desain-ui-ux.md](docs/06-desain-ui-ux.md) |
| Urutan pengerjaan | [docs/07-roadmap.md](docs/07-roadmap.md) |
| Uji coba ke siswa/validator | [docs/09-panduan-uji-coba.md](docs/09-panduan-uji-coba.md) |

Jika kode bertentangan dengan dokumen, **tanyakan dulu** ke pemilik proyek. Jangan diam-diam mengubah salah satunya.

## 3. Tech Stack

- React 18 + TypeScript (mode `strict`) + Vite
- Tailwind CSS
- Zustand (state) dengan `persist` ke localStorage
- React Router (`HashRouter`, agar jalan di hosting statis dan di Capacitor)
- Rumus ditampilkan dengan komponen `InteractiveFormula` buatan sendiri (bukan KaTeX), supaya setiap variabel bisa diketuk dan menyorot bagian gambar
- SVG buatan sendiri + Pointer Events untuk simulasi geometri (tanpa library geometri berat)
- `vite-plugin-pwa` untuk offline/PWA
- Capacitor 6 untuk build Android (folder `android/`)
- Vitest untuk unit test logika dan validasi konten. E2E (Playwright) belum dipasang.

Jangan menambah dependensi baru tanpa alasan yang jelas. Sebutkan alasannya saat menambahkan.

## 4. Perintah

```bash
npm install          # pasang dependensi
npm run dev          # server pengembangan
npm run build        # build produksi ke dist/
npm run preview      # pratinjau hasil build
npm run test         # unit test + validasi konten (Vitest)
npm run lint         # ESLint
npm run typecheck    # tsc (aplikasi + file konfigurasi)
npm run android:sync # build web lalu salin ke proyek Android
npm run android:open # buka di Android Studio
npm run icons        # buat ulang ikon PNG (butuh Python + Pillow)
```

Sebelum menyatakan suatu tugas selesai, jalankan `npm run typecheck`, `npm run lint`, dan `npm run test`.

## 5. Aturan Wajib: Desain Beban Kognitif

Aturan ini berasal langsung dari temuan wawancara. Kode dalam kurung merujuk ke kode wawancara.

1. **Teks minimal.** Satu layar materi berisi paling banyak ±40 kata teks penjelasan. Poin daftar paling banyak 4 butir per kartu. Utamakan gambar, tabel ringkas, dan label. (EL02, DS03)
2. **Satu konsep per layar.** Materi dipecah menjadi segmen kecil yang bisa dilanjutkan dengan tombol "Lanjut". Jangan menggabungkan sifat sisi, sudut, diagonal, dan simetri dalam satu layar. (IL01, IL04)
3. **Integrasi gambar dan teks (hindari *split attention*).** Label dan ukuran ditulis **langsung pada gambar**, bukan di keterangan terpisah. (EL01)
4. **Penanda visual konsisten.** Tanda sejajar (panah), tanda sama panjang (garis kecil), tanda siku-siku (kotak kecil), dan warna per elemen **harus sama di seluruh aplikasi**. Selalu gunakan `ShapeFigure` (warna diatur lewat variabel CSS `--g-*` di `src/styles/index.css`), jangan menggambar bangun sendiri. (EL01)
5. **Contoh soal bertahap.** Pembahasan selalu langkah demi langkah dan dibuka satu per satu. Gunakan pola *worked example → completion problem → soal mandiri*. (GL01, DS02)
6. **Umpan balik spesifik.** Jawaban salah harus diberi penjelasan *mengapa* salah dan petunjuk, bukan hanya "Salah". (GL02)
7. **Soal cerita dipecah.** Soal cerita ditampilkan dengan struktur *Diketahui → Ditanya → Gambar → Jawab*. (EL05)
8. **Tidak ada elemen dekoratif yang mengganggu.** Tanpa musik otomatis atau animasi yang terus bergerak di layar materi dan soal. Tema visual adalah **"Taman"** (hijau, krem, bunga) dengan tiga **maskot orisinal**: Beru (beruang, memegang belah ketupat), Kelin (kelinci, memegang persegi), dan Kimi (kucing, memegang trapesium), di `src/components/ui/Mascot.tsx`. Maskot hanya boleh muncul di layar Selamat Datang, Beranda, umpan balik, dan halaman hasil, **tidak pernah di dalam gambar materi atau soal**. Jangan memakai karakter atau gambar milik pihak lain (kartun, film, karya fan art) karena aplikasi ini dipublikasikan.

## 6. Aturan Wajib: Kebenaran Matematika

- **Semua sifat, rumus, dan kunci jawaban mengacu ke [docs/04-spesifikasi-konten.md](docs/04-spesifikasi-konten.md).** Jangan mengarang sifat atau soal baru tanpa diverifikasi.
- Fungsi geometri (jarak, sudut, cek sejajar/tegak lurus, luas) berada di `src/lib/geometry/` dan **wajib memiliki unit test**.
- Perbandingan bilangan desimal memakai toleransi (`EPS = 1e-6` untuk perhitungan, toleransi tampilan 0,5° untuk sudut dan 0,1 satuan untuk panjang).
- Tampilan angka mengikuti format Indonesia: koma desimal (`12,5 cm`), satuan derajat (`90°`), satuan luas (`cm²`).
- Sudut ditampilkan sebagai bilangan bulat derajat kecuali konteks meminta desimal.

## 7. Bahasa dan Penulisan

- **Seluruh teks UI dalam Bahasa Indonesia** yang baku tetapi ramah untuk remaja. Gunakan sapaan "kamu".
- Istilah mengikuti buku teks SMP: *jajargenjang*, *belah ketupat*, *layang-layang*, *trapesium*, *diagonal*, *simetri lipat*, *simetri putar*, *keliling*, *luas*.
- Konten belajar (kartu materi, sifat, soal, tugas Lab, pohon Detektif) disimpan sebagai data di `src/content/`. Label UI pendek (tombol, judul) boleh ditulis langsung di komponen.
- Nama variabel, fungsi, dan komentar kode dalam **Bahasa Inggris**. Konten dan teks UI dalam Bahasa Indonesia.

## 8. Konvensi Kode

- Komponen React: `PascalCase.tsx`, satu komponen utama per file.
- Hook: `useSomething.ts`. Utilitas: `camelCase.ts`.
- Logika murni (geometri, penilaian soal) dipisah dari komponen UI agar mudah diuji.
- Konten (materi, soal) disimpan sebagai **data TypeScript** di `src/content/`, bukan di dalam JSX. `src/content/content.test.ts` otomatis memeriksa: id soal unik, kunci jawaban ada, setiap pengecoh punya umpan balik, kartu ≤ 40 kata, dan tabel sifat cocok dengan mesin geometri. Tambah soal → jalankan `npm run test`.
- Peta kode penting:
  - `src/lib/geometry/` — vektor, ukuran, predikat (sejajar, tegak lurus, simetri)
  - `src/lib/shapes/` — model bangun yang dibatasi saat titik digeser
  - `src/lib/classify/` — deteksi jenis segiempat (definisi inklusif)
  - `src/lib/quiz/grade.ts` — penilaian dan diagnosis miskonsepsi
  - `src/components/geometry/ShapeFigure.tsx` — satu-satunya komponen penggambar bangun (semua penanda geometri ada di sini)
- Hindari `any`. Gunakan tipe dari `src/types/`.
- Komponen interaktif harus bisa disentuh dengan jari: target sentuh minimal **44×44 px**.

## 9. Privasi dan Keamanan (pengguna anak)

- **Tidak ada login dan tidak ada data yang dikirim ke server**, tidak ada analitik pihak ketiga, dan tidak ada iklan pada versi pertama.
- Layar Selamat Datang meminta **nama dan kelas** hanya untuk menyapa siswa (`src/store/profileStore.ts`). Data ini, beserta progres belajar, **hanya disimpan di perangkat** (localStorage) dan tidak boleh dikirim ke mana pun tanpa persetujuan pemilik proyek dan tinjauan privasi.
- Jika nanti ditambahkan fitur kelas atau guru, perlu persetujuan pemilik proyek dan tinjauan privasi terlebih dahulu.

## 10. Performa

- Target perangkat: Android 8+, RAM 2–3 GB, layar 360×640 dp.
- Ukuran bundle awal di bawah 300 KB gzip. Halaman materi dan simulasi di-*lazy load*.
- Simulasi drag harus berjalan lancar (≥ 50 fps). Gunakan `requestAnimationFrame` dan hindari render ulang seluruh pohon komponen.
- Seluruh fitur inti harus berjalan **offline** setelah kunjungan pertama.

## 11. Cara Bekerja

- Kerjakan sesuai urutan di [docs/07-roadmap.md](docs/07-roadmap.md). Centang item yang selesai.
- Perubahan kecil dan bertahap lebih baik. Satu fitur, satu PR/commit yang jelas.
- Saat menambah fitur, sebutkan kode kebutuhan PRD yang dipenuhi (mis. `F03`) di pesan commit.
