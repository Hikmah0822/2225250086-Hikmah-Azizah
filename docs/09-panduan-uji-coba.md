# 09 — Panduan Uji Coba SegiempatKu

Panduan praktis untuk menguji aplikasi sebelum dan saat pengambilan data. Urutannya mengikuti tahap ADDIE (*Development → Implementation → Evaluation*) di [07-roadmap.md](07-roadmap.md). Teori dan kriteria penilaian ada di [08-rencana-evaluasi.md](08-rencana-evaluasi.md).

| Tahap | Siapa | Jumlah | Tujuan | Instrumen |
|---|---|---|---|---|
| A. Uji teknis | Peneliti | 3+ perangkat | Aplikasi berjalan di HP siswa | Checklist §2 |
| B. Validasi ahli materi | Dosen/guru matematika | 2–3 orang | Isi benar dan sesuai kurikulum | Angket §3.1 |
| C. Validasi ahli media | Dosen TIK/media pembelajaran | 2–3 orang | Tampilan dan interaksi layak | Angket §3.2 |
| D. Uji perorangan | Siswa (tinggi/sedang/rendah) | 3 siswa | Menemukan bagian yang membingungkan | Skenario §4, observasi §5, wawancara §6 |
| E. Uji kelompok kecil | Siswa | 6–10 siswa | Kepraktisan setelah revisi | Skenario §4, angket respons §7 |
| F. Uji lapangan | Satu kelas | 25–32 siswa | Efektivitas dan beban kognitif | Mode Penelitian di aplikasi §8 |

Revisi aplikasi dilakukan **setelah setiap tahap B–E**. Catat setiap revisi di tabel §9.

---

## 1. Persiapan

- [ ] Surat izin sekolah, persetujuan orang tua/wali, dan persetujuan siswa.
- [ ] Siswa diberi **kode** (S01, S02, …). Nama hanya dipakai di aplikasi dan di daftar hadir terpisah.
- [ ] Link web: **https://segiempatku.netlify.app**, atau file **SegiempatKu.apk** (versi terbaru).
- [ ] Untuk uji lapangan, minta siswa mengosongkan data lama: ⚙️ Pengaturan → *Ganti pengguna*, dan Progres → *Atur ulang progres*. Satu HP sebaiknya untuk satu siswa.
- [ ] Siapkan HP cadangan dan kuota/Wi-Fi untuk pembukaan pertama. Setelah dibuka sekali, aplikasi bisa dipakai offline.
- [ ] Siapkan perekam suara (dengan izin) untuk wawancara, dan lembar observasi §5.
- [ ] Soal pretes/postes, angket beban kognitif, dan 35 soal tambahan **sudah divalidasi** (tahap B).

## 2. Checklist Uji Teknis (Tahap A)

Isi satu kolom untuk setiap perangkat.

| Pemeriksaan | HP 1 | HP 2 | HP 3 | Laptop |
|---|---|---|---|---|
| Merek, tipe, versi Android/browser | | | | |
| Aplikasi terpasang dan terbuka (APK) atau web terbuka | | | | |
| Layar Selamat Datang muncul; nama tersimpan setelah aplikasi ditutup | | | | |
| Lab: titik bisa digeser dengan lancar (tidak patah-patah) | | | | |
| Animasi Keliling vs Luas dan Lipat/Putar berjalan | | | | |
| Tombol 🔊 Bacakan mengeluarkan suara berbahasa Indonesia | | | | |
| Latihan: isian angka dengan koma (12,5) dan titik ribuan (240.000) diterima | | | | |
| Mode pesawat: aplikasi tetap bisa dibuka dan dipakai | | | | |
| Mode Penelitian: tombol *Salin hasil* dan *Bagikan* berfungsi | | | | |
| Teks terbaca; tidak ada yang terpotong; tombol mudah diketuk | | | | |
| Catatan masalah | | | | |

## 3. Angket Validasi Ahli (Tahap B dan C)

Skala: **1** = tidak sesuai, **2** = kurang sesuai, **3** = sesuai, **4** = sangat sesuai. Sediakan kolom saran untuk setiap aspek.

### 3.1 Ahli Materi

| No | Aspek | Pernyataan |
|---|---|---|
| 1 | Kurikulum | Tujuan pembelajaran (TP1–TP6) sesuai dengan Capaian Pembelajaran Fase D |
| 2 | Kurikulum | Cakupan materi (6 bangun; sisi, sudut, diagonal, simetri, keliling, luas) sudah lengkap |
| 3 | Kebenaran konsep | Sifat-sifat setiap bangun pada kartu materi dan *Catatanku* benar |
| 4 | Kebenaran konsep | Definisi inklusif (persegi ⊂ persegi panjang ⊂ jajargenjang, dst.) disajikan dengan tepat |
| 5 | Kebenaran konsep | Simulasi Lab menunjukkan sifat bangun dengan benar saat titik digeser |
| 6 | Kebenaran konsep | Animasi keliling, luas, lipat, dan putar menjelaskan konsep dengan benar |
| 7 | Soal | Soal latihan sesuai dengan tujuan pembelajaran |
| 8 | Soal | Kunci jawaban dan pembahasan setiap soal benar |
| 9 | Soal | Umpan balik untuk jawaban salah tepat menjelaskan kesalahannya |
| 10 | Soal | Soal cerita dan literasi kontekstual serta sesuai usia siswa |
| 11 | Soal | Soal pretes dan postes paralel (setara tingkat kesulitannya) |
| 12 | Bahasa | Bahasa sesuai kaidah dan mudah dipahami siswa SMP |
| 13 | Bahasa | Istilah matematika digunakan secara konsisten |

