import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { SurahMeta, BookmarkItem, LastReadItem } from '../../types/quran';
import { SURAH_LIST } from '../../data/surahList';
import { Search, BookMarked, History, BookOpen, ChevronRight, Sparkles, ArrowLeft } from 'lucide-react';

interface QuranHomeProps {
  onSelectSurah: (surahNumber: number) => void;
  bookmarks: BookmarkItem[];
  lastRead: LastReadItem | null;
  onSelectBookmark: (surahNumber: number, ayahNumber: number) => void;
  onBack?: () => void;
}

export const QuranHome: React.FC<QuranHomeProps> = ({
  onSelectSurah,
  bookmarks,
  lastRead,
  onSelectBookmark,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  const filteredSurahs = useMemo(() => {
    return SURAH_LIST.filter((surah) => {
      const matchesSearch =
        surah.nameLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.nameTranslationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.nameArabic.includes(searchQuery) ||
        String(surah.number) === searchQuery.trim();

      const matchesType =
        filterType === 'all' || surah.revelationType === filterType;

      return matchesSearch && matchesType;
    });
  }, [searchQuery, filterType]);

  const QUICK_SURAH_SHORTCUTS = [
    { number: 1, name: 'Al-Fatihah' },
    { number: 18, name: 'Al-Kahf' },
    { number: 36, name: 'Yasin' },
    { number: 55, name: 'Ar-Rahman' },
    { number: 56, name: "Al-Waqi'ah" },
    { number: 67, name: 'Al-Mulk' },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-12 text-white">
      {/* Top App Bar Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-[#12312b] border border-emerald-800/60 text-emerald-200 hover:text-white transition-colors"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h2 className="text-base font-bold text-white tracking-tight">
            Al-Qur'an Al-Karim
          </h2>
        </div>

        <span className="text-amber-300 font-arabic text-sm px-2 font-bold select-none">
          بِسْمِ اللَّهِ
        </span>
      </div>

      {/* Top Banner: Last Read (creamy card matching image.png aesthetic) */}
      <div className="rounded-3xl bg-[#edf2e8] text-slate-900 p-5 sm:p-6 shadow-md border border-[#dfe7d9] flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
            <History className="w-4 h-4 text-emerald-800" />
            <span>Terakhir Dibaca · Last Read</span>
          </div>

          {lastRead ? (
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Surah {lastRead.surahName}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Ayat ke-{lastRead.ayahNumber}
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Surah Al-Fatihah
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Mulai membaca Al-Qur'an dari awal (7 Ayat)
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 flex items-center justify-between">
          <button
            onClick={() =>
              lastRead
                ? onSelectBookmark(lastRead.surahNumber, lastRead.ayahNumber)
                : onSelectSurah(1)
            }
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full transition-all shadow-sm active:scale-95"
          >
            <span>Lanjutkan Membaca</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
          <span className="font-arabic text-3xl text-emerald-800/40 select-none">
            الْقُرْآن الْكَرِيم
          </span>
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div className="rounded-3xl bg-[#0c251f] border border-emerald-900/80 p-4 space-y-2.5">
        <h4 className="text-[11px] font-bold text-emerald-300/80 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Surah Pilihan Cepat</span>
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_SURAH_SHORTCUTS.map((item) => (
            <button
              key={item.number}
              onClick={() => onSelectSurah(item.number)}
              className="p-2.5 rounded-xl bg-[#12312b] hover:bg-[#183d35] border border-emerald-800/50 text-left transition-all"
            >
              <span className="text-xs font-bold text-white block truncate">
                {item.name}
              </span>
              <span className="text-[10px] text-emerald-300/60 font-mono">
                #{item.number}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl bg-[#0c251f] border border-emerald-900/80 p-3 space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari surah (misal: Yasin, Al-Mulk, Al-Kahf)..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#12312b] border border-emerald-800/60 rounded-xl text-white placeholder-emerald-400/50 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 pt-0.5">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-[#12312b] text-emerald-300 hover:text-white'
            }`}
          >
            Semua (114)
          </button>
          <button
            onClick={() => setFilterType('Meccan')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'Meccan'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-[#12312b] text-emerald-300 hover:text-white'
            }`}
          >
            Makkiyyah
          </button>
          <button
            onClick={() => setFilterType('Medinan')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'Medinan'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-[#12312b] text-emerald-300 hover:text-white'
            }`}
          >
            Madaniyyah
          </button>
        </div>
      </div>

      {/* Surahs List (Clean White Cards matching image.png card motif) */}
      <div className="space-y-2.5">
        {filteredSurahs.map((surah) => (
          <motion.button
            key={surah.number}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectSurah(surah.number)}
            className="w-full bg-white hover:bg-slate-50 text-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between transition-shadow cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 group-hover:bg-amber-50 group-hover:text-amber-800 flex items-center justify-center font-mono font-bold text-xs transition-colors shrink-0">
                {surah.number}
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  {surah.nameLatin}
                </span>
                <span className="text-xs text-slate-500 block truncate max-w-[180px]">
                  {surah.nameTranslationId}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                  {surah.revelationTypeId} · {surah.numberOfAyahs} Ayat
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-arabic text-2xl font-bold text-emerald-900 block group-hover:text-emerald-700">
                {surah.nameArabic}
              </span>
            </div>
          </motion.button>
        ))}

        {filteredSurahs.length === 0 && (
          <div className="py-12 text-center text-emerald-300/60 text-xs">
            Tidak ada surah yang cocok dengan pencarian "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
