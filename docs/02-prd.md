# 02 — Product Requirements Document (PRD)

| | |
|---|---|
| Produk | SegiempatKu (nama kerja) |
| Versi dokumen | 0.1 (draf) |
| Tanggal | 11 November 2026 |
| Pemilik | Hikmah Azizah, S1 Pendidikan Matematika |
| Status | Perencanaan |

## 1. Latar Belakang

Wawancara dengan siswa kelas VIII (S01) menunjukkan bahwa materi segiempat dipelajari melalui penjelasan guru, mencatat, dan latihan soal. Siswa mengalami:

- **beban intrinsik tinggi** saat membandingkan sifat antarbangun (terutama diagonal dan simetri belah ketupat, jajargenjang, dan layang-layang), saat menghubungkan sudut berdekatan 180°, dan saat membedakan rumus keliling dan luas;
- **beban ekstrinsik** dari sketsa yang kurang rapi, teks yang panjang, dan soal cerita yang rumit.

Siswa menginginkan aplikasi dengan gambar yang bisa digeser, latihan berpembahasan, dan tampilan ringkas. Detail ada di [01-analisis-kebutuhan.md](01-analisis-kebutuhan.md).

## 2. Pernyataan Masalah

> Siswa SMP kesulitan memahami **perbedaan sifat antarjenis segiempat** dan **makna rumus keliling/luas** karena materi disajikan secara statis dan padat teks, sehingga beban kognitif terpakai untuk memahami penyajian, bukan untuk memahami konsep.

## 3. Tujuan

### 3.1 Tujuan Produk

1. Menurunkan beban ekstrinsik melalui penyajian visual yang presisi, ringkas, dan konsisten.
2. Mengelola beban intrinsik melalui segmentasi materi dan simulasi yang memperlihatkan hubungan antarsifat.
3. Meningkatkan beban germane melalui contoh bertahap, latihan berumpan balik, dan aktivitas penalaran (sifat → bangun).
4. Memungkinkan siswa **belajar mandiri** di rumah melalui web atau Android, termasuk saat offline.

### 3.2 Tujuan Pembelajaran (mengacu CP Fase D, perlu diselaraskan dengan kurikulum sekolah)

Setelah menggunakan aplikasi, siswa dapat:

- **TP1.** Mengidentifikasi sifat-sifat persegi, persegi panjang, jajargenjang, belah ketupat, layang-layang, dan trapesium berdasarkan sisi, sudut, diagonal, dan simetri.
- **TP2.** Membedakan dua jenis segiempat berdasarkan sifat yang membedakannya.
- **TP3.** Menentukan jenis segiempat dari ciri-ciri yang diberikan, terutama ciri diagonal.
- **TP4.** Menggunakan hubungan sudut (jumlah sudut segiempat 360°, sudut berdekatan 180° di antara sisi sejajar) untuk menentukan besar sudut.
- **TP5.** Menghitung keliling dan luas segiempat serta memilih rumus yang tepat.
- **TP6.** Menyelesaikan soal cerita yang berkaitan dengan keliling dan luas segiempat.

### 3.3 Indikator Keberhasilan

| Metrik | Target | Cara ukur |
|---|---|---|
| Kevalidan media (ahli materi dan ahli media) | Kategori "valid" (≥ 3,26 dari 4 atau ≥ 81%) | Angket validasi |
| Kepraktisan (respons siswa) | Kategori "praktis" (≥ 81%) | Angket respons siswa |
| Beban kognitif ekstrinsik | Skor EL lebih rendah dibanding pembelajaran biasa | Kuesioner beban kognitif (Leppink dkk., 2013) |
| Hasil belajar | N-gain kategori sedang (≥ 0,3) | Pretes–postes |
| Teknis | Berjalan di Android 8+ dan Chrome/Edge/Firefox terbaru; offline | Uji perangkat |

Detail di [08-rencana-evaluasi.md](08-rencana-evaluasi.md).

## 4. Pengguna

### 4.1 Persona Utama: "Siswa Mandiri"

- Siswa SMP kelas VII–VIII, usia 12–14 tahun.
- Sudah atau sedang belajar segiempat di sekolah. Buku catatan adalah sumber utama.
- Belajar di rumah memakai HP Android (kadang HP orang tua) dengan kuota terbatas.
- Cepat bosan dengan teks panjang dan menyukai sesuatu yang bisa disentuh atau digeser.
- Kebutuhan: memahami perbedaan bangun, berlatih soal, dan mengetahui letak kesalahannya.