### 3.2 Ahli Media

| No | Aspek | Pernyataan |
|---|---|---|
| 1 | Tampilan | Teks mudah dibaca (ukuran, warna, kontras) |
| 2 | Tampilan | Gambar bangun jelas, dan tanda sejajar, sama panjang, serta siku-siku mudah dikenali |
| 3 | Tampilan | Warna dan maskot menarik tetapi tidak mengganggu konten |
| 4 | Tampilan | Tata letak konsisten di semua halaman |
| 5 | Navigasi | Menu dan tombol mudah dipahami tanpa penjelasan |
| 6 | Navigasi | Siswa mudah kembali ke halaman sebelumnya atau ke Beranda |
| 7 | Interaktivitas | Simulasi Lab responsif dan mudah digunakan dengan jari |
| 8 | Interaktivitas | Umpan balik muncul segera dan jelas |
| 9 | Interaktivitas | Fitur Bacakan, pilah informasi, dan soal kembar membantu siswa |
| 10 | Beban kognitif | Satu layar memuat satu konsep, dan teks tidak terlalu padat |
| 11 | Beban kognitif | Label ditempatkan langsung pada gambar, tanpa perlu bolak-balik membaca |
| 12 | Teknis | Aplikasi berjalan lancar di HP dan browser yang diuji |
| 13 | Teknis | Aplikasi dapat digunakan tanpa internet |

**Analisis:** P = (jumlah skor ÷ skor maksimum) × 100%. Kriteria (sesuaikan dengan acuan dosen pembimbing): 81–100% sangat valid, 61–80% valid, 41–60% cukup valid, ≤ 40% tidak valid.

## 4. Skenario Tugas Siswa (Tahap D dan E)

Berikan tugas **satu per satu** secara lisan atau di kertas. **Jangan membantu** kecuali siswa benar-benar macet lebih dari 2 menit, dan catat jika Anda membantu. Minta siswa *berpikir sambil bersuara* (*think aloud*): "Ceritakan apa yang kamu pikirkan sambil mengerjakan."

| No | Tugas untuk siswa | Yang diamati | Indikator wawancara |
|---|---|---|---|
| T1 | Buka aplikasi dan isi nama serta kelasmu. | Lancar/bingung | — |
| T2 | Pelajari materi **Belah Ketupat** sampai kartu terakhir. | Membaca teks? Menekan 🔊? Mencoba demo Lipat/Putar? | EL02, DS03 |
| T3 | Di **Lab**, cari tahu apa yang selalu terjadi pada diagonal belah ketupat saat titiknya digeser. Lalu kerjakan tugasnya. | Menemukan lapisan Diagonal? Menggeser titik? | DS01, K03 |
| T4 | Buka **Bandingkan** dan jelaskan perbedaan belah ketupat dan layang-layang. | Bisa menyebut perbedaan diagonal? | IL01, K03 |
| T5 | Di kartu Keliling dan Luas **Jajargenjang**, tunjukkan mengapa luasnya a × t. | Memakai animasi Luas? Menyebut tinggi ⊥ alas? | IL03, IL05 |
| T6 | Kerjakan **Latihan Jajargenjang** sampai selesai. | Memakai petunjuk? Membaca umpan balik? Soal kembar dikerjakan benar? | GL01, GL02 |
| T7 | Kerjakan 2 kasus **Detektif**. | Strategi menjawab pertanyaan diagonal | IL04, GL05 |
| T8 | Kerjakan **Literasi Matematika soal 2 (Taman Sekolah)**. | Tahap mana yang macet? | EL05 |
| T9 | Buka **Progres** lalu **Latihan Ulang Pintar**. | Paham bahwa latihannya dari kesalahannya sendiri? | GL02 |

## 5. Lembar Observasi

Satu lembar per siswa.

| Kode siswa | Tingkat kemampuan | Perangkat | Tanggal |
|---|---|---|---|
| | tinggi / sedang / rendah | | |

| Tugas | Berhasil tanpa bantuan? (Y/T) | Waktu (menit) | Dibantu di bagian | Ekspresi/komentar siswa (kutipan) | Masalah tampilan/teknis |
|---|---|---|---|---|---|
| T1 | | | | | |
| T2 | | | | | |
| T3 | | | | | |
| T4 | | | | | |
| T5 | | | | | |
| T6 | | | | | |
| T7 | | | | | |
| T8 | | | | | |
| T9 | | | | | |

