# SegiempatKu — Aplikasi Belajar Segiempat untuk Siswa SMP

> Nama kerja aplikasi. Silakan diganti jika sudah ada nama final.

Aplikasi pembelajaran matematika interaktif untuk materi **bangun datar segiempat** (persegi, persegi panjang, jajargenjang, belah ketupat, layang-layang, trapesium) bagi siswa SMP. Aplikasi ini berjalan di **web (browser)** dan **smartphone Android**.

Desainnya mengikuti **Teori Beban Kognitif (*Cognitive Load Theory*)** dan didasarkan pada wawancara kebutuhan dengan siswa kelas VIII (kode S01, 6 November 2026).

## Status

**MVP versi 0.1 sudah bisa dijalankan** (Sprint 0–5 sebagian besar selesai, lihat [docs/07-roadmap.md](docs/07-roadmap.md)). Konten matematika **belum divalidasi ahli**.

## Cara Menjalankan

1. Pasang **Node.js versi 20 atau 22 (LTS)** dari <https://nodejs.org>.
2. Buka terminal di folder ini, lalu:

```bash
npm install        # sekali saja
npm run dev        # buka alamat yang muncul (mis. http://localhost:5173)
```

Untuk mencoba di HP, sambungkan HP ke Wi-Fi yang sama lalu buka alamat **Network** yang ditampilkan `npm run dev`.

Perintah lain:

```bash
npm run test       # 230 unit test: geometri, penilaian, konten, literasi, stiker, soal kembar, pembacaan suara, dan instrumen penelitian
npm run build      # build produksi ke folder dist/ (siap diunggah ke Netlify/Vercel)
```

### Membuat APK Android

1. Pasang **Android Studio**.
2. `npm run android:sync`, lalu `npm run android:open`.
3. Di Android Studio: *Build → Build App Bundle(s) / APK(s) → Build APK(s)*.

## Fitur yang Sudah Ada

| Fitur PRD | Isi |
|---|---|
| F01 Kartu materi | 6 kartu Persiapan + 6 kartu untuk tiap bangun, ≤ 40 kata per kartu, bisa digeser (swipe) |
| F02 Lab | 9 pilihan bangun (termasuk 3 jenis trapesium dan mode Bebas), titik bisa digeser, 4 lapisan (sisi, sudut, diagonal, simetri), panel sifat langsung, pasangan sudut 180°, tugas eksplorasi terarah |
| F03 Bandingkan | Dua bangun berdampingan, tabel yang hanya menampilkan perbedaan |
| F05 Rumus interaktif | Ketuk variabel pada rumus untuk menyorot bagiannya di gambar |
| F06 Detektif | Bangun misteri dengan orientasi acak dan pertanyaan diagonal satu per satu |
| F07 Latihan | 71 soal (35 di antaranya draf v0.3, perlu validasi): contoh → lengkapi → mandiri, 3 petunjuk, umpan balik per miskonsepsi, pembahasan bertahap, contoh serupa |
| F12 Literasi Matematika | 4 soal dari kisi-kisi *Mathematical Literacy* (Reasoning, Formulating, Employing, Interpreting). Dikerjakan per tahap sesuai kisi-kisi, skor per tahap sesuai rubrik (6 per soal, total 24), dengan skor parsial dan pembahasan tiap tahap |
| F04 Animasi simetri | Lipat bangun di 4 garis calon sumbu dan lihat apakah berimpit; putar 90° demi 90° untuk menghitung simetri putar |
| F05 Keliling vs Luas | Animasi telusur keliling (oranye) dan luas (petak, potong-geser jajargenjang, dua trapesium, setengah persegi panjang diagonal) |
| F11 Mode Penelitian | Pretes & postes paralel (10 soal), angket beban kognitif (Leppink dkk., 2013) + usaha mental (Paas), N-gain, ekspor hasil (salin, bagikan, CSV) |
| F13 Koleksi Stiker | 12 stiker (Ahli tiap bangun, Penjelajah Lab, Detektif Hebat, Bintang Literasi, dll.) dengan pop-up saat didapat |
| Selamat Datang | Nama & kelas siswa (hanya di perangkat), sapaan dengan nama, maskot Beru/Kelin/Kimi, tema taman |
| Latihan Ulang Pintar | Paket latihan dari kesalahan siswa sendiri; **soal kembar** (angka baru) muncul otomatis setelah siswa butuh pembahasan |
| 🔊 Bacakan | Membacakan soal, cerita literasi, dan kartu materi (suara bawaan HP/browser, simbol matematika dibaca dengan benar) |
| Pilah informasi | Pada soal cerita, siswa memilih informasi yang diperlukan (ada informasi pengecoh) dan menentukan apa yang ditanya sebelum menjawab |
| F08 Catatanku | Ringkasan per bangun + tabel sifat dengan filter |
| F09 Progres | Disimpan di perangkat, daftar "Perlu diulang" |
| F10 Pengaturan | Ukuran teks, tema gelap, kurangi animasi |
| PWA | Bisa dipasang dan dipakai offline |

## Dokumen Perencanaan

Baca sesuai urutan berikut:

| No | Dokumen | Isi |
|----|---------|-----|
| 0 | [CLAUDE.md](CLAUDE.md) | Panduan untuk AI asisten (Claude Code) saat membangun aplikasi: konteks, aturan, konvensi |
| 1 | [docs/01-analisis-kebutuhan.md](docs/01-analisis-kebutuhan.md) | Sintesis hasil wawancara → temuan beban kognitif → kebutuhan |
| 2 | [docs/02-prd.md](docs/02-prd.md) | *Product Requirements Document*: tujuan, fitur, user story, kriteria penerimaan |
| 3 | [docs/03-desain-pembelajaran.md](docs/03-desain-pembelajaran.md) | Prinsip desain instruksional berbasis beban kognitif dan alur belajar |
| 4 | [docs/04-spesifikasi-konten.md](docs/04-spesifikasi-konten.md) | Materi, tabel sifat, rumus, miskonsepsi, format bank soal dan contoh soal |
| 5 | [docs/05-arsitektur-teknis.md](docs/05-arsitektur-teknis.md) | Tech stack, struktur folder, model data, build web dan Android |
| 6 | [docs/06-desain-ui-ux.md](docs/06-desain-ui-ux.md) | Peta layar, wireframe, sistem desain, aksesibilitas |
| 7 | [docs/07-roadmap.md](docs/07-roadmap.md) | Tahapan pengerjaan per sprint dan checklist |
| 8 | [docs/08-rencana-evaluasi.md](docs/08-rencana-evaluasi.md) | Pengujian teknis, validasi ahli, uji kepraktisan, dan pengukuran beban kognitif |
| 9 | [docs/09-panduan-uji-coba.md](docs/09-panduan-uji-coba.md) | Panduan praktis uji coba: checklist teknis, angket validasi, skenario tugas, lembar observasi, pertanyaan wawancara |

## Teknologi

- **React + TypeScript + Vite + Tailwind CSS** untuk antarmuka
- **SVG + Pointer Events** untuk simulasi geometri yang bisa digeser
- **PWA** (`vite-plugin-pwa`) agar bisa dipasang dan dipakai offline di browser
- **Capacitor** untuk membungkus web app menjadi aplikasi Android (.apk/.aab)
- **Zustand** untuk menyimpan progres secara lokal di perangkat (tanpa login, tanpa server)