### 4.2 Persona Sekunder: "Guru Matematika"

- Memakai aplikasi sebagai alat peraga di kelas (proyektor) atau sebagai tugas rumah.
- Kebutuhan: simulasi yang jelas saat diproyeksikan dan latihan yang sesuai kurikulum.
- *(Fitur khusus guru seperti dashboard kelas berada di luar cakupan MVP.)*

## 5. Cakupan

### 5.1 Dalam Cakupan (MVP)

- 6 jenis segiempat: persegi, persegi panjang, jajargenjang, belah ketupat, layang-layang, trapesium (sembarang, sama kaki, siku-siku).
- Sifat: sisi, sudut, diagonal, simetri lipat, dan simetri putar.
- Keliling dan luas.
- Hubungan sudut (jumlah 360° dan sudut berdekatan 180°).
- Simulasi interaktif, latihan, pembahasan, ringkasan, dan progres lokal.
- Web (PWA) dan Android (APK).

### 5.2 Di Luar Cakupan (MVP)

- Login, akun, sinkronisasi cloud.
- Dashboard guru atau kelas.
- Materi selain segiempat (segitiga, lingkaran, dll.), meskipun arsitektur disiapkan agar mudah ditambah.
- iOS.
- Leaderboard, chat, atau fitur sosial.
- Konten berbayar atau iklan.

## 6. Fitur dan Kebutuhan Fungsional

Prioritas memakai MoSCoW: **M** = Must, **S** = Should, **C** = Could.

### F01 — Kartu Materi Ringkas `M`
*Dasar: EL02, DS03, IL01*

Materi tiap bangun disajikan sebagai rangkaian kartu pendek (satu konsep per kartu): Pengenalan → Sisi → Sudut → Diagonal → Simetri → Keliling dan Luas.

- Setiap kartu memiliki gambar utama dengan label menempel pada gambar.
- Teks per kartu ≤ 40 kata.
- Navigasi dengan tombol Lanjut/Kembali dan geser (swipe).
- Kartu terakhir berisi **cek pemahaman singkat** (1–2 soal).

**Kriteria penerimaan:**
- [ ] Setiap bangun memiliki 5–7 kartu.
- [ ] Tidak ada kartu dengan lebih dari 40 kata teks penjelasan.
- [ ] Indikator posisi kartu tampil (mis. "3 dari 6").

### F02 — Simulasi Interaktif ("Lab Segiempat") `M`
*Dasar: DS01, IL01, IL02, IL04, K03, EL01*

Kanvas berisi bangun segiempat yang titik sudutnya bisa digeser. Bentuk tetap mempertahankan jenisnya (mis. jajargenjang tetap jajargenjang saat digeser).

- **Lapisan informasi yang bisa dinyalakan/dimatikan** (agar tidak ramai sekaligus):
  - *Sisi*: panjang tiap sisi, tanda sama panjang, tanda sejajar.
  - *Sudut*: besar tiap sudut; menyorot pasangan sudut berdekatan dengan keterangan "∠A + ∠B = 180°".
  - *Diagonal*: kedua diagonal, panjangnya, titik potong, tanda siku-siku bila tegak lurus, tanda "dibagi dua sama panjang".
  - *Simetri*: sumbu simetri lipat.
- Panel kecil "Sifat yang berlaku" diperbarui secara langsung (✓/✗), misalnya "Diagonal sama panjang ✗".
- **Mode Bebas** (*Could*): segiempat bebas. Aplikasi mendeteksi dan menampilkan nama bangun yang terbentuk saat siswa menggeser titik.

**Kriteria penerimaan:**
- [ ] Drag lancar di HP (≥ 50 fps) dan bisa dengan mouse maupun sentuhan.
- [ ] Nilai panjang/sudut akurat (toleransi 0,1 satuan / 0,5°).
- [ ] Bangun tidak bisa "rusak" (titik tidak bisa keluar kanvas; sisi tidak bisa bersilangan).
- [ ] Maksimal 2 lapisan aktif secara default saat pertama dibuka.

### F03 — Mode Bandingkan `M`
*Dasar: IL01, K03*

Dua bangun ditampilkan berdampingan (atau atas-bawah di HP) dengan tabel perbandingan sifat. **Perbedaan disorot** dengan warna.

- Pasangan yang disarankan: belah ketupat vs jajargenjang, belah ketupat vs layang-layang, persegi vs belah ketupat, persegi panjang vs jajargenjang.
- Siswa juga bisa memilih pasangan sendiri.