## 6. Pertanyaan Wawancara Pasca-Uji

Pakai **kode yang sama** dengan wawancara awal (K, IL, EL, GL, DS), agar hasilnya bisa dibandingkan dengan wawancara S01. Catat dengan format tabel yang sama (Kode · Kutipan verbatim · Bukti/artefak · Interpretasi).

**Konteks (K)**
- K1. Apa bedanya belajar segiempat dengan aplikasi ini dibanding dengan buku catatan?
- K2. Bagian mana yang paling sering kamu buka?

**Beban intrinsik (IL)**
- IL1. Sekarang, bagaimana caramu membedakan belah ketupat dan jajargenjang? Dan belah ketupat dengan layang-layang?
- IL2. Coba jelaskan mengapa dua sudut berdekatan pada jajargenjang berjumlah 180°.
- IL3. Kapan kamu memakai keliling dan kapan memakai luas? Bagaimana kamu mengingatnya?
- IL4. Bagian materi mana yang masih terasa sulit?

**Beban ekstrinsik (EL)**
- EL1. Apakah ada tampilan, tulisan, atau tombol yang membingungkan? Di mana?
- EL2. Apakah teks di kartu materi terlalu banyak, pas, atau terlalu sedikit?
- EL3. Apakah animasi, warna, atau maskot mengganggu konsentrasimu?
- EL4. Apakah langkah memilih informasi pada soal cerita membantu atau justru merepotkan?

**Beban germane (GL)**
- GL1. Fitur apa yang paling membantu saat jawabanmu salah?
- GL2. Apakah soal kembar dan Latihan Ulang Pintar membantumu? Mengapa?
- GL3. Apakah kamu memakai Catatanku saat mengerjakan soal? Bagaimana caranya?

**Saran desain (DS)**
- DS1. Apa yang paling kamu sukai dari aplikasi ini?
- DS2. Apa yang ingin kamu ubah atau tambahkan?
- DS3. Apakah kamu mau memakai aplikasi ini lagi di rumah? Mengapa?

## 7. Angket Respons Siswa (Tahap E)

Skala 1–4 (tidak setuju → sangat setuju). Kalimat sederhana untuk siswa:

1. Aplikasi ini mudah digunakan.
2. Aku tahu harus menekan tombol apa.
3. Gambar bangunnya jelas.
4. Tulisannya mudah dibaca dan tidak terlalu panjang.
5. Menggeser titik di Lab membantuku memahami sifat bangun.
6. Animasi keliling, luas, lipat, dan putar membantuku memahami konsep.
7. Penjelasan saat jawabanku salah membantuku memperbaiki kesalahan.
8. Tombol Bacakan membantuku memahami soal.
9. Aku senang belajar dengan aplikasi ini.
10. Aku ingin memakai aplikasi ini lagi.

Opsional: tambahkan **System Usability Scale (SUS)** versi Bahasa Indonesia (target skor ≥ 68).

**Kriteria kepraktisan** (contoh): 81–100% sangat praktis, 61–80% praktis, 41–60% cukup praktis, ≤ 40% tidak praktis.

## 8. Uji Lapangan dengan Mode Penelitian (Tahap F)

| Pertemuan | Kegiatan | Waktu |
|---|---|---|
| 1 | Pengantar, pemasangan aplikasi, isi nama/kelas, lalu **Pretes** (⚙️ → Mode Penelitian) | 40 menit |
| 2–4 | Belajar dengan aplikasi: Persiapan → materi per bangun → Lab → Latihan → Literasi | 2 × 40 menit per pertemuan |
| 5 | **Postes**, lalu **Angket** beban kognitif, lalu siswa menekan **Salin hasil** dan mengirimkannya ke peneliti (misalnya grup WhatsApp kelas atau Google Form isian bebas) | 40 menit |

**Mengumpulkan data:**
1. Setiap kiriman siswa berisi ringkasan dan **dua baris CSV** (judul kolom dan data).
2. Tempel baris judul sekali di Excel. Untuk setiap siswa, tempel baris datanya saja di bawahnya.
3. Excel → *Data → Text to Columns → Delimited → Comma* untuk memisahkan kolom.
4. Kolom yang tersedia: skor pretes/postes, `n_gain`, `IL_rata2`, `EL_rata2`, `GL_rata2`, `paas`, benar/salah dan jawaban per butir, serta durasi.
5. Analisis: rata-rata N-gain kelas, uji beda pretes–postes (uji-t berpasangan atau Wilcoxon), deskripsi IL/EL/GL, dan analisis butir untuk melihat miskonsepsi.

## 9. Catatan Revisi

| Tahap | Temuan / saran | Sumber (validator / kode siswa) | Revisi yang dilakukan | Tanggal |
|---|---|---|---|---|
| | | | | |

Saat meminta perubahan ke Claude Code, sertakan temuannya (misalnya *"S03 bingung tombol Lapisan di Lab"*). Perubahan akan dicatat di riwayat proyek.
