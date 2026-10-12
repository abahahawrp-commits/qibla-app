# 📖 Dokumentasi Lengkap Aplikasi "Nurul Islam"

> **Nurul Islam - Pendamping Ibadah Digital Terlengkap & Modern**  
> Dibuat dengan React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide Icons, dan Progressive Web App (PWA).

---

## 📌 Daftar Isi
1. [Ringkasan Proyek & Arsitektur](#1-ringkasan-proyek--arsitektur)
2. [Fitur Utama & Rincian Fungsinya](#2-fitur-utama--rincian-fungsinya)
   - [2.1 Beranda (HomeScreen)](#21-beranda-homescreen)
   - [2.2 Jadwal Sholat Presisi & Pengingat](#22-jadwal-sholat-presisi--pengingat)
   - [2.3 Visualisasi Kepatuhan Sholat (Recharts)](#23-visualisasi-kepatuhan-sholat-recharts)
   - [2.4 Kompas Arah Kiblat Real-Time](#24-kompas-arah-kiblat-real-time)
   - [2.5 Al-Qur'an Digital 30 Juz & Audio](#25-al-quran-digital-30-juz--audio)
   - [2.6 Tasbih Digital Interaktif](#26-tasbih-digital-interaktif)
   - [2.7 Kumpulan Doa Harian & 99 Asmaul Husna](#27-kumpulan-doa-harian--99-asmaul-husna)
   - [2.8 Kuis Interaktif Islami](#28-kuis-interaktif-islami)
   - [2.9 Panduan Lengkap Ibadah Umroh](#29-panduan-lengkap-ibadah-umroh)
   - [2.10 Fitur PWA (Offline & Installable)](#210-fitur-pwa-offline--installable)
3. [Penjelasan Struktur Direktori & File Utama](#3-penjelasan-struktur-direktori--file-utama)
4. [Alur Data & Manajemen State (State Flow)](#4-alur-data--manajemen-state-state-flow)
5. [Panduan Maintenance & Pengembangan Fitur Baru](#5-panduan-maintenance--pengembangan-fitur-baru)
6. [Langkah Rilis ke Mobile App (Play Store & App Store)](#6-langkah-rilis-ke-mobile-app-play-store--app-store)

---

## 1. Ringkasan Proyek & Arsitektur

**Nurul Islam** adalah aplikasi web progresif (*Progressive Web App*) islami yang dirancang dengan pendekatan *Mobile-First*. Aplikasi ini menyediakan berbagai instrumen ibadah harian kaum muslimin dalam satu wadah yang ringan, indah, cepat, dan dapat berjalan secara luring (*offline*).

### 🛠️ Teknologi yang Digunakan:
- **Framework & Runtime**: React 19 + TypeScript (Strict Type Safety)
- **Bundler & Build Tool**: Vite 8 (Ultra-fast HMR & build optimization)
- **Styling**: Tailwind CSS v4 (Desain islami bernuansa Emerald, Amber/Gold, dan Slate yang elegan)
- **Grafik & Data Visualization**: Recharts (Untuk analitik kepatuhan sholat mingguan & bulanan)
- **Ikon**: Lucide React (Ikon vektor modern dan konsisten)
- **Audio & Haptik**: Web Audio API + HTML5 Audio Service sintetis & MP3 streaming
- **PWA Service Worker**: `vite-plugin-pwa` dengan Workbox (Caching aset & API untuk penggunaan offline di Tanah Suci atau daerah minim sinyal)

---

## 2. Fitur Utama & Rincian Fungsinya

### 2.1 Beranda (HomeScreen)
- **Hero Carousel Banner**: Menampilkan slide informasi bernuansa islami (Jadwal Sholat, Al-Qur'an, Kiblat, Kuis Islami, dan Panduan Umroh) dengan tombol aksi langsung.
- **Kartu Hitung Mundur Sholat**: Menampilkan waktu sholat terdekat berikutnya secara dinamis dengan hitungan mundur *real-time* (jam, menit, detik).
- **Grid Menu Cepat (8 Fitur Utama)**: Akses instan 1-klik menuju:
  1. Waktu Sholat
  2. Arah Kiblat
  3. Al-Qur'an 30 Juz
  4. Tasbih Digital
  5. Kumpulan Doa
  6. Asmaul Husna
  7. Kuis Islami
  8. Panduan Umroh
- **Kartu Fitur Unggulan**: Card sorotan untuk Kuis Interaktif dan Panduan Umroh Manasik.
- **Audio Doa & Bismillah**: Tombol pemutar audio lafaz islami langsung dari beranda.

### 2.2 Jadwal Sholat Presisi & Pengingat
- **Algoritma Astronomis Presisi**: Menghitung posisi matahari berdasarkan lintang (*latitude*), bujur (*longitude*), dan zona waktu.
- **Dukungan Berbagai Standar Internasional**:
  - Kemenag RI (Kementerian Agama Republik Indonesia - Subuh 20°, Isya 18°)
  - Muslim World League (MWL)
  - ISNA (Islamic Society of North America)
  - Umm Al-Qura (Makkah)
  - Egyptian General Authority of Survey
  - Mazhab Sholat: Standar Syafi'i/Maliki/Hanbali dan Hanafi (perhitungan panjang bayangan Ashar).
- **Deteksi Lokasi Otomatis (GPS)** + **Katalog Kota Manual**: Lebih dari ratusan kota di seluruh Indonesia dan kota-kota besar dunia yang tersimpan di `src/data/cities.ts`.
- **Waktu Sholat Lengkap**: Imsak, Subuh, Terbit (Syuruq), Dhuha, Dzuhur, Ashar, Maghrib, dan Isya.
- **Pengingat Adzan & Notifikasi**: Sakelar lonceng audio notifikasi per waktu sholat.
- **Jadwal Sholat Bulanan**: Modal jadwal kalender lengkap 30 hari yang dapat diakses kapan saja.

### 2.3 Visualisasi Kepatuhan Sholat (Recharts)
- Terintegrasi langsung dengan toggle pengingat sholat.
- **Statistik Ringkasan**: Tingkat kepatuhan keseluruhan (*Adherence Rate*), Sholat Terpenuhi, Sholat Terlewat, dan Hari Beruntun (*Streak*).
- **Grafik Batang (Bar Chart)**: Menampilkan perbandingan kedisiplinan per waktu sholat (Subuh, Dzuhur, Ashar, Maghrib, Isya) dengan warna tematik.
- **Grafik Tren Harian (Area Chart)**: Memvisualisasikan konsistensi kepatuhan sholat pengguna dari hari ke hari selama seminggu atau sebulan terakhir.
- **Filter Rentang Waktu**: Pengguna dapat beralih antara tampilan **7 Hari Terakhir** dan **30 Hari Terakhir**.

### 2.4 Kompas Arah Kiblat Real-Time
- **Perhitungan Azimut Kiblat Presisi**: Menggunakan rumus trigonometri bola (*Spherical Trigonometry*) menuju koordinat Ka'bah di Makkah (21.4225° LU, 39.8262° BT).
- **Kompas Sensorik Interaktif**: Menggunakan sensor `DeviceOrientation` (magnetometer dan akselerometer) perangkat HP.
- **Indikator Akurasi & Getaran (Haptics)**: Kompas berubah warna menjadi hijau cerah dan memicu getaran saat sudut HP tepat mengarah ke Ka'bah (toleransi ±3°).
- **Informasi Jarak**: Menampilkan estimasi jarak kilometer dari posisi pengguna saat ini ke Ka'bah.

### 2.5 Al-Qur'an Digital 30 Juz & Audio
- **Daftar 114 Surah**: Dilengkapi nomor surah, teks Arab, nama Latin, arti terjemahan, jumlah ayat, dan label tempat turun (Makkiyah / Madaniyah).
- **Baca Surah Lengkap**:
  - Teks Arab bertasydid (Utsmani) berukuran nyaman dibaca.
  - Transliterasi fonetik Latin untuk mempermudah pelafalan.
  - Terjemahan resmi Bahasa Indonesia ayat demi ayat.
- **Murottal Audio Player**:
  - Audio ayat per ayat atau putar surah penuh oleh Qari Syekh Mishary Rashid Alafasy.
  - Kendali Play, Pause, dan indikator ayat yang sedang dilantunkan.
- **Bookmark / Terakhir Dibaca**: Menyimpan posisi surah dan ayat terakhir secara otomatis ke memori lokal (*localStorage*).
- **Fitur Pencarian Cepat**: Filter surah instan berdasarkan nama atau arti.

### 2.6 Tasbih Digital Interaktif
- **Penghitung Zikir Digital**: Tombol tap besar yang nyaman dengan animasi lingkaran persentase putaran.
- **Feedback Audio & Haptik**: Suara klik lembut dan getaran halus setiap kali berzikir.
- **Pilihan Lafaz Zikir**: Subhanallah, Alhamdulillah, Allahu Akbar, Astaghfirullah, La ilaha illallah, Subhanallah wa bihamdihi, dsb.
- **Target Putaran Fleksibel**: 33, 99, atau target kustom sesuai keinginan pengguna.
- **Riwayat & Reset**: Ringkasan akumulasi zikir harian dan tombol atur ulang aman.

### 2.7 Kumpulan Doa Harian & 99 Asmaul Husna
- **Kumpulan Doa Harian**:
  - Dikelompokkan rapi (Doa Bangun/Tidur, Doa Makan, Doa Perjalanan, Doa Sholat, Doa Perlindungan, dll.).
  - Lengkap dengan teks Arab, transliterasi Latin, terjemahan Indonesia, dan rujukan hadits/keutamaan.
  - Fitur salin teks doa dan simpan ke daftar favorit.
- **99 Asmaul Husna**:
  - Tampilan kartu elegan nama-nama agung Allah SWT.
  - Dilengkapi kaligrafi Arab, pelafalan Latin, makna mendalam dalam bahasa Indonesia, dan audio pelafalan.

### 2.8 Kuis Interaktif Islami
- **5 Kategori Wawasan**:
  1. Aqidah & Tauhid
  2. Sirah Nabawiyah & Para Sahabat
  3. Fiqih Ibadah
  4. Al-Qur'an & Hadits
  5. Sejarah Peradaban Islam
- **3 Tingkat Kesulitan**: Mudah (Pemula), Sedang (Menengah), Sulit (Mahir).
- **Fitur Edukatif**:
  - Timer waktu per soal.
  - Bantuan Lifeline: 50:50 (eliminasi 2 jawaban salah) dan Hint (Petunjuk).
  - Penjelasan dalil dan fakta ilmiah/historis pada setiap akhir soal.
  - Perhitungan skor, streak akurasi, dan penyimpanan rekor nilai tertinggi (*High Score*).

### 2.9 Panduan Lengkap Ibadah Umroh
- **Timeline Manasik 6 Langkah**:
  1. *Persiapan & Ihram di Miqat* (Niat, mandi sunnah, larangan ihram).
  2. *Thawaf 7 Putaran* (Mengelilingi Ka'bah berlawanan arah jarum jam dari Hajar Aswad).
  3. *Sholat Sunnah di Belakang Maqam Ibrahim* (Surah Al-Kafirun & Al-Ikhlas) & Minum Air Zam-Zam.
  4. *Sa'i 7 Kali antara Shafa & Marwah* (Doa bukit Shafa, lari-lari kecil di lampu hijau).
  5. *Tahallul* (Mencukur gundul / memotong sebagian rambut).
  6. *Tertib* (Menjalankan rukun secara berurutan).
- **Counter Thawaf & Sa'i Interaktif**:
  - Melacak putaran ke-1 hingga ke-7 dengan tombol tambah/kurang yang dilengkapi haptic & audio.
  - Doa khusus yang dianjurkan untuk setiap putaran Thawaf dan Sa'i (Arab, Latin, Terjemahan, Audio).
  - Tanda visual khusus (misal: penanda lampu hijau Sa'i untuk lari kecil bagi pria).
- **Peta & Stasiun Miqat**: Penjelasan stasiun Miqat Makani (Bir Ali/Dzulhulaifah, Yalamlam, Qarnul Manazil, Juhfah, Dzatul Irq, Tan'im, Ji'ranah).
- **Larangan Ihram & Dam (Denda)**: Klasifikasi larangan khusus pria, khusus wanita, dan bersama, beserta rincian sanksi Dam (*Dam Tartib/Takhyir/Fidyah*).
- **Checklist Perlengkapan Umroh**: Daftar periksa barang bawaan (Dokumen, Pakaian Ihram, Obat-obatan, Perlengkapan Ibadah) yang tersimpan status centangnya di `localStorage`.
- **Tips Praktis Tanah Suci**: Panduan izin Raudhah lewat aplikasi Nusuk, tips sandal di Masjidil Haram, hidrasi cuaca panas, dan sholat jenazah.

### 2.10 Fitur PWA (Offline & Installable)
- **Offline First**: Seluruh kode, gaya, data surah, doa, kuis, dan aset panduan umroh dicache secara lokal melalui Service Worker.
- **Installable**: Dapat diinstal ke *Home Screen* smartphone layaknya aplikasi native tanpa melalui browser address bar.
- **Offline Indicator**: Memberikan info status saat koneksi internet terputus dengan tetap menjamin seluruh fungsi lokal berjalan lancar.

---

## 3. Penjelasan Struktur Direktori & File Utama

Berikut adalah susunan hierarki proyek Nurul Islam:

```text
├── index.html                    # Entry point HTML utama (Title, Meta, Font, Viewport)
├── package.json                  # Konfigurasi dependensi npm dan skrip build
├── tsconfig.json                 # Konfigurasi TypeScript compiler
├── vite.config.ts                # Konfigurasi Vite & VitePWA (Workbox Service Worker)
├── metadata.json                 # Metadata AI Studio & deklarasi izin sensor
├── public/                       # Aset publik statis (Favicon, Manifest, Audio, Ikon PWA)
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   └── manifest.json             # Web App Manifest untuk PWA installability
└── src/
    ├── main.tsx                  # Titik mula React mendaftarkan DOM ke #root
    ├── App.tsx                   # Komponen induk (State tab aktif, Navigasi, Modal pengatur)
    ├── index.css                 # Konfigurasi Tailwind CSS v4 & font kustom
    │
    ├── components/               # Komponen Antarmuka (UI Components)
    │   ├── Navbar.tsx            # Header atas & Bottom Navigation Bar mobile
    │   ├── Footer.tsx            # Bagian kaki halaman dengan navigasi & hak cipta
    │   ├── Home/
    │   │   └── HomeScreen.tsx    # Halaman beranda (Hero slider, Countdown sholat, Quick grid)
    │   ├── PrayerTimes/
    │   │   ├── PrayerHero.tsx    # Banner waktu sholat aktif & countdown
    │   │   ├── PrayerCards.tsx   # Kartu 5 waktu sholat harian + toggle notifikasi
    │   │   ├── PrayerAdherenceChart.tsx  # Grafik Recharts analitik kepatuhan sholat
    │   │   ├── LocationSelectorModal.tsx # Dialog pencarian dan pemilihan kota
    │   │   ├── CalculationSettingsModal.tsx # Dialog pengaturan metode hitung & mazhab
    │   │   └── MonthlyScheduleModal.tsx  # Dialog kalender jadwal sholat 1 bulan penuh
    │   ├── Qibla/
    │   │   └── QiblaCompass.tsx  # Kompas kiblat interaktif sensorik & kalkulator derajat
    │   ├── Quran/
    │   │   ├── QuranHome.tsx     # Katalog 114 surah, filter pencarian & bookmark
    │   │   └── SurahDetail.tsx   # Pembaca surah ayat-demi-ayat, terjemahan & murottal
    │   ├── Tasbih/
    │   │   └── TasbihCounter.tsx # Penghitung zikir digital, getaran & pilihan lafaz
    │   ├── Duas/
    │   │   └── DuasAndAsmaulHusna.tsx # Tab gabungan Kumpulan Doa & 99 Asmaul Husna
    │   ├── Quiz/
    │   │   └── IslamicQuiz.tsx   # Modul game kuis interaktif islami dengan timer & skor
    │   ├── Umrah/
    │   │   └── UmrahGuide.tsx    # Panduan manasik umroh, counter thawaf/sa'i & checklist
    │   └── PWA/
    │       ├── OfflineIndicator.tsx # Banner status jaringan luring/daring
    │       └── PWAInstallButton.tsx # Tombol pemicu prompt instalasi aplikasi ke HP
    │
    ├── data/                     # Sumber Data Statis & Data Fallback (Offline Data)
    │   ├── cities.ts             # Basis data koordinat ratusan kota di Indonesia & dunia
    │   ├── surahList.ts          # Metadata 114 surah Al-Qur'an (nama, arti, juz, ayat)
    │   ├── fallbackSurahs.ts     # Data teks ayat & terjemahan Al-Qur'an siap offline
    │   ├── dailyDuas.ts          # Kumpulan doa-doa harian mustajab beserta terjemahan
    │   ├── asmaulHusna.ts        # 99 Asmaul Husna lengkap dengan arti & dalil
    │   ├── islamicQuiz.ts        # Bank soal kuis islami berbagai kategori & tingkat kesulitan
    │   └── umrahData.ts          # Data tahapan umroh, doa thawaf/sa'i, miqat & larangan ihram
    │
    ├── types/                    # Definisi Tipe TypeScript (Interface & Type Definitions)
    │   ├── prayer.ts             # Tipe jadwal sholat, koordinat lokasi, metode hitung
    │   ├── prayerAdherence.ts    # Tipe riwayat kepatuhan & pencatatan jadwal sholat
    │   ├── qibla.ts              # Tipe koordinat kiblat, arah jarum kompas
    │   ├── quran.ts              # Tipe surah, ayat, audio murottal, bookmark
    │   ├── dhikr.ts              # Tipe lafaz zikir, sesi tasbih, target hitungan
    │   ├── quiz.ts               # Tipe pertanyaan kuis, skor, kategori, lifeline
    │   └── umrah.ts              # Tipe tahapan umroh, miqat, rukun, checklist, doa
    │
    └── utils/                    # Utilitas & Layanan Logika Bisnis (Helper & Services)
        ├── prayerTimes.ts        # Kalkulator astronomis posisi matahari & waktu sholat
        ├── qiblaCalculator.ts    # Rumus azimut koordinat bola arah kiblat dari GPS
        ├── prayerAdherenceService.ts # Layanan penyimpanan & agregasi data Recharts
        ├── audioService.ts       # Layanan pemutar audio Adzan, Murottal, Doa & Nada Beep
        ├── notificationService.ts# Manajemen izin notifikasi browser & penjadwalan
        ├── useOnlineStatus.ts    # React hook untuk mendeteksi status internet pengguna
        └── usePWAInstall.ts      # React hook penangkap event beforeinstallprompt
```

---

## 4. Alur Data & Manajemen State (State Flow)

```text
                  ┌──────────────────────────────────────────────┐
                  │                   App.tsx                    │
                  │   - State Tab: prayer|qibla|quran|tasbih|... │
                  │   - State Lokasi: GPS / Kota Terpilih        │
                  │   - State Pengaturan Sholat: Mazhab & Metode │
                  └───────┬──────────────────────────────┬───────┘
                          │                              │
             ┌────────────▼───────────┐      ┌───────────▼────────────┐
             │       Navbar.tsx       │      │     Layar Komponen     │
             │ (Top Nav & Bottom Bar) │      │ (HomeScreen, Quran,    │
             └────────────────────────┘      │  PrayerTimes, Umrah..) │
                                             └───────────┬────────────┘
                                                         │
                                             ┌───────────▼────────────┐
                                             │      localStorage      │
                                             │  - Bookmark Quran      │
                                             │  - Checklist Umrah     │
                                             │  - Riwayat Adherence   │
                                             │  - High Score Kuis     │
                                             │  - Counter Tasbih      │
                                             └────────────────────────┘
```

1. **Routing Tab**:
   Navigasi antar fitur dikelola secara *declarative* di `App.tsx` melalui state `activeTab` bertipe:
   `'prayer' | 'qibla' | 'quran' | 'tasbih' | 'duas' | 'quiz' | 'umrah'`.
   Perpindahan tab dapat dipicu dari `Navbar.tsx`, `HomeScreen.tsx`, kartu unggulan, maupun tautan di `Footer.tsx`.

2. **Penyimpanan Lokal Persisten (`localStorage`)**:
   - `nurul_islam_prayer_adherence`: Data histori kepatuhan sholat yang dibaca oleh komponen grafik **Recharts**.
   - `nurul_islam_quran_last_read`: Surah dan ayat terakhir yang dibaca pengguna.
   - `nurul_islam_umrah_checklist`: Status centang barang bawaan dan persiapan umroh.
   - `nurul_islam_tasbih_history`: Total akumulasi zikir harian.
   - `nurul_islam_quiz_high_scores`: Rekor poin tertinggi pengguna pada kuis.

---

## 5. Panduan Maintenance & Pengembangan Fitur Baru

### A. Menambahkan Soal Kuis Islami Baru
Buka berkas `src/data/islamicQuiz.ts`. Tambahkan objek soal baru ke dalam array `QUIZ_QUESTIONS`:
```typescript
{
  id: 'q_baru_01',
  category: 'sirah', // 'aqidah' | 'sirah' | 'fiqih' | 'quran' | 'sejarah'
  difficulty: 'sedang', // 'mudah' | 'sedang' | 'sulit'
  question: 'Siapakah sahabat nabi yang dijuluki Saifullah (Pedang Allah)?',
  options: [
    'Ali bin Abi Thalib',
    'Khalid bin Walid',
    'Umar bin Khattab',
    'Hamzah bin Abdul Muthalib'
  ],
  correctAnswerIndex: 1, // Indeks jawaban benar (0-3)
  explanation: 'Khalid bin Walid dijuluki Saifullah Al-Maslul (Pedang Allah yang Terhunus) oleh Rasulullah SAW karena kepiawaiannya dalam memimpin strategi militer kaum muslimin.',
  reference: 'HR. Bukhari & Sirah Nabawiyah'
}
```

### B. Menambahkan Doa Harian Baru
Buka berkas `src/data/dailyDuas.ts`. Tambahkan entri doa baru:
```typescript
{
  id: 'doa-hujan',
  category: 'alam',
  title: 'Doa Ketika Turun Hujan',
  arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
  latin: 'Allahumma shayyiban naafi’aa.',
  translation: 'Ya Allah, turunkanlah pada kami hujan yang bermanfaat.',
  source: 'HR. Bukhari No. 1032'
}
```

### C. Menambahkan Kota Baru untuk Jadwal Sholat
Buka berkas `src/data/cities.ts`. Tambahkan objek kota:
```typescript
{
  name: 'Samarinda',
  country: 'Indonesia',
  latitude: -0.5022,
  longitude: 117.1537,
  timezone: 'Asia/Makassar'
}
```

### D. Menguji dan Membangun Aplikasi (Build Verification)
Gunakan perintah terminal berikut:
- **Jalankan Mode Pengembangan**: `npm run dev` (Aplikasi berjalan di port 3000).
- **Pemeriksaan Tipe TypeScript**: `npm run lint` (Memastikan tidak ada eror tipe).
- **Kompilasi Produksi**: `npm run build` (Menghasilkan berkas statis siap rilis di folder `dist/`).

---

## 6. Langkah Rilis ke Mobile App (Play Store & App Store)

Aplikasi ini sudah 100% siap dikonversi ke **Android APK/AAB** dan **iOS IPA** menggunakan framework **Capacitor** tanpa perlu merombak tampilan UI:

### Langkah Ringkas Konversi via Capacitor:
1. Pasang dependensi Capacitor di terminal:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
   ```
2. Inisialisasi proyek:
   ```bash
   npx cap init "Nurul Islam" "com.nurulislam.app" --web-dir=dist
   ```
3. Bangun proyek web:
   ```bash
   npm run build
   ```
4. Tambahkan platform Android dan iOS:
   ```bash
   npx cap add android
   npx cap add ios
   ```
5. Sinkronisasi aset web ke folder native:
   ```bash
   npx cap sync
   ```
6. Buka di Android Studio untuk rilis ke **Google Play Store**:
   ```bash
   npx cap open android
   ```
7. Buka di Xcode (pada komputer macOS) untuk rilis ke **Apple App Store**:
   ```bash
   npx cap open ios
   ```

---

*Dokumentasi ini dibuat untuk mempermudah pemahaman arsitektur, pemeliharaan jangka panjang, dan penambahan fitur-fitur baru pada aplikasi Nurul Islam.*
