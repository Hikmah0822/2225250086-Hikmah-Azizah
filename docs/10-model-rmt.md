# 10 — Model Pembelajaran: Rigorous Mathematical Thinking (RMT)

Sumber: Kinard, J. T., & Kozulin, A. (2008). *Rigorous Mathematical Thinking: Conceptual Formation in the Mathematics Classroom*. Cambridge University Press.

## 1. Posisi RMT di aplikasi

| Peran | Dasar teori | Mengatur apa |
|---|---|---|
| **Model pembelajaran** | RMT (Vygotsky: alat psikologis; Feuerstein: *mediated learning experience*) | Urutan dan cara siswa belajar: dimediasi, menyebut fungsi berpikirnya, memberi bukti logis, berefleksi |
| **Prinsip desain tampilan** | Teori Beban Kognitif (Sweller), dari temuan wawancara S01 | Bagaimana layar disajikan: teks pendek, satu konsep per layar, label pada gambar |

Keduanya saling melengkapi. RMT menentukan **aktivitas berpikir** yang dilatih, sedangkan Teori Beban Kognitif menjaga agar aktivitas itu **tidak membebani** siswa secara berlebihan.

## 2. Konsep inti RMT dan penerapannya

| Konsep RMT (bab buku) | Penerapan di SegiempatKu |
|---|---|
| **Fungsi kognitif** tiga tingkat (bab 4, Tabel 4.1) | 15 fungsi berpikir di `src/content/rmt.ts`. Setiap soal, Lab, dan pilah informasi diberi label **🧠 Fungsi berpikir** yang bisa diketuk untuk melihat arti dan contohnya. Ada juga **Kamus Fungsi Berpikir** di Jurnal Berpikirku. |
| Siswa **menyebut nama** fungsi kognitif yang dipakai (vinyet bab 5–6) | Label di setiap soal; pilihan fungsi berpikir di refleksi; Beru menyebut fungsi yang sedang dipakai siswa. |
| ***Mediated Learning Experience***: *intentionality/reciprocity, transcendence, meaning, feeling of competence* (bab 4) | Aturan mediasi Tanya Beru (`RMT_GUIDANCE` di `src/lib/tutorPrompt.ts`): satu pertanyaan penuntun pada satu waktu, menghubungkan ke bangun lain dan kehidupan sehari-hari, menjelaskan mengapa langkah penting, dan menyebut bagian yang sudah benar. Umpan balik spesifik dan petunjuk bertingkat juga berperan sebagai mediasi. |
| **Alat psikologis** umum dan khusus matematika: simbol, tabel, bahasa matematika, rumus (bab 3 dan 5) | Penanda konsisten (∥, ⊥, tanda sama panjang) di `ShapeFigure`; tabel sifat di Bandingkan; rumus interaktif; simbol dibacakan dengan benar oleh 🔊 Bacakan. |
| ***Conserving constancy*** (mencari yang tetap di tengah perubahan) | **Lab**: titik digeser, siswa mencari sifat yang selalu berlaku. Label: 📌 Mencari yang tetap. |
| ***Defining the problem*** (soal "umur nakhoda", pendahuluan buku) | **Pilah informasi**: siswa memilih informasi yang diperlukan (ada informasi pengecoh) dan menentukan apa yang ditanya sebelum menjawab. |
| ***Providing logical evidence*** | Refleksi meminta "Apa yang kamu pelajari, **dan mengapa itu benar?**"; Beru selalu bertanya "Mengapa? Apa buktinya?". |
| ***Learning Activity***: orientasi → definisi masalah → perencanaan → **refleksi → evaluasi diri** (bab 3) | Materi (orientasi) → pilah informasi (definisi masalah) → petunjuk bertingkat (perencanaan) → **kartu Refleksi** setelah latihan (refleksi + menilai tingkat paham sendiri) → **Jurnal Berpikirku**. |
| ***Transcendence*** dan konsep ilmiah yang sistemik | Hierarki inklusif bangun (persegi ⊂ persegi panjang ⊂ jajargenjang); soal kembar dan Latihan Ulang Pintar membawa cara yang sama ke angka baru. |
| **Zona perkembangan proksimal** dan *dynamic assessment* (bab 3) | Bantuan bertingkat (petunjuk 1 → 2 → 3 → pembahasan), soal kembar setelah dibantu, dan Mode Penelitian (pretes → belajar → postes). |

## 3. Tiga fase proses RMT (bab 5) dalam alur aplikasi

| Fase RMT | Di aplikasi |
|---|---|
| **I. Pengembangan kognitif**: alat psikologis umum dan fungsi kognitif | Persiapan, Lab (mencari yang tetap, membandingkan), Detektif (berpikir dugaan) |
| **II. Konten sebagai proses**: konsep dasar dari pengalaman sehari-hari, alat khusus matematika | Kartu materi, animasi keliling dan luas, simetri lipat dan putar, rumus interaktif |
| **III. Latihan konstruksi konsep** dengan alat dan fungsi kognitif | Latihan bertahap, soal cerita, literasi matematika, refleksi |

## 4. Daftar fungsi berpikir yang dipakai

