import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  PrayerTimeData,
  PrayerName,
  NextPrayerInfo,
  HijriDate,
  LocationInfo,
} from '../../types/prayer';
import { NavTab } from '../Navbar';
import {
  MapPin,
  ChevronDown,
  Bell,
  Sun,
  Sunset,
  Sunrise,
  Moon,
  CloudSun,
  Sparkles,
  BookOpen,
  Heart,
  Compass,
  Calendar,
  Volume2,
  ChevronRight,
  ShieldCheck,
  Trophy,
  BarChart3,
} from 'lucide-react';
import { soundManager } from '../../utils/audioService';
import { PrayerAdherenceChart } from '../PrayerTimes/PrayerAdherenceChart';

interface HomeScreenProps {
  prayerTimes: PrayerTimeData;
  nextPrayer: NextPrayerInfo;
  hijriDate: HijriDate;
  currentDate: Date;
  location: LocationInfo;
  reminders: Record<PrayerName, boolean>;
  onToggleReminder: (name: PrayerName) => void;
  onNavigate: (tab: NavTab, subSection?: 'duas' | 'asmaulHusna') => void;
  onOpenLocationModal: () => void;
  onOpenMonthlyModal: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  prayerTimes,
  nextPrayer,
  hijriDate,
  currentDate,
  location,
  reminders,
  onToggleReminder,
  onNavigate,
  onOpenLocationModal,
  onOpenMonthlyModal,
  onOpenSettings,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState<boolean>(false);

  const gregorianFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(currentDate);

