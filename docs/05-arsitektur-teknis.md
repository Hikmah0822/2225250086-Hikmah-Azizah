# 05 — Arsitektur Teknis

## 1. Keputusan Teknologi

| Kebutuhan | Pilihan | Alasan | Alternatif |
|---|---|---|---|
| Satu kode untuk web dan Android | **React + Vite**, dibungkus **Capacitor** untuk Android | Satu basis kode; build Android tetap memakai web app yang sama; mudah dipelajari | Flutter (perlu belajar Dart), React Native (simulasi SVG lebih repot) |
| Bahasa | **TypeScript** (strict) | Mencegah bug pada logika geometri dan skema soal | JavaScript |
| Simulasi geometri | **SVG + Pointer Events** buatan sendiri | Ringan, tajam di semua resolusi, penanda geometri dapat dikontrol penuh | JSXGraph (lengkap tetapi berat dan tampilannya sulit disesuaikan), Konva (canvas) |
| Styling | **Tailwind CSS** | Cepat, konsisten, ukuran kecil | CSS Modules |
| State | **Zustand** + `persist` | Sederhana; progres otomatis tersimpan ke localStorage | Redux Toolkit |
| Rumus | **KaTeX** | Cepat dan bisa offline | MathJax (lebih berat) |
| Animasi | CSS transition + `requestAnimationFrame`; **Framer Motion** opsional untuk animasi lipat/putar | Kontrol penuh dan performa | GSAP |
| Offline | **vite-plugin-pwa** (Workbox) | Precache semua aset | — |
| Pengujian | **Vitest**, **Testing Library**, **Playwright** | Standar ekosistem Vite | Jest |
| Hosting web | **Netlify / Vercel / GitHub Pages** (gratis) | Static hosting, HTTPS otomatis | Firebase Hosting |

**Tanpa backend pada MVP.** Semua konten dibundel dalam aplikasi; progres disimpan di perangkat.

## 2. Gambaran Arsitektur

```
┌──────────────────────────────────────────────────────────┐
│                     Antarmuka (React)                    │
│  Pages: Beranda · Materi · Lab · Bandingkan · Latihan ·  │
│         Detektif · Catatanku · Progres · Pengaturan      │
├──────────────────────────────────────────────────────────┤
│  Komponen Geometri (SVG)                                 │
│  ShapeCanvas · DraggableVertex · GeometryMarks ·         │
│  AngleArc · DiagonalLayer · SymmetryAnimator · AreaGrid  │
├──────────────────────────────────────────────────────────┤
│  Logika Murni (TS, teruji)                               │
│  lib/geometry  (vektor, jarak, sudut, sejajar, ⊥, luas)  │
│  lib/shapes    (model parametrik + batasan per bangun)   │
│  lib/classify  (deteksi jenis bangun dari 4 titik)       │
│  lib/quiz      (penilaian, diagnosis miskonsepsi)        │
├──────────────────────────────────────────────────────────┤
│  Data: src/content (materi, soal, teks UI) — JSON/TS     │
│  State: Zustand store → localStorage                     │
├──────────────────────────────────────────────────────────┤
│  Platform: Browser (PWA)  |  Android WebView (Capacitor) │
└──────────────────────────────────────────────────────────┘
```

## 3. Struktur Folder

