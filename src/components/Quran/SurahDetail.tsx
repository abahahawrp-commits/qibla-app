import React, { useState, useEffect, useRef } from 'react';
import { SurahDetailData, Ayah, BookmarkItem, LastReadItem } from '../../types/quran';
import { FALLBACK_SURAHS } from '../../data/fallbackSurahs';
import { SURAH_LIST } from '../../data/surahList';
import {
  ArrowLeft,
  Play,
  Pause,
  Bookmark,
  Share2,
  Check,
  Type,
  Volume2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface SurahDetailProps {
  surahNumber: number;
  initialAyahNumber?: number;
  onBack: () => void;
  onSelectSurah: (num: number) => void;
  bookmarks: BookmarkItem[];
  onToggleBookmark: (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => void;
  onSaveLastRead: (item: LastReadItem) => void;
}

export const SurahDetail: React.FC<SurahDetailProps> = ({
  surahNumber,
  initialAyahNumber,
  onBack,
  onSelectSurah,
  bookmarks,
  onToggleBookmark,
  onSaveLastRead,
}) => {
  const [surahData, setSurahData] = useState<SurahDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFromOfflineCache, setIsFromOfflineCache] = useState<boolean>(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [showLatin, setShowLatin] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState<boolean>(false);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Fetch Surah data with offline caching support
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsFromOfflineCache(false);

    const loadSurah = async () => {
      // 1. Check bundled fallback first
      if (FALLBACK_SURAHS[surahNumber]) {
        if (isMounted) {
          setSurahData(FALLBACK_SURAHS[surahNumber]);
          setIsLoading(false);
          setIsFromOfflineCache(true);
        }
      } else {
        // 2. Check previously cached surah in localStorage
        try {
          const cachedStr = localStorage.getItem(`nurul_islam_surah_${surahNumber}`);
          if (cachedStr) {
            const parsed = JSON.parse(cachedStr);
            if (isMounted && parsed && parsed.ayahs?.length > 0) {
              setSurahData(parsed);
              setIsLoading(false);
              setIsFromOfflineCache(true);
            }
          }
        } catch {
          // ignore error
        }
      }

      try {
        // Fetch from API: https://equran.id/api/v2/surat/{surahNumber}
        const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
        if (!res.ok) throw new Error('Network error');
        const json = await res.json();
        if (json && json.data) {
          const d = json.data;
          const ayahs: Ayah[] = (d.ayat || []).map((item: {
            nomorAyat: number;
            teksArab: string;
            teksLatin: string;
            teksIndonesia: string;
            audio: Record<string, string>;
          }) => ({
            number: item.nomorAyat,
            numberInQuran: 0,
            arab: item.teksArab,
            latin: item.teksLatin,
            translationId: item.teksIndonesia,
            translationEn: '',
            audio: {
              alafasy: item.audio?.['05'] || item.audio?.['01'] || '',
            },
          }));

          const meta = SURAH_LIST.find((s) => s.number === surahNumber);

          const fullData: SurahDetailData = {
            number: d.nomor,
            nameArabic: d.nama,
            nameLatin: d.namaLatin,
            nameTranslationId: d.arti,
            nameTranslationEn: meta?.nameTranslationEn || '',
            numberOfAyahs: d.jumlahAyat,
            revelationType: d.tempatTurun === 'Mekah' ? 'Meccan' : 'Medinan',
            revelationTypeId: d.tempatTurun === 'Mekah' ? 'Makkiyyah' : 'Madaniyyah',
            tafsirSummary: d.deskripsi,
            audioFull: d.audioFull?.['05'] || d.audioFull?.['01'],
            bismillah:
              d.nomor !== 1 && d.nomor !== 9
                ? {
                    arab: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                    translationId: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
                    translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
                  }
                : undefined,
            ayahs,
          };

          // Save to localStorage for instant offline access in future sessions
          try {
            localStorage.setItem(`nurul_islam_surah_${surahNumber}`, JSON.stringify(fullData));
          } catch {
            // Quota safe
          }

          if (isMounted) {
            setSurahData(fullData);
            setIsLoading(false);
            setIsFromOfflineCache(false);
          }
        }
      } catch {
        // If API fails (offline)
        if (isMounted) {
          try {
            const cachedStr = localStorage.getItem(`nurul_islam_surah_${surahNumber}`);
            if (cachedStr) {
              const parsed = JSON.parse(cachedStr);
              if (parsed && parsed.ayahs?.length > 0) {
                setSurahData(parsed);
                setIsLoading(false);
                setIsFromOfflineCache(true);
                return;
              }
            }
          } catch {
            // ignore
          }

          if (!FALLBACK_SURAHS[surahNumber]) {
            const meta = SURAH_LIST.find((s) => s.number === surahNumber);
            if (meta) {
              setSurahData({
                ...meta,
                ayahs: [
                  {
                    number: 1,
                    numberInQuran: 1,
                    arab: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                    latin: 'Bismillāhir-raḥmānir-raḥīm',
                    translationId: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
                    translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
                    audio: {},
                  },
                ],
              });
            }
            setIsLoading(false);
          }
        }
      }
    };

    loadSurah();

    return () => {
      isMounted = false;
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, [surahNumber]);

  // Scroll to initial ayah if specified
  useEffect(() => {
    if (initialAyahNumber && ayahRefs.current[initialAyahNumber]) {
      setTimeout(() => {
        ayahRefs.current[initialAyahNumber]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  }, [initialAyahNumber, surahData]);

  // Track last read on scroll/interaction
  const handleAyahVisible = (ayahNum: number) => {
    if (surahData) {
      onSaveLastRead({
        surahNumber: surahData.number,
        surahName: surahData.nameLatin,
        ayahNumber: ayahNum,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handlePlayAyah = (ayah: Ayah) => {
    if (playingAyah === ayah.number) {
      // Pause
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      setPlayingAyah(null);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    // Audio URL
    const audioUrl =
      ayah.audio.alafasy ||
      `https://equran.nos.wjv-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/${String(
        surahNumber
      ).padStart(3, '0')}${String(ayah.number).padStart(3, '0')}.mp3`;

    const audio = new Audio(audioUrl);
    audioPlayerRef.current = audio;

    audio.onended = () => {
      // Auto-advance to next ayah
      if (surahData && ayah.number < surahData.numberOfAyahs) {
        const nextAyah = surahData.ayahs.find((a) => a.number === ayah.number + 1);
        if (nextAyah) {
          handlePlayAyah(nextAyah);
          ayahRefs.current[nextAyah.number]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      } else {
        setPlayingAyah(null);
      }
    };

    audio.play().catch(() => {
      setPlayingAyah(null);
    });

    setPlayingAyah(ayah.number);
    handleAyahVisible(ayah.number);
  };

  const handleCopyAyah = (ayah: Ayah) => {
    const text = `${ayah.arab}\n\n"${ayah.translationId}"\n(QS. ${surahData?.nameLatin}: ${ayah.number})`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(ayah.number);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const isAyahBookmarked = (num: number) => {
    return bookmarks.some(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === num
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Navigation & Controls */}
      <div className="bg-[#0c251f]/95 backdrop-blur-md rounded-2xl p-4 border border-emerald-900/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-16 z-30 text-white">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14352e] hover:bg-[#1a443a] text-xs font-semibold text-emerald-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Daftar Surah</span>
          </button>

          {surahData && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {surahData.nameLatin}
              </span>
              <span className="text-xs text-emerald-300/60 font-medium">
                ({surahData.numberOfAyahs} Ayat)
              </span>
              {isFromOfflineCache && (
                <span className="text-[10px] bg-emerald-950 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded-full font-mono">
                  Offline
                </span>
              )}
            </div>
          )}
        </div>

        {/* Reader Preferences Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Font size toggle */}
          <div className="flex items-center bg-[#14352e] rounded-lg p-0.5 text-xs border border-emerald-900/50">
            <button
              onClick={() => setFontSizeLevel('normal')}
              className={`px-2 py-1 rounded-md transition-colors ${
                fontSizeLevel === 'normal' ? 'bg-amber-400 font-bold text-slate-950 shadow-sm' : 'text-emerald-300'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSizeLevel('large')}
              className={`px-2 py-1 rounded-md transition-colors ${
                fontSizeLevel === 'large' ? 'bg-amber-400 font-bold text-slate-950 shadow-sm' : 'text-emerald-300'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSizeLevel('xlarge')}
              className={`px-2 py-1 rounded-md transition-colors ${
                fontSizeLevel === 'xlarge' ? 'bg-amber-400 font-bold text-slate-950 shadow-sm' : 'text-emerald-300'
              }`}
            >
              A++
            </button>
          </div>

          {/* Latin Transliteration toggle */}
          <button
            onClick={() => setShowLatin(!showLatin)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showLatin
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                : 'bg-[#14352e] text-emerald-200 border-emerald-800/60'
            }`}
          >
            Latin
          </button>

          {/* Translation toggle */}
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showTranslation
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                : 'bg-[#14352e] text-emerald-200 border-emerald-800/60'
            }`}
          >
            Arti
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-emerald-300/80 font-medium">Memuat Ayat Al-Qur'an...</p>
        </div>
      ) : surahData ? (
        <div className="space-y-6">
          {/* Surah Header Card */}
          <div className="rounded-3xl bg-[#0c251f] p-8 text-white text-center shadow-xl border border-emerald-900/80 relative overflow-hidden">
            <span className="font-arabic text-4xl sm:text-5xl text-amber-300 block mb-3 drop-shadow-md">
              {surahData.nameArabic}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Surah {surahData.nameLatin}
            </h1>
            <p className="text-emerald-200/80 text-sm mt-1">
              "{surahData.nameTranslationId}"
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-emerald-300/60 mt-3 font-mono">
              <span>Surah ke-{surahData.number}</span>
              <span>·</span>
              <span>{surahData.revelationTypeId}</span>
              <span>·</span>
              <span>{surahData.numberOfAyahs} Ayat</span>
            </div>

            {/* Bismillah */}
            {surahData.bismillah && (
              <div className="mt-8 pt-6 border-t border-emerald-900/60">
                <span className="font-arabic text-2xl sm:text-3xl text-emerald-100 block">
                  {surahData.bismillah.arab}
                </span>
                <span className="text-xs text-emerald-300/70 block mt-2">
                  {surahData.bismillah.translationId}
                </span>
              </div>
            )}
          </div>

          {/* Verses List */}
          <div className="space-y-4">
            {surahData.ayahs.map((ayah) => {
              const isPlaying = playingAyah === ayah.number;
              const isBookmarked = isAyahBookmarked(ayah.number);

              // Font sizes for Arabic
              const arabicSizeClass =
                fontSizeLevel === 'normal'
                  ? 'text-2xl sm:text-3xl leading-loose'
                  : fontSizeLevel === 'large'
                  ? 'text-3xl sm:text-4xl leading-[2.5rem] sm:leading-[3.5rem]'
                  : 'text-4xl sm:text-5xl leading-[3rem] sm:leading-[4.2rem]';

              return (
                <div
                  key={ayah.number}
                  ref={(el) => {
                    ayahRefs.current[ayah.number] = el;
                  }}
                  className={`bg-white rounded-2xl p-5 sm:p-7 border transition-all ${
                    isPlaying
                      ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20 bg-emerald-50/20'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Action Bar on top of Ayah */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center">
                        {ayah.number}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {surahData.number}:{ayah.number}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Play audio per verse */}
                      <button
                        onClick={() => handlePlayAyah(ayah)}
                        title={isPlaying ? 'Jeda Audio' : 'Putar Audio Ayat Ini'}
                        className={`p-2 rounded-xl transition-colors ${
                          isPlaying
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isPlaying ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                      </button>

                      {/* Bookmark ayah */}
                      <button
                        onClick={() =>
                          onToggleBookmark({
                            surahNumber: surahData.number,
                            surahName: surahData.nameLatin,
                            ayahNumber: ayah.number,
                            ayahTextSnippet: ayah.arab.slice(0, 30) + '...',
                          })
                        }
                        title={isBookmarked ? 'Hapus Markah' : 'Tandai Ayat Ini'}
                        className={`p-2 rounded-xl transition-colors ${
                          isBookmarked
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600' : ''}`}
                        />
                      </button>

                      {/* Copy / Share */}
                      <button
                        onClick={() => handleCopyAyah(ayah)}
                        title="Salin Teks Ayat & Terjemahan"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        {copiedAyah === ayah.number ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Arabic Ayah Script */}
                  <div className="py-6 text-right">
                    <p
                      className={`font-arabic text-slate-900 font-semibold tracking-normal text-right ${arabicSizeClass}`}
                      dir="rtl"
                    >
                      {ayah.arab}
                      <span className="inline-flex items-center justify-center w-7 h-7 mr-2 rounded-full border border-emerald-600/40 text-[11px] font-mono font-bold text-emerald-800 align-middle">
                        {ayah.number}
                      </span>
                    </p>
                  </div>

                  {/* Latin Transliteration */}
                  {showLatin && ayah.latin && (
                    <div className="pt-2 pb-1 text-slate-600 text-xs sm:text-sm italic font-medium leading-relaxed">
                      {ayah.latin}
                    </div>
                  )}

                  {/* Translation */}
                  {showTranslation && ayah.translationId && (
                    <div className="pt-2 text-slate-800 text-xs sm:text-sm leading-relaxed border-t border-slate-100 mt-2">
                      {ayah.translationId}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Surah Navigation Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-emerald-900/60">
            {surahData.number > 1 ? (
              <button
                onClick={() => onSelectSurah(surahData.number - 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-800/60 hover:bg-[#183d35] bg-[#12312b] text-xs font-semibold text-emerald-100 hover:text-white transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 text-amber-400" />
                <span>Surah Sebelumnya</span>
              </button>
            ) : <div />}

            {surahData.number < 114 && (
              <button
                onClick={() => onSelectSurah(surahData.number + 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-800/60 hover:bg-[#183d35] bg-[#12312b] text-xs font-semibold text-emerald-100 hover:text-white transition-colors shadow-sm"
              >
                <span>Surah Selanjutnya</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
