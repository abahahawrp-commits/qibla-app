import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Play,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Share2,
  Volume2,
  VolumeX,
  BookOpen,
  Zap,
  BarChart3,
  Check,
  ChevronRight,
  Flame,
} from 'lucide-react';
import {
  QuizDifficulty,
  QuizCategory,
  QuizQuestion,
  QuizSessionResult,
  QuizUserStats,
} from '../../types/quiz';
import {
  ISLAMIC_QUESTIONS,
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
} from '../../data/islamicQuiz';
import { soundManager } from '../../utils/audioService';

interface IslamicQuizProps {
  onBack?: () => void;
}

type QuizScreenState = 'lobby' | 'playing' | 'result' | 'review';

const LOCAL_STORAGE_KEY_STATS = 'nurul_islam_quiz_stats_v1';

export const IslamicQuiz: React.FC<IslamicQuizProps> = ({ onBack }) => {
  // Navigation & Screen state
  const [screen, setScreen] = useState<QuizScreenState>('lobby');

  // Lobby selections
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty>('mudah');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>('semua');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [lifeline5050Used, setLifeline5050Used] = useState<boolean>(false);
  const [lifelineTimeUsed, setLifelineTimeUsed] = useState<boolean>(false);

  // Timer & Scoring state
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // Session result & history
  const [sessionResult, setSessionResult] = useState<QuizSessionResult | null>(null);
  const [userStats, setUserStats] = useState<QuizUserStats>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STATS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      totalQuizzesPlayed: 0,
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
      highestScore: 0,
      streakDays: 1,
      history: [],
    };
  });

  const [shareToast, setShareToast] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Persist user stats
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_STATS, JSON.stringify(userStats));
    } catch {
      // ignore
    }
  }, [userStats]);

  // Available question count for the current filter
  const poolQuestions = useMemo(() => {
    return ISLAMIC_QUESTIONS.filter((q) => {
      const matchDiff = q.difficulty === selectedDifficulty;
      const matchCat = selectedCategory === 'semua' || q.category === selectedCategory;
      return matchDiff && matchCat;
    });
  }, [selectedDifficulty, selectedCategory]);

  // Start new quiz
  const handleStartQuiz = () => {
    let pool = [...poolQuestions];
    if (pool.length === 0) {
      // Fallback to all questions of this difficulty
      pool = ISLAMIC_QUESTIONS.filter((q) => q.difficulty === selectedDifficulty);
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    setQuestions(selected);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setEliminatedOptions([]);
    setLifeline5050Used(false);
    setLifelineTimeUsed(false);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(20);
    setSessionStartTime(Date.now());
    setScreen('playing');

    if (soundEnabled) {
      soundManager.playTasbihClick(1.3);
    }
  };

  // Timer countdown hook for playing screen
  useEffect(() => {
    if (screen !== 'playing' || !timerEnabled || isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        if (soundEnabled && prev <= 4) {
          soundManager.playQuizTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, timerEnabled, isAnswered, currentIndex, soundEnabled]);

  // Handle timeout
  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(null);
    setWrongCount((prev) => prev + 1);

    if (soundEnabled) {
      soundManager.playQuizWrong();
    }
  };

  // User chooses an option
  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered || eliminatedOptions.includes(optionIndex)) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = optionIndex === currentQ.correctIndex;
    const pointsAwarded = DIFFICULTY_LABELS[currentQ.difficulty].pointsPerQuestion;

    if (isCorrect) {
      const bonusTime = timerEnabled ? Math.round(timeLeft * 0.5) : 0;
      setScore((prev) => prev + pointsAwarded + bonusTime);
      setCorrectCount((prev) => prev + 1);
      if (soundEnabled) {
        soundManager.playQuizCorrect();
      }
    } else {
      setWrongCount((prev) => prev + 1);
      if (soundEnabled) {
        soundManager.playQuizWrong();
      }
    }
  };

  // Lifeline: 50:50 (eliminate 2 incorrect options)
  const handleUse5050 = () => {
    if (lifeline5050Used || isAnswered) return;
    const currentQ = questions[currentIndex];
    const incorrectIndices = [0, 1, 2, 3].filter((idx) => idx !== currentQ.correctIndex);
    const shuffledIncorrect = [...incorrectIndices].sort(() => Math.random() - 0.5);
    const toEliminate = shuffledIncorrect.slice(0, 2);

    setEliminatedOptions(toEliminate);
    setLifeline5050Used(true);

    if (soundEnabled) {
      soundManager.playTasbihClick(1.5);
    }
  };

  // Lifeline: Add 15 seconds
  const handleAddExtraTime = () => {
    if (lifelineTimeUsed || isAnswered || !timerEnabled) return;
    setTimeLeft((prev) => prev + 15);
    setLifelineTimeUsed(true);

    if (soundEnabled) {
      soundManager.playTasbihClick(1.2);
    }
  };

  // Move to next question or finalize quiz
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setEliminatedOptions([]);
      setTimeLeft(20);
      if (soundEnabled) {
        soundManager.playTasbihClick(1.0);
      }
    } else {
      finishQuiz();
    }
  };

  // Finalize quiz session
  const finishQuiz = () => {
    const timeSpent = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
    const totalQ = questions.length;
    const finalAccuracy = Math.round((correctCount / totalQ) * 100);
    const maxScore = totalQ * DIFFICULTY_LABELS[selectedDifficulty].pointsPerQuestion;

    const result: QuizSessionResult = {
      totalQuestions: totalQ,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      skippedAnswers: totalQ - (correctCount + wrongCount),
      score,
      maxScore,
      accuracy: finalAccuracy,
      timeSpentSeconds: timeSpent,
      difficulty: selectedDifficulty,
      category: selectedCategory,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      answersHistory: questions.map((q, i) => {
        // Track the current answer
        const isCurrent = i === currentIndex;
        const chosen = isCurrent ? selectedOption : null;
        return {
          questionId: q.id,
          question: q.question,
          options: q.options,
          selectedOptionIndex: chosen,
          correctOptionIndex: q.correctIndex,
          isCorrect: chosen === q.correctIndex,
          explanation: q.explanation,
          sourceOrDalil: q.sourceOrDalil,
        };
      }),
    };

    setSessionResult(result);
    setScreen('result');

    // Update global user stats
    setUserStats((prev) => ({
      totalQuizzesPlayed: prev.totalQuizzesPlayed + 1,
      totalQuestionsAnswered: prev.totalQuestionsAnswered + totalQ,
      totalCorrect: prev.totalCorrect + correctCount,
      highestScore: Math.max(prev.highestScore, score),
      streakDays: prev.streakDays,
      history: [
        {
          id: String(Date.now()),
          date: result.date,
          score,
          accuracy: finalAccuracy,
          difficulty: selectedDifficulty,
          category: selectedCategory,
        },
        ...prev.history.slice(0, 9),
      ],
    }));

    if (soundEnabled) {
      soundManager.playQuizComplete();
    }
  };

  // Predicate label based on accuracy
  const getPerformanceBadge = (accuracy: number) => {
    if (accuracy >= 90) {
      return {
        arabic: 'مُمْتَاز',
        latin: 'Mumtaz! (Istimewa)',
        desc: 'Masya Allah, wawasan dan pemahaman keislaman Anda sangat luar biasa!',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        starEmoji: '🌟',
      };
    } else if (accuracy >= 75) {
      return {
        arabic: 'جَيِّد جِدًّا',
        latin: 'Jayyid Jiddan (Sangat Baik)',
        desc: 'Alhamdulillah, bekal ilmu Anda sangat bagus dan matang!',
        badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
        starEmoji: '🌙',
      };
    } else if (accuracy >= 60) {
      return {
        arabic: 'جَيِّد',
        latin: 'Jayyid (Baik)',
        desc: 'Bagus sekali! Terus asah wawasan dan pelajari kembali materi yang belum tepat.',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        starEmoji: '📖',
      };
    } else {
      return {
        arabic: 'مَقْبُول',
        latin: 'Maqbul (Cukup)',
        desc: 'Semangat menuntut ilmu! Jadikan kuis ini sarana belajar yang bermanfaat.',
        badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        starEmoji: '🌱',
      };
    }
  };

  // Share score
  const handleShareResult = async () => {
    if (!sessionResult) return;
    const text = `🏆 Skor Kuis Islami Nurul Islam: ${sessionResult.score} Poin (Akurasi ${sessionResult.accuracy}%)\nTingkat: ${DIFFICULTY_LABELS[sessionResult.difficulty].name}\nAyo uji dan perkaya wawasan keislamanmu di Nurul Islam!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hasil Kuis Islami - Nurul Islam',
          text,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled share or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setShareToast('Hasil kuis berhasil disalin ke clipboard!');
      setTimeout(() => setShareToast(null), 3000);
    } catch {
      setShareToast('Gagal menyalin hasil kuis.');
      setTimeout(() => setShareToast(null), 2000);
    }
  };

  // ----------------------------------------------------
  // SCREEN 1: LOBBY & PREPARATION
  // ----------------------------------------------------
  if (screen === 'lobby') {
    return (
      <div className="max-w-xl mx-auto space-y-5 pb-12 text-white">
        {/* Top App Bar Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="w-9 h-9 rounded-full bg-[#12312b] border border-emerald-900/80 flex items-center justify-center text-emerald-200 hover:text-white transition-colors"
                title="Kembali ke Beranda"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Kuis Wawasan Islam</span>
                <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                  Interaktif
                </span>
              </h1>
              <p className="text-xs text-emerald-300/80">
                Uji dan perluas pengetahuan aqidah, sirah, fiqih & Al-Qur'an
              </p>
            </div>
          </div>

          {/* Sound & Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
              soundEnabled
                ? 'bg-emerald-900/60 border-emerald-700 text-emerald-300'
                : 'bg-slate-900/60 border-slate-700 text-slate-400'
            }`}
            title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Hero Banner with Islamic Art Motif */}
        <div className="rounded-3xl bg-gradient-to-br from-[#12312b] via-[#0d2a23] to-[#071914] border border-emerald-800/60 p-5 shadow-xl relative overflow-hidden">
          <div className="absolute right-2 top-2 bottom-0 w-32 flex items-center justify-center pointer-events-none select-none opacity-20 text-8xl">
            🕌
          </div>

          <div className="relative z-10 space-y-2 max-w-[80%]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tholabul 'Ilmi Faridhah</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">
              Perkaya Wawasan & Pemahaman Dienul Islam
            </h2>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Jawab pertanyaan pilihan ganda dengan penjelasan tafsir dan dalil di setiap soalnya.
            </p>
          </div>

          {/* Quick User Stats Banner */}
          <div className="grid grid-cols-3 gap-2 pt-4 mt-3 border-t border-emerald-900/60 text-center">
            <div className="bg-[#09221b]/80 rounded-xl p-2 border border-emerald-900/40">
              <span className="text-[10px] text-emerald-400/70 block uppercase font-medium">
                Kuis Dimainkan
              </span>
              <span className="text-base font-extrabold text-white">
                {userStats.totalQuizzesPlayed}
              </span>
            </div>
            <div className="bg-[#09221b]/80 rounded-xl p-2 border border-emerald-900/40">
              <span className="text-[10px] text-amber-400/70 block uppercase font-medium">
                Skor Tertinggi
              </span>
              <span className="text-base font-extrabold text-amber-300">
                {userStats.highestScore}
              </span>
            </div>
            <div className="bg-[#09221b]/80 rounded-xl p-2 border border-emerald-900/40">
              <span className="text-[10px] text-teal-400/70 block uppercase font-medium">
                Soal Terjawab
              </span>
              <span className="text-base font-extrabold text-teal-300">
                {userStats.totalQuestionsAnswered}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Pilih Tingkat Kesulitan */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>1. Pilih Tingkat Kesulitan</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['mudah', 'sedang', 'sulit'] as QuizDifficulty[]).map((diff) => {
              const meta = DIFFICULTY_LABELS[diff];
              const isSelected = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`p-3.5 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#12312b] border-amber-400/80 shadow-lg shadow-amber-400/10 ring-1 ring-amber-400/40'
                      : 'bg-[#0c251f]/80 border-emerald-900/60 hover:border-emerald-700/80 text-emerald-100/80'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white tracking-wide">
                        {meta.name}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-200/70 line-clamp-2 leading-relaxed">
                      {meta.desc}
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>+{meta.pointsPerQuestion} Poin / Soal</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Pilih Kategori Topik */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Pilih Kategori Tema</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(CATEGORY_LABELS) as QuizCategory[]).map((catKey) => {
              const cat = CATEGORY_LABELS[catKey];
              const isSelected = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-[#12312b] border-emerald-500/80 text-white font-bold ring-1 ring-emerald-500/30'
                      : 'bg-[#0c251f]/60 border-emerald-900/40 hover:border-emerald-800 text-emerald-200/70'
                  }`}
                >
                  <span className="text-xl shrink-0">{cat.icon}</span>
                  <div className="min-w-0">
                    <span className="text-xs block truncate leading-tight font-medium text-white">
                      {cat.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Pengaturan Sesi */}
        <div className="rounded-2xl bg-[#0c251f] border border-emerald-900/60 p-4 space-y-3.5">
          <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Pengaturan Kuis</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Jumlah Soal */}
            <div className="space-y-1.5">
              <span className="text-xs text-emerald-200/80 font-medium block">
                Jumlah Soal:
              </span>
              <div className="flex items-center gap-1.5 bg-[#071914] p-1 rounded-xl border border-emerald-900/60">
                {[5, 10].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      questionCount === count
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-emerald-300 hover:text-white'
                    }`}
                  >
                    {count} Soal
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Mode */}
            <div className="space-y-1.5">
              <span className="text-xs text-emerald-200/80 font-medium block">
                Batas Waktu:
              </span>
              <div className="flex items-center gap-1.5 bg-[#071914] p-1 rounded-xl border border-emerald-900/60">
                <button
                  onClick={() => setTimerEnabled(true)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    timerEnabled
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-emerald-300 hover:text-white'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>20 Detik</span>
                </button>
                <button
                  onClick={() => setTimerEnabled(false)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !timerEnabled
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-emerald-300 hover:text-white'
                  }`}
                >
                  Santai
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            onClick={handleStartQuiz}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2.5 transition-transform active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>MULAI KUIS SEKARANG</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Riwayat Terakhir Mini */}
        {userStats.history.length > 0 && (
          <div className="pt-2 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400/80 uppercase tracking-wider">
              Riwayat Kuis Terakhir
            </h4>
            <div className="space-y-1.5">
              {userStats.history.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-[#09221b]/60 rounded-xl px-3.5 py-2.5 border border-emerald-900/40 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div>
                      <span className="text-white font-semibold capitalize">
                        {item.difficulty} - {CATEGORY_LABELS[item.category]?.name}
                      </span>
                      <span className="text-[10px] text-emerald-300/60 block">
                        {item.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-300 font-extrabold">{item.score} Pts</span>
                    <span className="text-[10px] text-emerald-400 block font-medium">
                      Akurasi {item.accuracy}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // SCREEN 2: PLAYING SESSION
  // ----------------------------------------------------
  if (screen === 'playing' && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const totalQ = questions.length;
    const progressPercent = Math.round(((currentIndex + 1) / totalQ) * 100);

    return (
      <div className="max-w-xl mx-auto space-y-4 pb-16 text-white select-none">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin keluar dari sesi kuis ini?')) {
                setScreen('lobby');
              }
            }}
            className="text-xs text-emerald-300/80 hover:text-white flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[#0c251f] border border-emerald-900/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Keluar Sesi</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                DIFFICULTY_LABELS[currentQ.difficulty].badge
              }`}
            >
              {DIFFICULTY_LABELS[currentQ.difficulty].name}
            </span>
            <div className="bg-[#0c251f] px-3 py-1 rounded-full border border-emerald-900/60 text-xs font-bold text-amber-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{score} Poin</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-300/80 font-medium">
              Soal {currentIndex + 1} dari {totalQ}
            </span>
            <span className="text-amber-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#0c251f] overflow-hidden border border-emerald-900/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Timer Bar & Lifelines Bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Circular/Pill Timer */}
          {timerEnabled ? (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black transition-colors ${
                timeLeft <= 5
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse ring-2 ring-rose-500/30'
                  : timeLeft <= 10
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                  : 'bg-[#12312b] border-emerald-700 text-emerald-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s Tersisa</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-900/60 bg-[#0c251f] text-xs text-emerald-300 font-medium">
              <span>Mode Santai</span>
            </div>
          )}

          {/* Lifelines */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUse5050}
              disabled={lifeline5050Used || isAnswered}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all ${
                lifeline5050Used || isAnswered
                  ? 'opacity-40 bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-[#12312b] border-emerald-700 hover:border-amber-400 text-amber-300 hover:bg-emerald-900'
              }`}
              title="Hilangkan 2 pilihan salah (1x per sesi)"
            >
              <span>50:50</span>
              {lifeline5050Used && <Check className="w-3 h-3 text-emerald-400" />}
            </button>

            {timerEnabled && (
              <button
                onClick={handleAddExtraTime}
                disabled={lifelineTimeUsed || isAnswered}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all ${
                  lifelineTimeUsed || isAnswered
                    ? 'opacity-40 bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-[#12312b] border-emerald-700 hover:border-amber-400 text-amber-300 hover:bg-emerald-900'
                }`}
                title="Tambah 15 detik waktu berpikir (1x per sesi)"
              >
                <span>+15s</span>
                {lifelineTimeUsed && <Check className="w-3 h-3 text-emerald-400" />}
              </button>
            )}
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-3xl bg-[#0c251f] border border-emerald-900/80 p-5 shadow-xl relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between text-[11px] text-emerald-300/70 font-semibold uppercase tracking-wider">
            <span>{CATEGORY_LABELS[currentQ.category]?.name}</span>
            <span>+{DIFFICULTY_LABELS[currentQ.difficulty].pointsPerQuestion} Pts</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed tracking-tight">
            {currentQ.question}
          </h2>
        </div>

        {/* Options Grid (A, B, C, D) */}
        <div className="grid grid-cols-1 gap-2.5">
          {currentQ.options.map((optionText, optIndex) => {
            const letter = ['A', 'B', 'C', 'D'][optIndex];
            const isEliminated = eliminatedOptions.includes(optIndex);
            const isChosen = selectedOption === optIndex;
            const isCorrectOption = optIndex === currentQ.correctIndex;

            // Visual state styling
            let optionStyle =
              'bg-[#0f2d25] border-emerald-900/80 text-emerald-100 hover:border-emerald-600 hover:bg-[#12382f]';

            if (isAnswered) {
              if (isCorrectOption) {
                optionStyle =
                  'bg-emerald-900/90 border-emerald-400 text-white font-bold ring-2 ring-emerald-400/50';
              } else if (isChosen && !isCorrectOption) {
                optionStyle =
                  'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/40';
              } else {
                optionStyle = 'opacity-50 bg-[#071914] border-emerald-950 text-emerald-400/40';
              }
            } else if (isEliminated) {
              optionStyle = 'opacity-20 bg-slate-900 border-slate-800 text-slate-600 line-through';
            }

            return (
              <button
                key={optIndex}
                onClick={() => handleSelectOption(optIndex)}
                disabled={isAnswered || isEliminated}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${optionStyle}`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isAnswered && isCorrectOption
                        ? 'bg-emerald-400 text-slate-950'
                        : isAnswered && isChosen
                        ? 'bg-rose-500 text-white'
                        : 'bg-[#071914] border border-emerald-800/80 text-emerald-300'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-normal">
                    {optionText}
                  </span>
                </div>

                {/* State Icons */}
                {isAnswered && (
                  <div className="shrink-0">
                    {isCorrectOption ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isChosen ? (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card & Next Button (Appears immediately after answering) */}
        {isAnswered && (
          <div className="rounded-3xl bg-[#12312b] border border-emerald-700/80 p-5 space-y-3.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header Verdict */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedOption === currentQ.correctIndex ? (
                  <>
                    <div className="w-7 h-7 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-300 block">
                        Alhamdulillah, Jawaban Benar!
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        +{DIFFICULTY_LABELS[currentQ.difficulty].pointsPerQuestion} Poin
                        {timerEnabled && timeLeft > 0 ? ` (+${Math.round(timeLeft * 0.5)} Bonus Kecepatan)` : ''}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">
                      ✕
                    </div>
                    <div>
                      <span className="text-xs font-bold text-rose-300 block">
                        {selectedOption === null ? 'Waktu Habis!' : 'Jawaban Kurang Tepat'}
                      </span>
                      <span className="text-[10px] text-emerald-300/80">
                        Jawaban benar: <strong>{currentQ.options[currentQ.correctIndex]}</strong>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Educational Explanation / Pembahasan */}
            <div className="bg-[#09221b] rounded-2xl p-3.5 border border-emerald-900/70 space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Pembahasan & Wawasan:</span>
              </span>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {currentQ.explanation}
              </p>
              {currentQ.sourceOrDalil && (
                <div className="pt-1.5 border-t border-emerald-900/60 text-[11px] text-amber-300/90 italic flex items-center gap-1">
                  <span>📖 Dalil:</span>
                  <span>{currentQ.sourceOrDalil}</span>
                </div>
              )}
            </div>

            {/* Next Question / Finish Button */}
            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>
                {currentIndex + 1 < totalQ ? 'Lanjut ke Soal Berikutnya' : 'Lihat Hasil Akhir'}
              </span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // SCREEN 3: RESULT SCREEN
  // ----------------------------------------------------
  if (screen === 'result' && sessionResult) {
    const badge = getPerformanceBadge(sessionResult.accuracy);

    return (
      <div className="max-w-xl mx-auto space-y-5 pb-16 text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setScreen('lobby')}
            className="w-9 h-9 rounded-full bg-[#12312b] border border-emerald-900/80 flex items-center justify-center text-emerald-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-bold text-white">Hasil Kuis Islami</h1>
          <button
            onClick={handleShareResult}
            className="w-9 h-9 rounded-full bg-[#12312b] border border-emerald-900/80 flex items-center justify-center text-amber-400 hover:text-amber-300"
            title="Bagikan Hasil Kuis"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {shareToast && (
          <div className="bg-emerald-900 text-white text-xs py-2 px-4 rounded-xl text-center border border-emerald-600 animate-in fade-in">
            {shareToast}
          </div>
        )}

        {/* Hero Score Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#12312b] via-[#0d2a23] to-[#071914] border border-emerald-700/80 p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-amber-400/10">
            {badge.starEmoji}
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-serif text-amber-300 block">{badge.arabic}</span>
            <h2 className="text-xl font-black text-white">{badge.latin}</h2>
            <p className="text-xs text-emerald-200/80 max-w-sm mx-auto leading-relaxed">
              {badge.desc}
            </p>
          </div>

          {/* Big Score Display */}
          <div className="py-2">
            <span className="text-[11px] text-emerald-400 uppercase tracking-widest font-bold block">
              TOTAL SKOR KAMU
            </span>
            <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight">
              {sessionResult.score}
            </div>
            <span className="text-xs text-emerald-300/70">
              Akurasi: <strong>{sessionResult.accuracy}%</strong>
            </span>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-900/60">
            <div className="bg-[#09221b]/80 rounded-xl p-2.5 border border-emerald-900/40">
              <span className="text-[10px] text-emerald-400 block font-semibold uppercase">
                Benar
              </span>
              <span className="text-base font-extrabold text-emerald-300">
                {sessionResult.correctAnswers} / {sessionResult.totalQuestions}
              </span>
            </div>
            <div className="bg-[#09221b]/80 rounded-xl p-2.5 border border-emerald-900/40">
              <span className="text-[10px] text-rose-400 block font-semibold uppercase">
                Salah
              </span>
              <span className="text-base font-extrabold text-rose-300">
                {sessionResult.wrongAnswers}
              </span>
            </div>
            <div className="bg-[#09221b]/80 rounded-xl p-2.5 border border-emerald-900/40">
              <span className="text-[10px] text-teal-400 block font-semibold uppercase">
                Waktu
              </span>
              <span className="text-base font-extrabold text-teal-300">
                {sessionResult.timeSpentSeconds}s
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleStartQuiz}
            className="py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Lagi</span>
          </button>

          <button
            onClick={() => setScreen('review')}
            className="py-3.5 px-4 rounded-2xl bg-[#12312b] hover:bg-[#163c34] border border-emerald-700/80 text-emerald-200 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Tinjau Pembahasan</span>
          </button>
        </div>

        <button
          onClick={() => setScreen('lobby')}
          className="w-full py-3 rounded-2xl bg-[#0c251f] hover:bg-[#0f2e26] border border-emerald-900/60 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Pilihan Kuis / Tingkat Kesulitan</span>
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // SCREEN 4: REVIEW MODE (Tinjauan Jawaban & Dalil)
  // ----------------------------------------------------
  if (screen === 'review' && sessionResult) {
    return (
      <div className="max-w-xl mx-auto space-y-4 pb-16 text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setScreen('result')}
            className="flex items-center gap-1.5 text-xs text-emerald-200 bg-[#12312b] border border-emerald-900/80 py-1.5 px-3 rounded-xl hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Skor</span>
          </button>
          <span className="text-xs font-bold text-emerald-300">
            Tinjauan Pembahasan Soal
          </span>
        </div>

        <div className="space-y-3">
          {sessionResult.answersHistory.map((item, idx) => {
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0c251f] border border-emerald-900/80 p-4 space-y-2.5 shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-emerald-400">
                    Soal #{idx + 1}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {item.isCorrect ? 'Benar ✓' : 'Salah ✕'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  {item.question}
                </p>

                {/* Options display */}
                <div className="space-y-1.5 pt-1 text-xs">
                  {item.options.map((opt, optI) => {
                    const isCorrect = optI === item.correctOptionIndex;
                    const isSelected = optI === item.selectedOptionIndex;
                    return (
                      <div
                        key={optI}
                        className={`p-2 rounded-xl border flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold'
                            : isSelected
                            ? 'bg-rose-950/80 border-rose-600 text-rose-300 font-medium'
                            : 'bg-[#071914] border-emerald-950 text-emerald-400/50'
                        }`}
                      >
                        <span>
                          {['A', 'B', 'C', 'D'][optI]}. {opt}
                        </span>
                        {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="bg-[#09221b] p-3 rounded-xl border border-emerald-900/60 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-amber-400 block uppercase">
                    Pembahasan:
                  </span>
                  <p className="text-emerald-100/85 leading-relaxed">{item.explanation}</p>
                  {item.sourceOrDalil && (
                    <span className="text-[11px] text-amber-300/80 italic block pt-1">
                      📖 {item.sourceOrDalil}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setScreen('result')}
          className="w-full py-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Hasil Skor</span>
        </button>
      </div>
    );
  }

  return null;
};