**Kriteria penerimaan:**
- [ ] Tabel hanya menampilkan baris yang **berbeda** secara default; tombol "Tampilkan semua" untuk melihat baris yang sama.
- [ ] Kedua bangun dapat dimanipulasi seperti di F02.

### F04 — Animasi Simetri `S`
*Dasar: IL01*

- **Simetri lipat:** siswa mengetuk calon sumbu; bangun "dilipat" dengan animasi untuk memperlihatkan apakah kedua sisi berimpit.
- **Simetri putar:** tombol putar per langkah; penghitung menunjukkan berapa kali bangun menempati bingkainya dalam satu putaran penuh.

**Kriteria penerimaan:**
- [ ] Jumlah simetri lipat dan putar sesuai tabel di [04-spesifikasi-konten.md](04-spesifikasi-konten.md).
- [ ] Animasi ≤ 1,5 detik dan bisa diulang.

### F05 — Rumus Interaktif dan "Keliling vs Luas" `M`
*Dasar: IL03, IL05*

- Ketika satu variabel rumus diketuk (mis. `t` pada `L = a × t`), bagian gambar yang bersangkutan disorot (garis tinggi muncul dan berkedip).
- **Visual keliling:** animasi menelusuri garis tepi bangun dengan penjumlahan panjang sisi yang berjalan.
- **Visual luas:** daerah diisi petak satuan (grid). Untuk jajargenjang, ditampilkan animasi potong-geser menjadi persegi panjang.
- Warna konsisten: **keliling = oranye (garis)**, **luas = biru (daerah)** di seluruh aplikasi.

**Kriteria penerimaan:**
- [ ] Setiap variabel pada rumus keenam bangun dapat diketuk dan tersorot di gambar.
- [ ] Animasi turunan rumus luas tersedia minimal untuk jajargenjang, trapesium, belah ketupat/layang-layang.

### F06 — Detektif Segiempat `S`
*Dasar: IL04, GL05*

Aktivitas penalaran terbalik. Siswa diberi ciri-ciri (mis. "diagonal saling tegak lurus dan saling membagi dua sama panjang"), lalu memilih bangun yang mungkin. Versi interaktif: siswa memilih ciri-ciri dari daftar dan aplikasi menyaring bangun yang memenuhi (seperti pohon keputusan).

**Kriteria penerimaan:**
- [ ] Logika penyaringan sesuai tabel sifat (diuji dengan unit test).
- [ ] Jika jawaban bisa lebih dari satu bangun (mis. persegi juga memenuhi sifat belah ketupat), umpan balik menjelaskannya.

### F07 — Latihan Soal dengan Pembahasan `M`
*Dasar: DS02, GL01, GL02, EL05, IL05*

- **Tiga tingkat bantuan (fading):**
  1. *Contoh Soal*: pembahasan lengkap, dibuka langkah demi langkah.
  2. *Lengkapi*: sebagian langkah sudah terisi, siswa melengkapi sisanya.
  3. *Mandiri*: siswa mengerjakan sendiri dengan petunjuk opsional.
- **Tipe soal:** pilihan ganda, isian angka, benar/salah, mencocokkan, dan memilih pada gambar.
- **Soal cerita** selalu dibagi menjadi blok Diketahui / Ditanya / Gambar / Jawab. Tombol "Gambarkan" membuat sketsa bangun dari data soal.
- **Umpan balik spesifik** berdasarkan jenis kesalahan (mis. memakai rumus keliling saat ditanya luas → "Sepertinya kamu menghitung **keliling**. Yang ditanya **luas** (daerah di dalam bangun).").
- **Petunjuk bertingkat:** Petunjuk 1 (konsep), Petunjuk 2 (rumus), Petunjuk 3 (langkah pertama).
- Tombol **"Lihat contoh serupa"** membuka worked example yang sejenis (mendukung GL02).

**Kriteria penerimaan:**
- [ ] Minimal 10 soal per bangun dan 10 soal campuran (total ≥ 70 soal).
- [ ] Setiap soal memiliki pembahasan bertahap.
- [ ] Setiap soal pilihan ganda memiliki umpan balik khusus untuk setiap pengecoh.
- [ ] Isian angka menerima koma atau titik desimal.

### F08 — Ringkasan ("Catatanku") `M`
*Dasar: DS03, GL05, GL02*

- Satu halaman ringkasan per bangun: gambar, sifat (ikon + kata kunci), dan rumus. Gaya visual menyerupai catatan rapi.
- Tabel ringkasan sifat semua bangun yang bisa difilter per aspek (sisi/sudut/diagonal/simetri).
- Bisa dibuka cepat dari mana saja (ikon di navigasi bawah) tanpa kehilangan posisi latihan.