  const heroSlides = [
    {
      kicker: 'Ingat Allah · Remember Allah',
      title: 'Mulai Dzikir Tasbih',
      subtitle: 'Basahi lisan dengan tasbih & tahmid',
      buttonText: 'Mulai Sekarang',
      action: () => onNavigate('tasbih'),
      type: 'tasbih',
    },
    {
      kicker: 'Cahaya Al-Qur’an · Holy Quran',
      title: 'Baca & Tadabbur Qur’an',
      subtitle: 'Lanjutkan membaca surah pilihan',
      buttonText: 'Buka Al-Qur’an',
      action: () => onNavigate('quran'),
      type: 'quran',
    },
    {
      kicker: 'Arah Kiblat · Qibla Direction',
      title: 'Temukan Arah Ka’bah',
      subtitle: 'Presisi sensor kompas real-time',
      buttonText: 'Cek Kiblat',
      action: () => onNavigate('qibla'),
      type: 'qibla',
    },
    {
      kicker: 'Wawasan Islam · Islamic Quiz',
      title: 'Kuis Interaktif Islami',
      subtitle: 'Tantang wawasan aqidah, sirah & Al-Qur’an',
      buttonText: 'Mulai Kuis',
      action: () => onNavigate('quiz'),
      type: 'quiz',
    },
    {
      kicker: 'Baitullah Makkah · Umrah Guide',
      title: 'Panduan Ibadah Umroh',
      subtitle: 'Tata cara manasik, doa shahih, miqat & counter thawaf',
      buttonText: 'Buka Panduan',
      action: () => onNavigate('umrah'),
      type: 'umrah',
    },
    {
      kicker: 'Pola Ibadah · Prayer Adherence',
      title: 'Statistik Kepatuhan Sholat',
      subtitle: 'Visualisasi Recharts pola mingguan & bulanan',
      buttonText: 'Lihat Grafik',
      action: () => {
        const el = document.getElementById('prayer-adherence-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      type: 'chart',
    },
  ];

  const currentSlide = heroSlides[activeSlide];

  const prayerCardsData: Array<{
    key: PrayerName;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: 'fajr', name: 'Subuh', icon: Sunrise },
    { key: 'dhuhr', name: "Duh'r", icon: Sun },
    { key: 'asr', name: 'Asr', icon: CloudSun },
    { key: 'maghrib', name: 'Magrib', icon: Sunset },
    { key: 'isha', name: "Isha'a", icon: Moon },
  ];

  const handleToggleAdhan = () => {
    if (isPlayingAdhan) {
      soundManager.stopAdhan();
      setIsPlayingAdhan(false);
    } else {
      soundManager.playAdhanStream();
      setIsPlayingAdhan(true);
    }
  };

  return (
    <div className="space-y-5 pb-8 max-w-xl mx-auto">
      {/* Top Bar Header with Avatar & Greeting */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-[#0d2a23] flex items-center justify-center text-white text-xs font-bold border border-emerald-500/30">
              <span className="text-sm">🧕</span>
            </div>
          </div>
          <div>
            <h1 className="text-white text-sm font-bold tracking-tight">
              Assalamu Alaikum!
            </h1>
            <p className="text-[11px] text-emerald-200/70 font-medium">
              Nurul Islam · Fluttydev
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-full bg-[#12312a] border border-emerald-800/60 flex items-center justify-center text-emerald-200 hover:text-white hover:bg-[#163a32] transition-colors relative shadow-sm"
          title="Pengaturan & Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2.5 right-2.5 ring-2 ring-[#081c17]" />
        </button>
      </div>

      {/* Featured Banner / Hero Carousel (matching image.png creamy card) */}
      <div className="space-y-2.5">
        <div className="relative overflow-hidden rounded-3xl bg-[#edf2e8] text-slate-900 p-5 sm:p-6 shadow-md border border-[#dfe7d9]">
          <div className="relative z-10 max-w-[62%] space-y-2">
            <span className="text-[10px] font-bold text-emerald-900 tracking-wider uppercase block">
              {currentSlide.kicker}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight">
              {currentSlide.title}
            </h2>
            <p className="text-xs text-slate-600 line-clamp-1">
              {currentSlide.subtitle}
            </p>

            <div className="pt-1.5">
              <button
                onClick={currentSlide.action}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full transition-all shadow-sm active:scale-95"
              >
                <span>{currentSlide.buttonText}</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Right Vector Illustration Graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-[42%] flex items-center justify-center pointer-events-none select-none pr-3">
            {currentSlide.type === 'tasbih' ? (
              <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-md">
                {/* Hand silhouette holding Tasbih */}
                <ellipse cx="60" cy="65" rx="36" ry="44" fill="#a7c4bc" opacity="0.3" />
                {/* Arm cuff */}
                <path d="M 85 85 L 110 110 L 95 120 L 75 95 Z" fill="#e2e8f0" />
                {/* Hand palm */}
                <path d="M 65 55 C 75 45, 90 55, 88 75 C 86 85, 75 92, 60 88 C 50 85, 45 70, 52 60 Z" fill="#fbd38d" />
                {/* Fingers */}
                <ellipse cx="62" cy="50" rx="9" ry="14" fill="#f6ad55" />
                <ellipse cx="72" cy="52" rx="8" ry="13" fill="#fbd38d" />
                <ellipse cx="80" cy="58" rx="8" ry="12" fill="#f6ad55" />
                {/* Tasbih string & beads */}
                <path d="M 40 45 C 30 70, 50 100, 75 105 C 95 105, 105 85, 95 65" fill="none" stroke="#b7791f" strokeWidth="2" strokeDasharray="1 5" />
                <circle cx="38" cy="50" r="3.5" fill="#d69e2e" />
                <circle cx="34" cy="60" r="3.5" fill="#b7791f" />
                <circle cx="36" cy="72" r="3.5" fill="#d69e2e" />
                <circle cx="42" cy="84" r="3.5" fill="#b7791f" />
                <circle cx="52" cy="95" r="3.5" fill="#d69e2e" />
                <circle cx="65" cy="102" r="3.5" fill="#b7791f" />
                <circle cx="78" cy="104" r="3.5" fill="#d69e2e" />
                <circle cx="90" cy="98" r="3.5" fill="#b7791f" />
                <circle cx="98" cy="88" r="3.5" fill="#d69e2e" />
                <circle cx="98" cy="75" r="3.5" fill="#b7791f" />
                {/* Tassel */}
                <path d="M 75 105 L 75 118 M 73 118 L 77 118" stroke="#975a16" strokeWidth="2" />
              </svg>
            ) : currentSlide.type === 'quran' ? (
              <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-md">
                <ellipse cx="60" cy="65" rx="36" ry="44" fill="#a7c4bc" opacity="0.3" />
                {/* Rehal wooden stand */}
                <polygon points="35,80 85,80 60,95" fill="#744210" />
                <polygon points="30,85 90,85 60,110" fill="#975a16" />
                {/* Holy Quran pages */}
                <path d="M 30 75 Q 60 70 60 50 Q 60 70 90 75 L 85 45 Q 60 40 60 25 Q 60 40 35 45 Z" fill="#234e52" />
                <path d="M 35 72 Q 60 67 60 48 Q 60 67 85 72 L 82 46 Q 60 42 60 28 Q 60 42 38 46 Z" fill="#fffaf0" />
                {/* Gold emblem */}
                <circle cx="60" cy="46" r="6" fill="#d69e2e" />
              </svg>
            ) : currentSlide.type === 'qibla' ? (
              <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-md">
                <circle cx="60" cy="60" rx="38" ry="38" fill="#a7c4bc" opacity="0.3" />
                {/* Kaaba cube */}
                <polygon points="60,25 95,45 60,65 25,45" fill="#2d3748" />
                <polygon points="25,45 60,65 60,100 25,80" fill="#1a202c" />
                <polygon points="60,65 95,45 95,80 60,100" fill="#4a5568" />
                {/* Gold kiswah band */}
                <polygon points="35,51 60,65 60,71 35,57" fill="#d69e2e" />
                <polygon points="60,65 85,51 85,57 60,71" fill="#ecc94b" />
              </svg>
            ) : currentSlide.type === 'quiz' ? (
              /* Quiz Islamic Medal & Star Illustration */
              <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-md">
                <circle cx="60" cy="60" rx="38" ry="38" fill="#a7c4bc" opacity="0.3" />
                {/* Gold Medallion Ribbon */}
                <path d="M 45 30 L 35 15 L 55 15 Z" fill="#38a169" />
                <path d="M 75 30 L 65 15 L 85 15 Z" fill="#2f855a" />
                {/* Outer 8-point Islamic star / Khatim */}
                <circle cx="60" cy="65" r="32" fill="#d69e2e" />
                <circle cx="60" cy="65" r="28" fill="#ecc94b" />
                <circle cx="60" cy="65" r="24" fill="#0d2a23" />
                {/* Crescent Moon & Star */}
                <path d="M 64 53 A 14 14 0 1 0 64 77 A 11 11 0 1 1 64 53 Z" fill="#ecc94b" />
                <polygon points="66,61 68,64 71,64 69,66 70,69 67,67 65,69 66,66 64,64 67,64" fill="#f6e05e" />
              </svg>
            ) : currentSlide.type === 'umrah' ? (
              /* Holy Ka'bah Illustration */
              <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-md">
                <circle cx="60" cy="60" r="48" fill="#102e26" />
                <circle cx="60" cy="60" r="44" fill="none" stroke="#ecc94b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                {/* Ka'bah cube isometric projection */}
                <polygon points="60,28 88,44 60,60 32,44" fill="#1f2937" />
                <polygon points="32,44 60,60 60,94 32,78" fill="#111827" />
                <polygon points="60,60 88,44 88,78 60,94" fill="#030712" />
                {/* Kiswah Gold Band (Hizam) */}
                <polygon points="32,50 60,66 60,71 32,55" fill="#f59e0b" />
                <polygon points="60,66 88,50 88,55 60,71" fill="#d97706" />
                {/* Ka'bah Door (Bab Al-Ka'bah) */}
                <rect x="67" y="66" width="6" height="12" rx="1" fill="#ecc94b" />
                {/* Golden Crescent topper */}
                <circle cx="60" cy="20" r="2.5" fill="#f59e0b" />
              </svg>
            ) : (
              /* Analytics & Adherence Chart Illustration */
              <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-md">
                <circle cx="60" cy="60" rx="38" ry="38" fill="#a7c4bc" opacity="0.3" />
                {/* Chart backdrop arch */}
                <path d="M 30 95 L 30 50 Q 60 25 90 50 L 90 95 Z" fill="#0d2721" />
                {/* Gold and emerald chart bars */}
                <rect x="38" y="70" width="8" height="20" rx="2" fill="#10b981" />
                <rect x="50" y="55" width="8" height="35" rx="2" fill="#f59e0b" />
                <rect x="62" y="45" width="8" height="45" rx="2" fill="#10b981" />
                <rect x="74" y="38" width="8" height="52" rx="2" fill="#ecc94b" />
                {/* Trend line */}
                <path d="M 42 66 Q 54 50 66 42 T 78 34" fill="none" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="78" cy="34" r="3.5" fill="#f59e0b" />
              </svg>
            )}
          </div>
        </div>

        {/* Carousel indicator dots */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                activeSlide === i
                  ? 'w-6 bg-emerald-400'
                  : 'w-1.5 bg-emerald-800/60 hover:bg-emerald-700'
              }`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 8 Quick Feature Grid Tiles */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* 1. Tasbih */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => onNavigate('tasbih')}
          className="bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1.5 transition-shadow cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-500 transition-colors">
            <span className="text-lg">📿</span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold tracking-tight text-slate-800">
            Tasbih
          </span>
        </motion.button>

        {/* 2. Panduan Umroh */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => onNavigate('umrah')}
          className="bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1.5 transition-shadow cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors">
            <span className="text-lg">🕋</span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold tracking-tight text-slate-800">
            Umroh
          </span>
        </motion.button>

        {/* 3. Doa Harian */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => onNavigate('duas', 'duas')}
          className="bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1.5 transition-shadow cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center text-purple-600 transition-colors">
            <span className="text-lg">🤲</span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold tracking-tight text-slate-800">
            Doa
          </span>
        </motion.button>

        {/* 4. Al-Quran */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => onNavigate('quran')}
          className="bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1.5 transition-shadow cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center text-teal-600 transition-colors">
            <BookOpen className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold tracking-tight text-slate-800">
            Al-Quran
          </span>
        </motion.button>

        {/* 5. Asmaul Husna */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => onNavigate('duas', 'asmaulHusna')}
          className="bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1.5 transition-shadow cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold tracking-tight text-slate-800 truncate max-w-full">
            Asmaul
          </span>
        </motion.button>

        {/* 6. Arah Kiblat */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => onNavigate('qibla')}
          className="bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1.5 transition-shadow cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center text-orange-600 transition-colors">
            <Compass className="w-4 h-4 text-orange-600" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold tracking-tight text-slate-800">
            Kiblat
          </span>
        </motion.button>

        {/* 7. Jadwal Bulanan / Imsakiyah */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.93 }}
          onClick={onOpenMonthlyModal}
          className="bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1.5 transition-shadow cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold tracking-tight text-slate-800">
            Bulanan
          </span>
        </motion.button>

        {/* 8. Kuis Islami */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => onNavigate('quiz')}
          className="bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-1.5 transition-shadow cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center text-rose-600 transition-colors">
            <Trophy className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold tracking-tight text-slate-800">
            Kuis
          </span>
        </motion.button>
      </div>

      {/* Featured Cards Row: Umrah Guide & Interactive Quiz */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Featured Umrah Guide Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('umrah')}
          className="rounded-3xl bg-gradient-to-r from-[#173d32] via-[#102d24] to-[#0a1f1a] border border-amber-400/50 p-4 text-white shadow-lg relative overflow-hidden cursor-pointer group hover:border-amber-400 transition-all"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform text-xl font-bold">
                🕋
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                    Panduan Umroh
                  </span>
                  <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider shrink-0">
                    Manasik
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 line-clamp-1">
                  6 Rukun, doa shahih, miqat & counter thawaf
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-amber-400/20 flex items-center justify-center text-emerald-300 group-hover:text-amber-300 transition-colors shrink-0">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
        </motion.div>

        {/* Featured Interactive Quiz Challenge Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('quiz')}
          className="rounded-3xl bg-gradient-to-r from-[#12312b] via-[#0e2923] to-[#0a1e19] border border-emerald-700/60 p-4 text-white shadow-lg relative overflow-hidden cursor-pointer group hover:border-amber-400 transition-all"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                    Kuis Wawasan
                  </span>
                  <span className="text-[9px] bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider shrink-0">
                    Interaktif
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 line-clamp-1">
                  Tantang aqidah, sirah, fiqih & raih predikat
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-amber-400/20 flex items-center justify-center text-emerald-300 group-hover:text-amber-300 transition-colors shrink-0">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Namaz Timings / Jadwal Sholat Container (matching image.png dark teal box) */}
      <div className="rounded-3xl bg-[#12312b] border border-emerald-900/70 p-5 text-white shadow-xl relative overflow-hidden space-y-4">
        {/* Subtle decorative background lanterns on left & right */}
        <div className="flex items-center justify-between text-amber-300 text-lg opacity-85 select-none -mb-3 px-1">
          <span>🏮</span>
          {/* Location selector dropdown pill in center */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#1a423a] hover:bg-[#205147] text-emerald-100 rounded-full text-xs font-medium border border-emerald-700/50 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[140px]">{location.city}, {location.country}</span>
            <ChevronDown className="w-3 h-3 text-emerald-300" />
          </button>
          <span>🏮</span>
        </div>

        {/* Title & Dates */}
        <div className="text-center space-y-0.5 pt-1">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Namaz Timings
            </h3>
            <button
              onClick={() => {
                const el = document.getElementById('prayer-adherence-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              title="Lihat Visualisasi Kepatuhan Sholat Recharts"
              className="text-[10px] bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition-colors"
            >
              <BarChart3 className="w-3 h-3 text-amber-400" />
              <span>Pola Kepatuhan</span>
            </button>
          </div>
          <p className="text-[11px] text-emerald-200/80 font-medium">
            {hijriDate.formatted} · {gregorianFormatted} AD
          </p>
        </div>

        {/* 5 Prayer Cards Horizontal Strip */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {prayerCardsData.map((p) => {
            const time = prayerTimes[p.key];
            const isNext = nextPrayer.name === p.key;
            const Icon = p.icon;
            const hasReminder = !!reminders[p.key];

            return (
              <div
                key={p.key}
                onClick={() => onToggleReminder(p.key)}
                className={`flex flex-col items-center justify-between p-2 sm:p-2.5 rounded-2xl transition-all cursor-pointer select-none text-center ${
                  isNext
                    ? 'bg-[#1e4a40] border-2 border-amber-400 shadow-md ring-2 ring-amber-400/20 text-white'
                    : 'bg-[#0f2823] border border-emerald-900/60 hover:border-emerald-700 text-emerald-100'
                }`}
                title={`Klik untuk toggle alarm ${p.name}`}
              >
                {/* Time */}
                <span className={`text-[11px] sm:text-xs font-bold font-mono tracking-tight block ${
                  isNext ? 'text-amber-300 font-extrabold' : 'text-emerald-200'
                }`}>
                  {time}
                </span>

                {/* Icon */}
                <div className={`my-2 p-1 rounded-lg ${
                  isNext ? 'text-amber-300' : 'text-emerald-300/80'
                }`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Prayer Name */}
                <span className={`text-[10px] sm:text-[11px] font-semibold block ${
                  isNext ? 'text-white font-bold' : 'text-emerald-300/70'
                }`}>
                  {p.name}
                </span>

                {/* Tiny reminder indicator */}
                <div className="mt-1">
                  <div
                    className={`w-1 h-1 rounded-full ${
                      hasReminder ? 'bg-amber-400' : 'bg-transparent'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom bar inside card: Next prayer countdown & adhan audio */}
        <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60 text-xs">
          <div className="text-[11px] text-emerald-200/90 font-medium">
            <span>Berikutnya: </span>
            <strong className="text-amber-300 font-bold">{nextPrayer.displayName}</strong>{' '}
            <span>({nextPrayer.remainingFormatted})</span>
          </div>

          <button
            onClick={handleToggleAdhan}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 ${
              isPlayingAdhan
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-emerald-900/60 text-emerald-200 hover:text-white hover:bg-emerald-800'
            }`}
          >
            <Volume2 className="w-3 h-3" />
            <span>{isPlayingAdhan ? 'Hentikan' : 'Adzan'}</span>
          </button>
        </div>
      </div>

      {/* 8. Prayer Adherence Patterns & Summary Visualization with Recharts */}
      <div id="prayer-adherence-section" className="scroll-mt-4">
        <PrayerAdherenceChart
          reminders={reminders}
          onToggleReminder={onToggleReminder}
          cityName={location.city}
        />
      </div>
    </div>
  );
};