| Tingkat | Fungsi (nama di buku) |
|---|---|
| 1. Berpikir umum | Memberi nama & membayangkan (*labeling-visualizing*), Membandingkan (*comparing*), Mencari informasi dengan teliti (*searching systematically*), Memakai lebih dari satu informasi (*using more than one source*), Membaca & menulis simbol (*encoding-decoding*) |
| 2. Ukuran dan ketelitian | Mencari yang tetap (*conserving constancy*), Mengukur ruang (*quantifying space*), Mengurai & menyatukan (*analyzing-integrating*), Menggeneralisasi (*generalizing*), Bekerja teliti (*being precise*) |
| 3. Matematis dan logis | Mengingat pengetahuan lama (*activating prior knowledge*), Memberi bukti logis (*providing logical evidence*), Mendefinisikan masalah (*defining the problem*), Berpikir dugaan (*inferential-hypothetical thinking*), Menghubungkan (*projecting relationships*) |

Fungsi yang dilatih tiap jenis soal ada di `CONCEPT_FUNCTIONS` (`src/content/rmt.ts`). **Pemetaan ini perlu divalidasi bersama dosen pembimbing.**

## 5. Asisten Belajar Beru: pembimbing proses berpikir

Sesuai masukan dosen (November 2026), Beru tidak sekadar menjawab pertanyaan. Ia membimbing proses berpikir matematis siswa. Logikanya ada di `src/lib/tutorPedagogy.ts` dan dipakai oleh dua mode.

| Mode | Kapan dipakai | Biaya dan data |
|---|---|---|
| **Terpandu** | Selalu tersedia, termasuk tanpa internet atau tanpa API key | Gratis; tidak ada data yang dikirim. Balasan dibuat dari petunjuk dan pembahasan resmi soal. |
| **AI (Cloudflare Workers AI, gratis)** | Jika `CF_ACCOUNT_ID` dan `CF_API_TOKEN` dipasang di Netlify dan HP online | Gratis sampai 10.000 Neuron/hari (± 500 pertanyaan). Konten tidak dipakai Cloudflare untuk melatih AI. Soal dan pesan siswa dikirim tanpa nama dan kelas. Jika jatah habis, Beru kembali ke mode terpandu. |
| AI (DeepSeek, berbayar) | Cadangan, hanya jika `DEEPSEEK_API_KEY` dipasang dan Cloudflare tidak dipasang | Berbayar per pemakaian. |

| Tuntutan dosen | Penerapan |
|---|---|
| Membimbing soal literasi secara bertahap | Beru tersedia di setiap tahap soal Literasi Matematika dan setiap soal latihan. Ia memakai petunjuk dan pembahasan tahap tersebut. |
| Tahapan RMT | Setiap balasan diberi label **🧭 Tahap**: 1 Memahami situasi → 2 Mendefinisikan masalah → 3 Merencanakan dengan alat berpikir → 4 Melaksanakan → 5 Membuktikan dan merefleksi. |
| Petunjuk sesuai kesulitan, bukan jawaban akhir | Siswa memilih kesulitannya (5 tombol, satu per tahap RMT). Bantuan naik bertingkat: 1 pertanyaan pancingan → 2 petunjuk arah → 3 langkah sebagian → 4 penjelasan langkah. Tingkat 4 hanya setelah siswa mencoba 2 kali atau membuka pembahasan. Test otomatis memastikan jawaban akhir tidak pernah muncul lebih awal. |
| Mengelola beban kognitif | **IL**: satu langkah kecil per balasan. **EL**: maksimal ± 3 kalimat, merujuk label pada gambar. **GL**: siswa diminta menjelaskan dengan kata-katanya sendiri, memberi alasan, dan menghubungkan ke konsep lain. |

**Foto Soal** mengikuti pola *worked example* yang dimediasi: soal terbaca dicek siswa, lalu Diketahui → Ditanya (*defining the problem*), langkah dibuka satu per satu dengan label tahap RMT (siswa diminta menebak langkah berikutnya dulu), jawaban akhir baru terbuka setelah semua langkah dibuka, ditutup dengan cek kewajaran (*providing logical evidence*) dan kartu Refleksi.

**Tombol melayang "Tanya Beru"** (Beranda, halaman bangun, Catatanku, dan lainnya) menjawab pertanyaan konsep umum. Jawabannya diambil dari data materi yang sudah divalidasi, jadi gratis dan tanpa internet. Setiap jawaban diakhiri satu pertanyaan pemantik, dan ada tautan ke materi terkait. Pertanyaan yang tidak dikenali baru dikirim ke AI (jika aktif), dengan aturan: konsep boleh dijelaskan, tetapi jawaban soal hitungan tetap tidak diberikan.

Gemini versi gratis **tidak dipakai**, karena ketentuannya melarang aplikasi yang ditujukan atau kemungkinan diakses pengguna di bawah 18 tahun, dan data versi gratis dipakai Google untuk melatih produknya ([Gemini API Additional Terms](https://aistudio.google.com/docs/terms)).

## 6. Batasan

- Aplikasi tidak memakai buku kerja *Instrumental Enrichment* (Feuerstein) karena materinya berhak cipta dan memerlukan pelatihan khusus. Fungsi kognitif dilatih langsung melalui tugas segiempat.
- Mediasi oleh guru tidak bisa sepenuhnya digantikan aplikasi. Tanya Beru, petunjuk bertingkat, dan refleksi adalah **mediasi pendukung**. Diskusi kelas tetap dianjurkan.
- Data jurnal hanya tersimpan di perangkat siswa.