**Kriteria penerimaan:**
- [ ] Dapat dibuka dari layar latihan dan kembali ke soal yang sama.
- [ ] Muat dalam satu layar HP per bangun (dengan sedikit gulir).

### F09 — Progres Belajar `S`
*Dasar: DS02*

- Status per bangun: belum mulai / sedang / selesai.
- Skor latihan terakhir dan terbaik.
- Daftar "Perlu diulang" berisi konsep yang sering salah.
- Disimpan secara lokal. Tersedia tombol "Atur ulang progres".

### F10 — Pengaturan dan Aksesibilitas `S`

- Ukuran teks (normal/besar).
- Mode gelap.
- Mode "Kurangi animasi".
- Tentang aplikasi dan petunjuk penggunaan.

### F12 — Latihan Literasi Matematika `S` *(ditambahkan; sudah diimplementasikan)*
*Dasar: instrumen "Tabel 2 Soal dan Kisi-kisi Jawaban Mathematical Literacy Materi Segiempat Kelas VII"*

- 4 soal cerita, satu per indikator: *Mathematical Reasoning* (Keramik Lantai), *Formulating* (Taman Sekolah), *Employing* (Kolam Ikan), *Interpreting & Evaluating* (Lahan Parkir).
- Setiap soal dipecah menjadi tahap sesuai kisi-kisi. Soal tetap terlihat di atas (mengurangi *split attention*, EL05).
- Skor tiap tahap mengikuti rubrik (total 6 per soal, 24 seluruhnya). Skor tahap dibagi rata ke pertanyaan di dalamnya. Benar pada percobaan pertama mendapat poin penuh, benar setelah satu perbaikan mendapat setengah poin. Skor dibulatkan ke bawah per 0,5. Ini menerapkan prinsip **skor parsial** di Pedoman Umum Penskoran.
- Isian angka menerima format Indonesia: `240.000`, `Rp1.350.000`, `34,29`.
- Skor terbaik per soal dan per indikator tampil di halaman Progres.
- Data: `src/content/literacy.ts`. Kunci jawaban diverifikasi otomatis di `src/lib/quiz/literacy.test.ts`.

> **Catatan untuk instrumen:** di Pedoman Umum Penskoran, contoh "soal nomor 3" menyebut *luas kebun 120 m², lahan sayuran 72 m², bibit*, padahal soal nomor 3 adalah **Kolam Ikan**. Contohnya perlu disesuaikan.

### F13 — Koleksi Stiker `C` *(ditambahkan; sudah diimplementasikan)*

12 stiker yang menghargai perilaku belajar (menyelesaikan Persiapan, skor ≥ 80 di latihan tiap bangun, membuka Lab untuk 5 bangun, memecahkan 3 kasus Detektif, skor literasi ≥ 20/24). Pop-up muncul saat stiker baru didapat. Data: `src/content/badges.ts`.

### F11 — Pretes/Postes Terintegrasi `C` *(sudah diimplementasikan, menu ⚙️ Pengaturan → Mode Penelitian)*

- Pretes dan postes paralel, masing-masing 10 soal (TP1–TP6), tanpa umpan balik, terkunci setelah dikirim. Durasi pengerjaan dicatat.
- Angket beban kognitif: terjemahan draf Leppink dkk. (2013) — 3 butir IL, 3 EL, 4 GL (skala 0–10) — dan 1 butir usaha mental Paas (1992) (skala 1–9).
- Hasil: skor pretes/postes, N-gain (Hake) beserta kategorinya, rata-rata IL/EL/GL.
- Ekspor oleh siswa sendiri: **Salin hasil** (teks + baris CSV, ditempel di WhatsApp), **Bagikan**, atau **Unduh CSV** (versi web). Baris CSV dari banyak siswa bisa ditempel berurutan di Excel.
- Data: `src/content/assessment.ts`, logika: `src/lib/research.ts`.
- ⚠ Soal tes dan terjemahan angket **wajib divalidasi** sebelum dipakai untuk pengambilan data.

### F11 (rencana awal)

Untuk keperluan penelitian: paket soal pretes/postes dan kuesioner beban kognitif di dalam aplikasi, dengan ekspor hasil ke file CSV (tanpa identitas pribadi, hanya kode siswa).

## 7. User Story Utama