```
/
├── CLAUDE.md
├── README.md
├── docs/                         # dokumen perencanaan
├── public/
│   ├── icons/                    # ikon PWA dan Android
│   └── manifest.webmanifest
├── src/
│   ├── main.tsx
│   ├── App.tsx                   # router
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LessonPage.tsx        # F01 kartu materi
│   │   ├── LabPage.tsx           # F02 simulasi
│   │   ├── ComparePage.tsx       # F03
│   │   ├── PracticePage.tsx      # F07
│   │   ├── DetectivePage.tsx     # F06
│   │   ├── SummaryPage.tsx       # F08
│   │   ├── ProgressPage.tsx      # F09
│   │   └── SettingsPage.tsx      # F10
│   ├── components/
│   │   ├── geometry/             # ShapeCanvas, DraggableVertex, GeometryMarks, ...
│   │   ├── lesson/               # LessonCard, CardNavigator
│   │   ├── quiz/                 # QuestionView, OptionList, NumericInput, HintPanel, StepReveal
│   │   ├── formula/              # InteractiveFormula (KaTeX + tautan ke gambar)
│   │   └── ui/                   # Button, Card, BottomNav, Toggle, ...
│   ├── lib/
│   │   ├── geometry/             # vector.ts, measure.ts, predicates.ts (+ *.test.ts)
│   │   ├── shapes/               # square.ts, parallelogram.ts, ... (model + constraint)
│   │   ├── classify/             # classifyQuadrilateral.ts (+ test)
│   │   ├── quiz/                 # grade.ts, diagnose.ts (+ test)
│   │   └── format.ts             # format angka Indonesia (koma desimal)
│   ├── content/
│   │   ├── shapes/               # data materi per bangun (kartu, sifat, rumus)
│   │   ├── questions/            # bank soal JSON (skema di docs/04)
│   │   ├── properties.ts         # tabel sifat (sumber kebenaran, dari docs/04 §3)
│   │   └── strings.id.ts         # teks UI
│   ├── store/
│   │   ├── progressStore.ts
│   │   └── settingsStore.ts
│   ├── types/
│   └── styles/
├── tests/e2e/                    # Playwright
├── android/                      # dibuat oleh Capacitor (jangan diedit manual kecuali konfigurasi)
├── capacitor.config.ts
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

## 4. Model Geometri untuk Simulasi (F02)

Masalah utama: saat siswa menggeser titik, bangun harus **tetap** menjadi jenis yang sama. Solusinya adalah merepresentasikan setiap bangun secara **parametrik**, sehingga titik sudut dihitung dari parameter dan setiap pegangan drag mengubah parameter tertentu.

| Bangun | Parameter | Pegangan drag → efek |
|---|---|---|
| Persegi | pusat O, setengah diagonal r, rotasi θ | Titik sudut mana pun → mengubah r dan θ |
| Persegi panjang | A, arah alas θ, p, l | B → p dan θ; D → l |
| Jajargenjang | A, B, D (C = B + D − A) | A/B/D bebas; C → menggeser B dan D secara simetris |
| Belah ketupat | O, d₁, d₂, θ (diagonal ⊥) | Ujung diagonal 1 → d₁ (dan θ); ujung diagonal 2 → d₂ |
| Layang-layang | Sumbu simetri: A dan C; titik potong P pada AC; setengah diagonal pendek h | B/D → h dan posisi P (D adalah cermin B terhadap AC) |
| Trapesium | Alas bawah AB, tinggi t, alas atas DC sejajar AB (panjang dan geseran) | Masing-masing titik bergerak sejajar alas; sama kaki: geseran terkunci simetris |

Validasi saat drag:

- Titik tidak boleh keluar dari area kanvas (dengan margin).
- Panjang sisi/diagonal minimal (mis. ≥ 1 satuan) agar bangun tidak degenerat.
- Untuk Mode Bebas: tolak posisi yang membuat sisi bersilangan (segiempat tidak sederhana).

**Sistem koordinat:** satuan dunia (mis. 1 satuan = 1 cm virtual) dipetakan ke piksel melalui `viewBox` SVG. Sumbu y SVG mengarah ke bawah, jadi konversi sudut perlu diperhatikan. Semua logika di `lib/geometry` memakai koordinat dunia.

**Snapping:** opsional ke grid 0,5 satuan agar angka yang tampil "rapi" (mengurangi beban membaca angka seperti 7,3846).

## 5. Klasifikasi Segiempat (Mode Bebas dan Detektif)

`classifyQuadrilateral(points: [P, P, P, P]): ShapeId[]` mengembalikan **semua** jenis yang cocok (inklusif) berdasarkan predikat dengan toleransi:

```ts
const parallel = (u, v) => Math.abs(cross(u, v)) < EPS * len(u) * len(v);
const perpendicular = (u, v) => Math.abs(dot(u, v)) < EPS * len(u) * len(v);
```

Urutan pengecekan mengikuti pohon keputusan di [03-desain-pembelajaran.md §5.6](03-desain-pembelajaran.md). Fungsi ini wajib memiliki tes untuk setiap bangun, termasuk kasus perbatasan (persegi harus lolos sebagai persegi, persegi panjang, belah ketupat, jajargenjang, dan layang-layang).

## 6. Model Data

### 6.1 Konten Materi

```ts
interface LessonCard {
  id: string;
  shape: ShapeId;
  topic: 'intro' | 'sides' | 'angles' | 'diagonals' | 'symmetry' | 'formula';
  title: string;           // ≤ 6 kata
  body: string;            // ≤ 40 kata
  figure: FigureSpec;      // bangun + lapisan yang aktif + sorotan
  labLink?: { layers: Layer[]; task?: string };
  check?: string[];        // id soal cek pemahaman
}
```

### 6.2 Progres (localStorage)

```ts
interface ProgressState {
  version: 1;                                    // untuk migrasi skema
  shapes: Record<ShapeId, {
    cardsSeen: string[];
    status: 'not-started' | 'in-progress' | 'done';
    bestScore: number;                           // 0–100
    lastScore: number;
  }>;
  attempts: { questionId: string; correct: boolean; misconception?: string; at: number }[]; // maksimal 500 terakhir
  reviewList: string[];                          // konsep yang perlu diulang
}
```

### 6.3 Pengaturan

```ts
interface Settings { fontScale: 1 | 1.25; theme: 'light' | 'dark' | 'system'; reduceMotion: boolean; }
```

## 7. Build dan Distribusi

### Web (PWA)

1. `npm run build` → folder `dist/`.
2. Deploy ke Netlify/Vercel/GitHub Pages.
3. Siswa membuka URL; browser menawarkan "Tambahkan ke layar utama".

### Android (Capacitor)

1. Sekali saja: `npm i @capacitor/core @capacitor/cli @capacitor/android`, `npx cap init`, `npx cap add android`.
2. Setiap rilis: `npm run build` → `npx cap sync android` → buka Android Studio → *Build > Generate Signed Bundle/APK*.
3. Distribusi: APK langsung (uji coba penelitian) atau Google Play (AAB, butuh akun developer berbayar sekali).
4. Konfigurasi: orientasi potret, `minSdkVersion 26` (Android 8), ikon dan splash screen.

**Simpan keystore penandatangan APK dengan aman.** Jika hilang, aplikasi di Play Store tidak bisa diperbarui.

## 8. Kualitas Kode

- ESLint + Prettier; `tsc --noEmit` di CI.
- GitHub Actions: lint → typecheck → test → build pada setiap push.
- Cakupan tes minimal **90%** untuk `src/lib/` (logika geometri, klasifikasi, penilaian). UI cukup diuji alur utamanya dengan E2E.

## 9. Pengembangan Lanjutan (setelah MVP)

- Backend ringan (Supabase/Firebase) untuk mode kelas: guru membuat kode kelas dan melihat rekap anonim. **Perlu tinjauan privasi dan persetujuan sekolah/orang tua.**
- Materi lain (segitiga, lingkaran, bangun ruang) memakai komponen geometri yang sama.
- Ekspor hasil penelitian (F11) ke CSV.
