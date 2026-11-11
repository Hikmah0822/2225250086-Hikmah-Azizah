# 03 — Desain Pembelajaran Berbasis Teori Beban Kognitif

## 1. Kerangka Teori Singkat

Teori Beban Kognitif (Sweller, 1988; Sweller, van Merriënboer, & Paas, 2019) menyatakan bahwa **memori kerja terbatas**. Ada tiga jenis beban:

| Jenis | Sumber | Strategi aplikasi |
|---|---|---|
| **Intrinsik (IL)** | Kompleksitas materi (banyaknya elemen yang harus diproses bersamaan) | **Kelola**: segmentasi, urutan sederhana ke kompleks, aktifkan prasyarat |
| **Ekstrinsik (EL)** | Cara penyajian yang tidak efektif | **Kurangi**: penyajian visual terintegrasi, ringkas, konsisten |
| **Germane (GL)** | Upaya membangun skema | **Dorong**: contoh bertahap, perbandingan, refleksi, latihan bervariasi |

## 2. Prinsip Desain dan Penerapannya

| Prinsip (Mayer & Sweller) | Penerapan di aplikasi | Temuan |
|---|---|---|
| **Segmenting** | Materi dalam kartu kecil, satu konsep per kartu; lapisan simulasi bisa dinyalakan satu per satu | EL02, IL01 |
| **Pre-training** | Kartu prasyarat (sejajar, tegak lurus, tinggi, diagonal, sudut berdekatan) sebelum masuk sifat bangun | IL03 |
| **Signaling** | Penanda standar (tanda sejajar, sama panjang, siku-siku); sorotan warna pada perbedaan | EL01, IL01 |
| **Spatial contiguity** (hindari *split attention*) | Label dan ukuran menempel di gambar; rumus berdampingan dengan gambar | EL01, EL05 |
| **Coherence** | Tanpa dekorasi, musik, atau teks yang tidak perlu | DS03 |
| **Redundancy** | Tidak menampilkan teks yang sama dengan isi gambar; pilih salah satu | EL02 |
| **Worked example effect** | Contoh soal lengkap yang dibuka langkah demi langkah | GL01 |
| **Completion problem dan fading** | Contoh lengkap → sebagian kosong → mandiri | GL01, DS02 |
| **Variability** | Bangun dalam berbagai orientasi dan ukuran (bukan selalu "tegak") | IL04 |
| **Self-explanation** | Pertanyaan "Mengapa?" setelah eksplorasi simulasi | GL05 |
| **Expertise reversal** | Siswa yang sudah mahir dapat melewati contoh soal dan langsung ke soal mandiri | — |
| **Isolated-interacting elements** | Sifat diperkenalkan terpisah dahulu, lalu dihubungkan dalam Mode Bandingkan | IL01, IL04 |

## 3. Struktur Materi

```
Beranda
├── 0. Persiapan (pre-training)
│   ├── Garis sejajar dan tanda sejajar
│   ├── Garis tegak lurus dan tanda siku-siku
│   ├── Diagonal itu apa?
│   ├── Tinggi bangun (selalu tegak lurus alas)
│   └── Sudut berdekatan pada garis sejajar (berjumlah 180°)
├── 1. Persegi Panjang
├── 2. Persegi
├── 3. Jajargenjang
├── 4. Belah Ketupat
├── 5. Layang-layang
├── 6. Trapesium
├── 7. Keluarga Segiempat (hierarki dan perbandingan)
└── 8. Tantangan Campuran (Detektif + soal cerita)
```

**Alasan urutan:** persegi panjang paling dikenal siswa, sehingga menjadi titik awal. Persegi adalah kasus khusus persegi panjang. Jajargenjang adalah "persegi panjang yang dimiringkan". Belah ketupat adalah "jajargenjang dengan sisi sama". Layang-layang dibandingkan langsung dengan belah ketupat (K03). Trapesium memiliki satu pasang sisi sejajar.

> Urutan ini dapat disesuaikan dengan buku teks sekolah sasaran.

## 4. Alur Belajar dalam Satu Bangun

```
[Kartu Pengenalan]  bangun di dunia nyata + gambar (1 kartu)
        ↓
[Kartu Sifat]       Sisi → Sudut → Diagonal → Simetri (4 kartu, tiap kartu
                    punya tombol "Coba di Lab" yang membuka simulasi
                    dengan lapisan yang sesuai)
        ↓
[Lab Eksplorasi]    tugas terarah: "Geser titik C. Apa yang selalu tetap?"
                    → pilih jawaban → umpan balik (self-explanation)
        ↓
[Kartu Rumus]       keliling dan luas, rumus interaktif + animasi turunan
        ↓
[Contoh Soal]       1–2 worked example bertahap
        ↓
[Latihan]           lengkapi (2–3) → mandiri (5–7), dengan petunjuk
        ↓
[Ringkasan]         halaman Catatanku, tersimpan sebagai ringkasan bangun
```

Estimasi durasi: **15–20 menit per bangun**, cocok untuk satu sesi belajar di rumah.

## 5. Desain Aktivitas Kunci

### 5.1 Lab Eksplorasi Terarah (mengatasi IL01, IL04, K03)

Simulasi tanpa arahan dapat menambah beban ekstrinsik karena siswa bingung harus melakukan apa. Oleh karena itu, setiap sesi Lab memiliki **tugas eksplorasi** singkat:

> **Tugas:** Nyalakan lapisan *Diagonal*. Geser titik A ke mana saja.
> **Pertanyaan:** Apa yang **selalu** terjadi pada kedua diagonal belah ketupat?
> ☐ Sama panjang ☐ Saling tegak lurus ☐ Saling membagi dua sama panjang
> *(boleh pilih lebih dari satu)*

Umpan balik merangkum sifat sekaligus mengingatkan perbedaan: *"Betul! Ingat, pada **layang-layang** hanya **satu** diagonal yang terbagi dua sama panjang."*

### 5.2 Mode Bandingkan (mengatasi IL01, K03)

Pasangan wajib:

| Pasangan | Perbedaan kunci yang disorot |
|---|---|
| Belah ketupat vs layang-layang | Panjang sisi (4 sama vs 2 pasang berdekatan); diagonal (keduanya saling membagi dua vs hanya satu); sejajar (ya vs tidak); simetri lipat (2 vs 1); simetri putar (2 vs tidak ada) |
| Belah ketupat vs jajargenjang | Sisi (semua sama vs berhadapan sama); diagonal tegak lurus (ya vs tidak); simetri lipat (2 vs 0) |
| Persegi panjang vs jajargenjang | Sudut (semua 90° vs berhadapan sama); diagonal sama panjang (ya vs tidak); simetri lipat (2 vs 0) |
| Persegi vs belah ketupat | Sudut (90° vs tidak harus); diagonal sama panjang (ya vs tidak harus) |

### 5.3 Sudut Berdekatan 180° (mengatasi IL02)

1. Kartu pre-training: dua garis sejajar dipotong garis lain, lalu sudut dalam sepihak disorot dan dijumlahkan.
2. Pada jajargenjang di Lab, ketika sudut A diketuk, sudut B (berdekatan) ikut tersorot dengan keterangan langsung `∠A + ∠B = 180°` yang **nilainya berubah seiring drag tetapi jumlahnya tetap 180°**.
3. Pada trapesium, hanya pasangan sudut **di antara sisi sejajar** yang berjumlah 180°. Pasangan yang lain tidak, dan ini juga ditunjukkan.

### 5.4 Keliling vs Luas (mengatasi IL05)

- Kode warna permanen: **keliling = garis oranye**, **luas = daerah biru**.
- Pertanyaan pemicu sebelum menghitung: *"Yang ditanya **pinggiran** (keliling) atau **isi** (luas)?"*
- Satuan sebagai petunjuk: keliling → `cm`, luas → `cm²`.
- Soal kontekstual berpasangan: memasang pagar (keliling) vs memasang rumput (luas) pada kebun yang sama.

### 5.5 Soal Cerita Terstruktur (mengatasi EL05)

Tampilan soal cerita:

```
┌─────────────────────────────────────────┐
│ 📖 Soal (teks asli, maksimal 3 kalimat) │
├─────────────────────────────────────────┤
│ ✏️ Diketahui:  p = 12 m, l = 8 m        │  ← siswa mengisi / bisa dibuka
│ ❓ Ditanya:    luas kebun baru           │
│ 📐 Gambar:     [sketsa otomatis]         │
├─────────────────────────────────────────┤
│ ✅ Jawab:      langkah demi langkah      │
└─────────────────────────────────────────┘
```

Pada tingkat *Contoh*, bagian Diketahui/Ditanya sudah terisi. Pada tingkat *Lengkapi*, siswa mengisinya sendiri. Pada tingkat *Mandiri*, bagian tersebut disembunyikan dan bisa dibuka sebagai petunjuk.

### 5.6 Detektif Segiempat (mengatasi IL04, memanfaatkan GL05)

Pohon keputusan berdasarkan diagonal:

```
Apakah kedua diagonal saling membagi dua sama panjang?
├── YA  → keluarga jajargenjang
│   ├── Sama panjang DAN tegak lurus → PERSEGI
│   ├── Sama panjang saja            → PERSEGI PANJANG
│   ├── Tegak lurus saja             → BELAH KETUPAT
│   └── Tidak keduanya               → JAJARGENJANG
└── TIDAK
    ├── Tegak lurus, salah satu diagonal membagi dua diagonal lain → LAYANG-LAYANG
    ├── Sama panjang (dan ada sepasang sisi sejajar)                → TRAPESIUM SAMA KAKI
    └── Lainnya                                                     → TRAPESIUM / SEGIEMPAT SEMBARANG
```

Pohon ini ditampilkan bertahap (satu pertanyaan per langkah) dan **tidak sekaligus**.

## 6. Strategi Umpan Balik

| Situasi | Bentuk umpan balik |
|---|---|
| Benar | Singkat dan positif + satu kalimat penguat konsep ("Betul! Diagonal belah ketupat selalu tegak lurus.") |
| Salah (kesalahan dikenali) | Sebutkan miskonsepsinya + petunjuk + tombol "Coba lagi" |
| Salah (kesalahan tidak dikenali) | Petunjuk umum + tautan "Lihat contoh serupa" |
| Salah 2 kali | Tawarkan pembahasan bertahap |
| Setelah pembahasan | Beri satu soal kembar (angka berbeda) untuk konsolidasi |

Nada bahasa tidak menyalahkan: hindari kata "Salah!" berwarna merah besar. Gunakan "Belum tepat" dengan warna netral.

## 7. Adaptivitas Sederhana (tanpa AI)

- Jika siswa menjawab benar 3 soal mandiri berturut-turut, tawarkan untuk melewati sisa latihan (*expertise reversal*).
- Jika salah ≥ 2 pada konsep yang sama, konsep tersebut masuk daftar "Perlu diulang" dan siswa ditawari soal setingkat lebih mudah.