| ID | Sebagai | Saya ingin | Agar | Fitur |
|---|---|---|---|---|
| US01 | siswa | menggeser titik sudut belah ketupat dan melihat diagonalnya tetap tegak lurus | yakin dengan sifat diagonal belah ketupat | F02 |
| US02 | siswa | melihat belah ketupat dan layang-layang berdampingan dengan perbedaannya disorot | tidak tertukar lagi | F03 |
| US03 | siswa | mengetuk huruf `t` di rumus dan melihat tingginya di gambar | paham apa itu tinggi | F05 |
| US04 | siswa | melihat animasi keliling (garis) dan luas (petak) | tidak tertukar rumus keliling dan luas | F05 |
| US05 | siswa | mendapat penjelasan mengapa jawabanku salah | bisa memperbaiki sendiri tanpa bertanya | F07 |
| US06 | siswa | membuka ringkasan sifat saat mengerjakan soal | bisa mencocokkan ciri seperti di buku catatan | F08 |
| US07 | siswa | menebak bangun dari ciri-ciri diagonalnya | terlatih menganalisis sifat | F06 |
| US08 | siswa | soal cerita dipecah menjadi Diketahui/Ditanya | tidak pusing membaca soal panjang | F07 |
| US09 | siswa | memakai aplikasi tanpa internet | tetap bisa belajar meski kuota habis | NFR |
| US10 | guru | menampilkan simulasi di proyektor | menjelaskan sifat bangun secara visual di kelas | F02 |

## 8. Kebutuhan Non-Fungsional

| ID | Kategori | Kebutuhan |
|---|---|---|
| NFR01 | Platform | Web (Chrome, Edge, Firefox, Safari versi terbaru) dan Android 8.0+ |
| NFR02 | Offline | Semua fitur inti berfungsi offline setelah dibuka/dipasang pertama kali |
| NFR03 | Performa | Muat awal < 3 detik di 4G; interaksi drag ≥ 50 fps di HP RAM 3 GB |
| NFR04 | Ukuran | APK < 15 MB; bundle web awal < 300 KB gzip |
| NFR05 | Responsif | Layout optimal untuk 360 px hingga 1440 px; orientasi potret di HP |
| NFR06 | Aksesibilitas | Kontras teks minimal WCAG AA (4.5:1); target sentuh ≥ 44 px; informasi tidak hanya dibedakan dengan warna |
| NFR07 | Privasi | Tidak ada data pribadi yang dikumpulkan; tidak ada pelacak pihak ketiga |
| NFR08 | Bahasa | Bahasa Indonesia baku dan ramah remaja |
| NFR09 | Kebenaran | Seluruh konten matematika divalidasi ahli materi sebelum rilis |
| NFR10 | Pemeliharaan | Konten (materi/soal) disimpan sebagai data terpisah agar mudah ditambah tanpa mengubah kode |

## 9. Asumsi dan Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Responden kebutuhan hanya 1 siswa | Fitur mungkin tidak mewakili siswa lain | Tambah wawancara/angket kebutuhan; uji coba kelompok kecil |
| Simulasi drag sulit dibangun dengan baik | Fitur inti (F02) tertunda | Mulai dari F02 sejak sprint awal; prototipe satu bangun dulu |
| Kesalahan konten matematika | Miskonsepsi pada siswa | Validasi ahli materi; unit test logika geometri |
| HP siswa lambat | Simulasi patah-patah | Uji di HP murah sejak awal; batasi animasi |
| Fitur terlalu banyak sehingga justru menambah beban ekstrinsik | Bertentangan dengan tujuan | Lapisan yang bisa dimatikan; uji keterbacaan dengan siswa |
| Waktu pengerjaan terbatas (kuliah) | MVP tidak selesai | Prioritaskan fitur `M`; fitur `S`/`C` menyusul |

## 10. Pertanyaan Terbuka

1. Kurikulum yang dipakai sekolah sasaran (Kurikulum Merdeka?) dan urutan materinya.
2. Apakah definisi yang dipakai **inklusif** (persegi termasuk persegi panjang dan belah ketupat; jajargenjang mencakup belah ketupat, dll.) atau **eksklusif**? Ini memengaruhi kunci jawaban F06. Rekomendasi: inklusif sesuai matematika standar, dengan penjelasan hierarki.
3. Apakah aplikasi akan dipublikasikan di Google Play atau cukup dibagikan sebagai APK?
4. Apakah dibutuhkan fitur pretes/postes di dalam aplikasi untuk penelitian (F11)?
5. Nama aplikasi final dan identitas visual (logo, warna).
