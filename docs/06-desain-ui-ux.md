# 06 — Desain UI/UX

## 1. Prinsip Tampilan (dari wawancara)

1. **"Seperti catatan yang rapi"** (DS03): bersih, banyak ruang kosong, hierarki jelas, tanpa hiasan.
2. **Gambar dulu, teks kemudian** (GL01, EL02): gambar menempati ±60% layar di kartu materi.
3. **Penanda konsisten** (EL01): satu sistem warna dan simbol untuk seluruh aplikasi.
4. **Satu tugas per layar**: tidak ada pop-up bertumpuk.

## 2. Peta Layar

```
Beranda
 ├─ Kartu bangun (6) ──► Halaman Bangun
 │                        ├─ Materi (kartu 1..n) ──► Lab (lapisan tertentu)
 │                        ├─ Lab
 │                        ├─ Latihan ──► Pembahasan
 │                        └─ Catatanku (ringkasan)
 ├─ Persiapan (pre-training)
 ├─ Bandingkan
 ├─ Detektif
 └─ Tantangan Campuran

Navigasi bawah (selalu ada): Beranda · Lab · Catatanku · Progres
```

## 3. Wireframe (HP, 360 px)

### 3.1 Beranda

```
┌──────────────────────────────┐
│ SegiempatKu            ⚙️    │
│ Hai! Lanjutkan belajarmu:    │
│ ┌──────────────────────────┐ │
│ │ ▱ Jajargenjang  ███░░ 60%│ │  ← kartu "lanjutkan"
│ └──────────────────────────┘ │
│ Persiapan  ✓                 │
│ ┌─────────┐ ┌─────────┐      │
│ │  ▭      │ │  □      │      │
│ │Persegi  │ │Persegi  │      │
│ │panjang ✓│ │        ✓│      │
│ └─────────┘ └─────────┘      │
│ ┌─────────┐ ┌─────────┐      │
│ │  ▱      │ │  ◇      │      │
│ │Jajar-   │ │Belah    │      │
│ │genjang ◐│ │ketupat  │      │
│ └─────────┘ └─────────┘      │
│ ... Layang-layang, Trapesium │
│ [🔍 Bandingkan] [🕵️ Detektif]│
├──────────────────────────────┤
│ 🏠    🧪 Lab   📒 Catat  📊   │
└──────────────────────────────┘
```

### 3.2 Kartu Materi

```
┌──────────────────────────────┐
│ ← Belah Ketupat      3 / 6   │
│ ●●●○○○                       │
│                              │
│        ┌──── gambar ────┐    │
│        │      A         │    │
│        │     /┆\        │    │
│        │   D ─┼─ B   ⊾  │    │  ← diagonal + tanda siku
│        │     \┆/        │    │     label langsung di gambar
│        │      C         │    │
│        └────────────────┘    │
│ Diagonal                     │
│ Kedua diagonal saling        │
│ tegak lurus dan saling       │
│ membagi dua sama panjang.    │  ← ≤ 40 kata
│                              │
│ [ 🧪 Coba geser di Lab ]     │
│                              │
│ [ ← Kembali ]  [ Lanjut → ]  │
└──────────────────────────────┘
```

### 3.3 Lab (Simulasi)

```
┌──────────────────────────────┐
│ ← Lab   [Belah ketupat ▾]    │
│ ┌──────────────────────────┐ │
│ │        ● A               │ │
│ │       / \       AC = 8,0 │ │
│ │  D ● ─ ┼ ─ ● B  BD = 6,0 │ │  ← titik besar (≥44px area sentuh)
│ │       \ /                │ │
│ │        ● C               │ │
│ └──────────────────────────┘ │
│ Lapisan: [Sisi][Sudut]       │
│          [Diagonal✓][Simetri]│  ← toggle chip
│ ┌ Sifat yang berlaku ──────┐ │
│ │ ✓ Diagonal tegak lurus   │ │
│ │ ✓ Saling membagi dua     │ │
│ │ ✗ Diagonal sama panjang  │ │
│ └──────────────────────────┘ │
│ 💡 Tugas: geser titik A.     │
│ Apa yang selalu tetap?  [▸]  │
└──────────────────────────────┘
```

### 3.4 Bandingkan

```
┌──────────────────────────────┐
│ ← Bandingkan                 │
│ [Belah ketupat ▾] vs [Layang ▾]│
│ ┌───────────┐ ┌───────────┐  │
│ │    ◇      │ │    ⬦      │  │
│ └───────────┘ └───────────┘  │
│ Perbedaan:                   │
│ │Sisi     │4 sama │2 pasang│ │
│ │Diag. ½  │keduanya│satu   │ │  ← sel berbeda disorot
│ │Sim.lipat│ 2     │ 1      │ │
│ │Sim.putar│ 2     │ tidak  │ │
│ [Tampilkan semua sifat]      │
└──────────────────────────────┘
```

### 3.5 Latihan (Soal Cerita)

```
┌──────────────────────────────┐
│ ← Latihan Persegi Panjang 4/10│
│ Kebun berukuran 12 m × 8 m.  │
│ Panjang +3 m, lebar −2 m.    │
│ Berapa perubahan luasnya?    │
│ ┌ Diketahui ───── [buka ▾] ┐ │
│ ┌ Ditanya ─────── [buka ▾] ┐ │
│ ┌ Gambar ──────── [buka ▾] ┐ │
│                              │
│ Jawaban: [ ______ ] m²       │
│ ○ bertambah  ○ berkurang     │
│                              │
│ [💡 Petunjuk 1/3]  [Periksa] │
└──────────────────────────────┘
```

### 3.6 Umpan Balik dan Pembahasan

```
┌──────────────────────────────┐
│ 🟠 Belum tepat               │
│ Sepertinya kamu menghitung   │
│ keliling. Yang ditanya luas  │
│ (isi di dalam bangun).       │
│ [Coba lagi] [Lihat pembahasan]│
│ [📒 Lihat contoh serupa]      │
└──────────────────────────────┘

Pembahasan (dibuka bertahap):
 Langkah 1 ✔ Ukuran baru: p = 15 m, l = 6 m
 Langkah 2 ✔ L lama = 96 m², L baru = 90 m²
 [ Tampilkan langkah 3 ▸ ]
```

## 4. Sistem Desain

### 4.1 Warna Semantik Geometri (wajib konsisten)

| Elemen | Warna | Kode (terang) | Catatan |
|---|---|---|---|
| Sisi bangun | Abu gelap | `#334155` | |
| Keliling (sorotan) | Oranye | `#EA580C` | Selalu garis |
| Luas (daerah) | Biru transparan | `#3B82F6` @ 25% | Selalu isian |
| Diagonal | Ungu, putus-putus | `#7C3AED` | |
| Tinggi | Hijau, putus-putus | `#059669` | |
| Sudut tersorot | Kuning busur | `#CA8A04` | |
| Sumbu simetri | Merah muda titik-titik | `#DB2777` | |
| Perbedaan (Bandingkan) | Latar kuning muda | `#FEF3C7` | Disertai ikon ≠, bukan hanya warna |
| Benar | Hijau | `#16A34A` | Disertai ikon ✓ |
| Belum tepat | Oranye netral | `#D97706` | Bukan merah menyala |

Mode gelap memakai varian lebih terang dari warna yang sama. Uji kontras ≥ 4.5:1 untuk teks dan ≥ 3:1 untuk elemen grafis.

### 4.2 Tipografi

- Font: **Nunito** atau **Inter** (sans-serif dengan angka yang jelas), di-self-host agar offline.
- Ukuran: isi 16 px (besar: 20 px), judul kartu 20 px, label pada gambar 14 px tebal.
- Rumus memakai KaTeX dengan ukuran minimal 18 px.

### 4.3 Komponen Dasar

`Button` (primer/sekunder/teks) · `Card` · `Chip/Toggle` · `ProgressDots` · `BottomNav` · `Sheet` (panel bawah untuk petunjuk dan ringkasan) · `StepReveal` · `FeedbackBanner` · `NumericInput` (menerima koma dan titik).

### 4.4 Interaksi

- Titik drag: lingkaran berdiameter 16 px dengan area sentuh tak terlihat 44 px; membesar saat disentuh.
- Panjang dan sudut diperbarui secara langsung saat drag; dibulatkan sesuai aturan di CLAUDE.md.
- Geser (swipe) kiri/kanan antarkartu materi; drag di kanvas Lab tidak memicu swipe.
- Getaran haptik ringan (Android) saat bangun "terkunci" ke bentuk khusus di Mode Bebas (mis. menjadi persegi).

## 5. Aksesibilitas

- Informasi tidak boleh dibedakan hanya dengan warna. Selalu sertakan ikon atau pola (garis putus-putus, simbol ✓/✗/≠).
- Semua tombol memiliki label teks atau `aria-label`.
- Mode "Kurangi animasi" menggantikan animasi dengan transisi instan.
- Mendukung zoom browser hingga 200% tanpa konten terpotong.
- Lab dapat dioperasikan dengan keyboard di web: Tab memilih titik, tombol panah menggeser.

## 6. Uji Keterbacaan (sebelum pengembangan penuh)

Buat **prototipe klik** (Figma) untuk Beranda, Kartu Materi, Lab, dan Latihan. Uji ke 3–5 siswa:

- Bisakah siswa menemukan cara menyalakan lapisan diagonal tanpa bantuan?
- Apakah teks kartu terasa "terlalu banyak"?
- Apakah warna keliling/luas dipahami tanpa dijelaskan?
