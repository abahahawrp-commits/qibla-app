import React, { useState, useEffect, useMemo } from 'react';
import {
  UMRAH_STEPS,
  UMRAH_DOAS,
  MIQAT_STATIONS,
  IHRAM_PROHIBITIONS,
  UMRAH_CHECKLIST_DEFAULT,
} from '../../data/umrahData';
import {
  UmrahStep,
  UmrahDoa,
  UmrahCategory,
  UmrahChecklistItem,
} from '../../types/umrah';
import { soundManager } from '../../utils/audioService';
import {
  ArrowLeft,
  Check,
  Copy,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Compass,
  MapPin,
  Sparkles,
  BookOpen,
  Volume2,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Info,
  CheckSquare,
  Square,
  Search,
  CheckCircle,
  Clock,
  Layers,
  HeartHandshake,
  Share2,
} from 'lucide-react';

interface UmrahGuideProps {
  onBack: () => void;
  onNavigateTab?: (tab: string) => void;
}

type UmrahSubTab =
  | 'manasik'
  | 'counter'
  | 'doa'
  | 'miqat'
  | 'larangan'
  | 'checklist'
  | 'tips';

export const UmrahGuide: React.FC<UmrahGuideProps> = ({ onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState<UmrahSubTab>('manasik');

  // Step detail modal / expand state
  const [selectedStepId, setSelectedStepId] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Counter Thawaf & Sa'i state
  const [counterMode, setCounterMode] = useState<'tawaf' | 'sai'>('tawaf');
  const [tawafRound, setTawafRound] = useState<number>(1);
  const [tawafFinished, setTawafFinished] = useState<boolean>(false);

  const [saiTrip, setSaiTrip] = useState<number>(1);
  const [saiFinished, setSaiFinished] = useState<boolean>(false);

  // Doa tab search & category filter
  const [doaSearch, setDoaSearch] = useState<string>('');
  const [doaCategory, setDoaCategory] = useState<string>('all');

  // Checklist state stored in localStorage
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('nurul_islam_umrah_checklist');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const [checklistCategory, setChecklistCategory] = useState<string>('all');

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('nurul_islam_umrah_checklist', JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetChecklist = () => {
    if (window.confirm('Reset semua checklist persiapan Umroh?')) {
      setChecklist({});
      localStorage.removeItem('nurul_islam_umrah_checklist');
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Text-to-speech for Arabic/Doa
  const handlePlayVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Increment Thawaf circuit
  const handleNextTawaf = () => {
    soundManager.playTasbihClick(1.15);
    if (tawafRound < 7) {
      setTawafRound((prev) => prev + 1);
    } else {
      setTawafFinished(true);
      soundManager.playSuccessChime();
    }
  };

  const handleResetTawaf = () => {
    setTawafRound(1);
    setTawafFinished(false);
  };

  // Increment Sa'i trip
  const handleNextSai = () => {
    soundManager.playTasbihClick(1.25);
    if (saiTrip < 7) {
      setSaiTrip((prev) => prev + 1);
    } else {
      setSaiFinished(true);
      soundManager.playSuccessChime();
    }
  };

  const handleResetSai = () => {
    setSaiTrip(1);
    setSaiFinished(false);
  };

  // Checklist statistics
  const checklistStats = useMemo(() => {
    const total = UMRAH_CHECKLIST_DEFAULT.length;
    const completed = UMRAH_CHECKLIST_DEFAULT.filter(
      (item) => checklist[item.id]
    ).length;
    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }, [checklist]);

  // Filtered Doas
  const filteredDoas = useMemo(() => {
    return UMRAH_DOAS.filter((doa) => {
      const matchSearch =
        doa.title.toLowerCase().includes(doaSearch.toLowerCase()) ||
        doa.latin.toLowerCase().includes(doaSearch.toLowerCase()) ||
        doa.translation.toLowerCase().includes(doaSearch.toLowerCase()) ||
        doa.arabic.includes(doaSearch);

      const matchCat =
        doaCategory === 'all' || doa.category === doaCategory;

      return matchSearch && matchCat;
    });
  }, [doaSearch, doaCategory]);

  const activeStep = useMemo(() => {
    return (
      UMRAH_STEPS.find((s) => s.id === selectedStepId) || UMRAH_STEPS[0]
    );
  }, [selectedStepId]);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2e25] via-[#09221b] to-[#051511] border border-amber-500/30 p-5 sm:p-7 text-white shadow-2xl">
        {/* Subtle decorative islamic geometry background */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
                Panduan Resmi Manasik
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🕋</span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                  Panduan Ibadah Umroh
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                Panduan manasik umroh lengkap sesuai sunnah Rasulullah SAW: rukun,
                tahapan langkah demi langkah, doa-doa maqbul, peta miqat, counter
                thawaf & sa'i otomatis, serta checklist persiapan jamaah.
              </p>
            </div>

            {/* Quick action button to Counter */}
            <button
              onClick={() => setActiveSubTab('counter')}
              className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-500/25 transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Counter Thawaf & Sa'i</span>
            </button>
          </div>

          {/* Sub Navigation Horizontal Scrollable Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-emerald-900/50">
            <button
              onClick={() => setActiveSubTab('manasik')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeSubTab === 'manasik'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-200/90'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>6 Tahapan Manasik</span>
            </button>

            <button
              onClick={() => setActiveSubTab('counter')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeSubTab === 'counter'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-200/90'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Counter Thawaf / Sa'i</span>
            </button>

            <button
              onClick={() => setActiveSubTab('doa')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeSubTab === 'doa'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-200/90'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Doa-Doa Umroh</span>
            </button>

            <button
              onClick={() => setActiveSubTab('miqat')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeSubTab === 'miqat'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-200/90'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Titik Miqat</span>
            </button>

            <button
              onClick={() => setActiveSubTab('larangan')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeSubTab === 'larangan'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-200/90'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Larangan & Dam</span>
            </button>

            <button
              onClick={() => setActiveSubTab('checklist')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeSubTab === 'checklist'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-200/90'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Checklist Jamaah</span>
              <span className="text-[10px] bg-emerald-950 px-1.5 py-0.2 rounded-full text-amber-300">
                {checklistStats.percentage}%
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('tips')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeSubTab === 'tips'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-200/90'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Tips Tanah Suci</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SUB-TAB: TAHAPAN MANASIK LANGKAH DEMI LANGKAH */}
      {/* ========================================================================= */}
      {activeSubTab === 'manasik' && (
        <div className="space-y-6">
          {/* Quick Rukun vs Wajib Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="rounded-2xl bg-[#102d24] border border-amber-400/30 p-4 text-emerald-100 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                1
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white">
                    Rukun Umroh (Wajib Dikerjakan)
                  </h3>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    Tidak Sah Jika Ditinggal
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  1. Ihram & Niat &bull; 2. Thawaf 7 Putaran &bull; 3. Sa'i Shafa-Marwah &bull; 4. Tahallul (Cukur Rambut) &bull; 5. Tertib (Berurutan).
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#102d24] border border-emerald-700/50 p-4 text-emerald-100 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                2
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white">
                    Wajib Umroh (Ada Denda/Dam)
                  </h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    Dikenai Dam Jika Luput
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  1. Berniat Ihram dari Miqat &bull; 2. Menjauhi seluruh larangan ihram selama berihram. Jika dilanggar wajib membayar fidyah/dam.
                </p>
              </div>
            </div>
          </div>

          {/* Stepper Timeline Navigation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-2">
                <span>Urutan Langkah Manasik</span>
                <span className="text-xs font-normal text-emerald-300/70">
                  (Pilih langkah untuk melihat detail tata cara)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {UMRAH_STEPS.map((step) => {
                const isSelected = selectedStepId === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setSelectedStepId(step.id)}
                    className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg font-bold scale-[1.02]'
                        : 'bg-[#102d24] hover:bg-[#163c31] text-emerald-100 border-emerald-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                          isSelected
                            ? 'bg-slate-950 text-amber-400'
                            : 'bg-emerald-900/60 text-emerald-300'
                        }`}
                      >
                        {step.stepNumber}
                      </span>
                      {step.isRukun && (
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-slate-950/20 text-slate-950'
                              : 'bg-amber-400/20 text-amber-300'
                          }`}
                        >
                          Rukun
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-bold line-clamp-2 leading-tight">
                        {step.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Step Card */}
          <div className="rounded-3xl bg-[#0e2a22] border border-emerald-800/80 p-5 sm:p-7 text-white shadow-xl space-y-6">
            {/* Step Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
                    {activeStep.stepNumber}
                  </span>
                  <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                    {activeStep.isRukun ? 'Rukun Umroh' : 'Wajib / Sunnah Umroh'}
                  </span>
                  <span className="text-xs text-emerald-500">•</span>
                  <span className="text-xs text-emerald-300/80 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {activeStep.location}
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-white">
                  {activeStep.title}
                </h3>
              </div>

              <div className="text-right sm:text-right">
                <p className="font-arabic text-xl sm:text-2xl text-amber-300">
                  {activeStep.arabicTitle}
                </p>
              </div>
            </div>

            {/* Summary & Description */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#143d31] border border-emerald-700/60 text-xs sm:text-sm text-emerald-100 font-medium">
                <span className="font-bold text-amber-300">Inti Amalan: </span>
                {activeStep.summary}
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                {activeStep.description}
              </p>
            </div>

            {/* Tata Cara Detail */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Tata Cara Pelaksanaan:</span>
              </h4>
              <ul className="space-y-2">
                {activeStep.instructions.map((inst, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-100 bg-[#12362b]/80 p-3 rounded-xl border border-emerald-800/40"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Doas for this step */}
            {activeStep.doaIds && activeStep.doaIds.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Doa & Bacaan Pada Tahap Ini:</span>
                </h4>
                <div className="space-y-3">
                  {activeStep.doaIds.map((doaId) => {
                    const doa = UMRAH_DOAS.find((d) => d.id === doaId);
                    if (!doa) return null;
                    return (
                      <div
                        key={doa.id}
                        className="rounded-2xl bg-[#0a1e19] border border-amber-500/30 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-amber-300">
                            {doa.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePlayVoice(doa.arabic)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300 hover:text-white transition-colors"
                              title="Dengarkan Pelafalan"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                handleCopyText(
                                  `${doa.title}\n\n${doa.arabic}\n\n${doa.latin}\n\nArtinya: "${doa.translation}"`,
                                  doa.id
                                )
                              }
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300 hover:text-white transition-colors"
                              title="Salin Doa"
                            >
                              {copiedId === doa.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Arabic text with proper spacing and font */}
                        <p className="font-arabic text-xl sm:text-2xl text-right text-emerald-50 leading-loose py-1 selection:bg-amber-400/40">
                          {doa.arabic}
                        </p>

                        <p className="text-xs sm:text-sm text-amber-200/90 italic font-medium">
                          {doa.latin}
                        </p>

                        <p className="text-xs text-emerald-200/90 leading-relaxed border-t border-emerald-900/50 pt-2">
                          <strong className="text-white">Artinya: </strong>
                          "{doa.translation}"
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-emerald-400/70 pt-1">
                          <span>Sumber: {doa.source}</span>
                          <span className="text-amber-400/90">{doa.occasion}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tips & Common Mistakes To Avoid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
              <div className="p-4 rounded-2xl bg-[#12362b] border border-emerald-700/50 space-y-2">
                <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tips Praktis Jamaah:</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-emerald-100">
                  {activeStep.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-[#2e1515]/60 border border-red-500/30 space-y-2">
                <h5 className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>Kesalahan yang Sering Terjadi:</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-red-100/90">
                  {activeStep.mistakesToAvoid.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-red-400">•</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Navigation between steps */}
            <div className="flex items-center justify-between pt-4 border-t border-emerald-900/60">
              <button
                onClick={() =>
                  setSelectedStepId((prev) => Math.max(1, prev - 1))
                }
                disabled={activeStep.id === 1}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-emerald-200 transition-colors"
              >
                &larr; Langkah Sebelumnya
              </button>

              <button
                onClick={() =>
                  setSelectedStepId((prev) => Math.min(6, prev + 1))
                }
                disabled={activeStep.id === 6}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-950 transition-colors"
              >
                Langkah Berikutnya &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUB-TAB: COUNTER THAWAF & SA'I INTERAKTIF */}
      {/* ========================================================================= */}
      {activeSubTab === 'counter' && (
        <div className="space-y-6">
          {/* Mode Switcher: Thawaf vs Sa'i */}
          <div className="flex items-center justify-center">
            <div className="p-1 rounded-2xl bg-[#091f1a] border border-emerald-800/80 flex items-center gap-1 shadow-lg">
              <button
                onClick={() => setCounterMode('tawaf')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                  counterMode === 'tawaf'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <span>🕋</span>
                <span>Counter Thawaf (7 Putaran)</span>
              </button>

              <button
                onClick={() => setCounterMode('sai')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                  counterMode === 'sai'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <span>⛰️</span>
                <span>Counter Sa'i (7 Perjalanan)</span>
              </button>
            </div>
          </div>

          {/* ================= MODE THAWAF ================= */}
          {counterMode === 'tawaf' && (
            <div className="rounded-3xl bg-gradient-to-b from-[#0d2a21] to-[#071914] border border-amber-400/40 p-6 sm:p-8 text-white shadow-2xl text-center space-y-6 max-w-xl mx-auto">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full">
                  Asisten Digital di Lapangan
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white pt-1">
                  Penghitung Putaran Thawaf
                </h3>
                <p className="text-xs text-emerald-200/80">
                  Putaran mengelilingi Ka'bah berlawanan arah jarum jam (Ka'bah di sisi kiri).
                </p>
              </div>

              {/* Big Interactive Circle Display */}
              <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
                {/* SVG Radial Progress */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#12362b"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={
                      2 * Math.PI * 52 * (1 - (tawafFinished ? 7 : tawafRound) / 7)
                    }
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>

                {/* Inner Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {tawafFinished ? (
                    <div className="space-y-1">
                      <span className="text-4xl">🎉</span>
                      <p className="text-base font-black text-amber-300">
                        Thawaf Selesai!
                      </p>
                      <p className="text-[10px] text-emerald-200">
                        7 Putaran Tuntas
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                        Putaran Ke
                      </span>
                      <p className="text-5xl font-black text-white tracking-tighter">
                        {tawafRound}
                      </p>
                      <p className="text-xs text-amber-300 font-bold">
                        dari 7 Putaran
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Specific Sunnah Advice for this Round */}
              {!tawafFinished ? (
                <div className="p-3.5 rounded-2xl bg-[#12362b] border border-emerald-700/60 text-xs text-left space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-300">
                    <span>
                      {tawafRound <= 3
                        ? '🔥 Putaran 1-3: Sunnah Ramal'
                        : '🚶 Putaran 4-7: Berjalan Biasa'}
                    </span>
                    <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded text-emerald-200">
                      Bahu Kanan Terbuka (Pria)
                    </span>
                  </div>
                  <p className="text-emerald-100 text-[11px] leading-relaxed">
                    {tawafRound <= 3
                      ? 'Disunnahkan bagi pria berjalan cepat dengan langkah-langkah pendek (ramal).'
                      : 'Berjalan dengan tenang dan khusyuk memperbanyak doa dan dzikir.'}
                  </p>
                  <p className="text-amber-200/90 text-[11px] font-medium pt-1 border-t border-emerald-800/60">
                    💡 <em>Setiap tiba di garis Hajar Aswad:</em> Lambaikan tangan kanan & ucapkan <strong>"Bismillahi Allahu Akbar"</strong>.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-400/20 border border-amber-400/50 text-xs text-left space-y-2">
                  <p className="font-extrabold text-amber-300 text-sm">
                    Alhamdulillah! Amalan berikutnya:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-emerald-100 text-xs">
                    <li>Tutup kembali kedua bahu dengan kain ihram (akhiri idhthiba').</li>
                    <li>Mendirikan sholat sunnah thawaf 2 rakaat di belakang Maqam Ibrahim.</li>
                    <li>Minum air Zam-Zam secukupnya hingga segar.</li>
                    <li>Menuju Bukit Shafa untuk memulai ibadah Sa'i.</li>
                  </ol>
                </div>
              )}

              {/* Control Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleResetTawaf}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi (Reset)</span>
                </button>

                {!tawafFinished ? (
                  <button
                    onClick={handleNextTawaf}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Lanjut Putaran Berikutnya</span>
                    <ChevronRight className="w-5 h-5 stroke-[3]" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCounterMode('sai');
                      setSaiTrip(1);
                      setSaiFinished(false);
                    }}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Mulai Counter Sa'i &rarr;</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ================= MODE SA'I ================= */}
          {counterMode === 'sai' && (
            <div className="rounded-3xl bg-gradient-to-b from-[#0d2a21] to-[#071914] border border-amber-400/40 p-6 sm:p-8 text-white shadow-2xl text-center space-y-6 max-w-xl mx-auto">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full">
                  Asisten Digital di Mas'a
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white pt-1">
                  Penghitung Perjalanan Sa'i
                </h3>
                <p className="text-xs text-emerald-200/80">
                  Dihitung per arah: Shafa ke Marwah (1), Marwah ke Shafa (2), berakhir di Marwah (7).
                </p>
              </div>

              {/* Direction Indicator Visual */}
              <div className="p-4 rounded-2xl bg-[#12362b] border border-emerald-700/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span
                    className={`px-3 py-1 rounded-xl ${
                      saiTrip % 2 === 1
                        ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                        : 'bg-emerald-900/60 text-emerald-300'
                    }`}
                  >
                    ⛰️ Bukit Shafa
                  </span>

                  <span className="text-amber-300 text-xs font-bold animate-pulse">
                    {saiTrip % 2 === 1 ? '➡️ Menuju Marwah' : '⬅️ Menuju Shafa'}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-xl ${
                      saiTrip % 2 === 0 || saiFinished
                        ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                        : 'bg-emerald-900/60 text-emerald-300'
                    }`}
                  >
                    ⛰️ Bukit Marwah
                  </span>
                </div>

                {/* Stepper Dots 1 to 7 */}
                <div className="grid grid-cols-7 gap-1 pt-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                    const isPassed = saiFinished || num < saiTrip;
                    const isCurrent = !saiFinished && num === saiTrip;
                    return (
                      <div
                        key={num}
                        className={`h-2 rounded-full transition-all ${
                          isPassed
                            ? 'bg-emerald-400'
                            : isCurrent
                            ? 'bg-amber-400 ring-2 ring-amber-300'
                            : 'bg-emerald-950'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Big Display */}
              <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#12362b"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={
                      2 * Math.PI * 52 * (1 - (saiFinished ? 7 : saiTrip) / 7)
                    }
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {saiFinished ? (
                    <div className="space-y-1">
                      <span className="text-4xl">🎉</span>
                      <p className="text-base font-black text-emerald-300">
                        Sa'i Selesai!
                      </p>
                      <p className="text-[10px] text-emerald-200">
                        Tiba di Bukit Marwah
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                        Perjalanan Ke
                      </span>
                      <p className="text-5xl font-black text-white tracking-tighter">
                        {saiTrip}
                      </p>
                      <p className="text-xs text-amber-300 font-bold">
                        {saiTrip % 2 === 1
                          ? 'Shafa ➔ Marwah'
                          : 'Marwah ➔ Shafa'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sunnah Advice for Sa'i */}
              {!saiFinished ? (
                <div className="p-3.5 rounded-2xl bg-[#12362b] border border-emerald-700/60 text-xs text-left space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      Lampu Hijau (Milain Akhdharain)
                    </span>
                    <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded text-amber-200">
                      Sunnah Pria Lari-lari Kecil
                    </span>
                  </div>
                  <p className="text-emerald-100 text-[11px] leading-relaxed">
                    Saat berada di bawah lampu pilar hijau, disunnahkan bagi pria berlari-lari kecil seraya berdoa:{' '}
                    <em>"Rabbighfir warham wa'fu wa takarram..."</em>
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-400/20 border border-amber-400/50 text-xs text-left space-y-2">
                  <p className="font-extrabold text-amber-300 text-sm">
                    Alhamdulillah! Rukun Sa'i telah sempurna.
                  </p>
                  <p className="text-emerald-100 text-xs leading-relaxed">
                    Tinggal satu langkah terakhir untuk menyempurnakan Umroh Anda:
                    <strong> Tahallul (Mencukur / memotong rambut)</strong>. Setelah tahallul, Anda halal dari seluruh larangan ihram.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleResetSai}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi (Reset)</span>
                </button>

                {!saiFinished ? (
                  <button
                    onClick={handleNextSai}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Tiba di Bukit Berikutnya</span>
                    <ChevronRight className="w-5 h-5 stroke-[3]" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveSubTab('manasik')}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Lihat Panduan Tahallul &rarr;</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-TAB: KUMPULAN DOA-DOA UMROH LENGKAP */}
      {/* ========================================================================= */}
      {activeSubTab === 'doa' && (
        <div className="space-y-6">
          {/* Search & Filter Header */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="text"
                value={doaSearch}
                onChange={(e) => setDoaSearch(e.target.value)}
                placeholder="Cari doa umroh, talbiyah, shafa, thawaf..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0e2a22] border border-emerald-800/80 text-white placeholder-emerald-400/50 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Category Select Filter */}
            <select
              value={doaCategory}
              onChange={(e) => setDoaCategory(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl bg-[#0e2a22] border border-emerald-800/80 text-emerald-100 text-xs font-semibold focus:outline-none focus:border-amber-400"
            >
              <option value="all">Semua Kategori Doa ({UMRAH_DOAS.length})</option>
              <option value="ihram">Niat & Ihram</option>
              <option value="talbiyah">Talbiyah & Shalawat</option>
              <option value="masjidil_haram">Masuk Makkah & Masjid</option>
              <option value="kabah">Melihat Ka'bah</option>
              <option value="tawaf">Thawaf & Hajar Aswad</option>
              <option value="maqam_ibrahim">Maqam Ibrahim</option>
              <option value="zamzam">Air Zam-Zam</option>
              <option value="sai">Sa'i Shafa-Marwah</option>
              <option value="tahallul">Tahallul</option>
              <option value="ziarah">Ziarah Raudhah & Madinah</option>
            </select>
          </div>

          {/* Doa Cards List */}
          <div className="space-y-4">
            {filteredDoas.length === 0 ? (
              <div className="text-center py-12 text-emerald-400/70 text-sm">
                Tidak ada doa yang cocok dengan pencarian "{doaSearch}".
              </div>
            ) : (
              filteredDoas.map((doa) => (
                <div
                  key={doa.id}
                  className="rounded-3xl bg-[#0e2a22] border border-emerald-800/80 p-5 sm:p-6 text-white shadow-lg space-y-4 hover:border-amber-400/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/60 pb-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        {doa.title}
                      </h3>
                      <p className="text-xs text-amber-300 font-medium">
                        {doa.occasion}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handlePlayVoice(doa.arabic)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-200 text-xs font-semibold transition-colors"
                        title="Dengarkan Suara"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dengarkan</span>
                      </button>

                      <button
                        onClick={() =>
                          handleCopyText(
                            `${doa.title}\n\n${doa.arabic}\n\n${doa.latin}\n\nArtinya: "${doa.translation}"\n(Sumber: ${doa.source})`,
                            doa.id
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-200 text-xs font-semibold transition-colors"
                        title="Salin Doa"
                      >
                        {copiedId === doa.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <p className="font-arabic text-2xl sm:text-3xl text-right text-emerald-50 leading-loose py-2">
                    {doa.arabic}
                  </p>

                  {/* Latin */}
                  <p className="text-xs sm:text-sm text-amber-200/90 italic font-medium leading-relaxed">
                    {doa.latin}
                  </p>

                  {/* Translation */}
                  <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed border-t border-emerald-900/50 pt-3">
                    <strong className="text-white">Artinya: </strong>
                    "{doa.translation}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-emerald-400/70 pt-1">
                    <span>Sumber: {doa.source}</span>
                    {doa.tips && (
                      <span className="text-amber-300 font-medium">
                        💡 {doa.tips}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUB-TAB: TITIK & PETA MIQAT */}
      {/* ========================================================================= */}
      {activeSubTab === 'miqat' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#102d24] border border-amber-400/30 text-xs sm:text-sm text-emerald-100 space-y-2">
            <h3 className="font-extrabold text-amber-300 text-sm sm:text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Memahami Titik Miqat Makani</span>
            </h3>
            <p className="leading-relaxed">
              Miqat makani adalah batas geografis yang telah ditentukan oleh syariat di mana setiap orang yang hendak berhaji atau berumroh wajib berihram dan berniat sebelum melintasinya. Jika seseorang melewati batas ini tanpa berniat ihram, ia wajib kembali ke miqat atau membayar dam seekor kambing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MIQAT_STATIONS.map((station) => (
              <div
                key={station.id}
                className="rounded-3xl bg-[#0e2a22] border border-emerald-800/80 p-5 text-white shadow-lg space-y-3 relative overflow-hidden group hover:border-amber-400/50 transition-all"
              >
                {station.isIndonesiaCommon && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-black uppercase">
                      Jalur Jamaah RI
                    </span>
                  </div>
                )}

                <div className="space-y-0.5 pr-20">
                  <h4 className="text-base font-black text-white">
                    {station.name}
                  </h4>
                  <p className="font-arabic text-sm text-amber-300">
                    {station.arabicName}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-emerald-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    {station.direction}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    ±{station.distanceKm} km dari Makkah
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#143d31] text-xs text-emerald-100 space-y-1">
                  <p className="font-bold text-amber-300">Diperuntukkan Bagi:</p>
                  <p className="leading-relaxed">{station.usedBy}</p>
                </div>

                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  {station.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SUB-TAB: LARANGAN IHRAM & DAM (DENDA) */}
      {/* ========================================================================= */}
      {activeSubTab === 'larangan' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#102d24] border border-red-500/30 text-xs sm:text-sm text-emerald-100 space-y-2">
            <h3 className="font-extrabold text-red-300 text-sm sm:text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Larangan Selama Berihram & Konsekuensi Dam</span>
            </h3>
            <p className="leading-relaxed">
              Setelah berniat ihram di Miqat, seluruh larangan ihram mulai berlaku seketika hingga jamaah menyelesaikan rukun Tahallul. Mematuhi larangan ini adalah bukti ketundukan dan kesabaran seorang hamba.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {IHRAM_PROHIBITIONS.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-[#0e2a22] border border-emerald-800/80 p-5 text-white shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-black text-white leading-snug">
                    {item.title}
                  </h4>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      item.category === 'pria'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : item.category === 'wanita'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.category === 'pria'
                      ? 'Khusus Pria'
                      : item.category === 'wanita'
                      ? 'Khusus Wanita'
                      : 'Semua Jamaah'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200">
                  <span className="font-bold text-red-300">Denda / Dam: </span>
                  {item.penalty}
                </div>

                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SUB-TAB: CHECKLIST PERSIAPAN JAMAAH */}
      {/* ========================================================================= */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-6">
          {/* Progress Header Card */}
          <div className="rounded-3xl bg-[#0e2a22] border border-emerald-800/80 p-5 sm:p-6 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-white">
                  Checklist Kebutuhan & Perlengkapan Umroh
                </h3>
                <p className="text-xs text-emerald-200/80">
                  Centang perlengkapan yang sudah disiapkan. Tersimpan otomatis di perangkat Anda.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetChecklist}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-200 text-xs font-semibold transition-colors"
                >
                  Reset Checklist
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-300">
                  Kemajuan Persiapan: {checklistStats.completed} dari {checklistStats.total} Barang
                </span>
                <span className="text-white">{checklistStats.percentage}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-emerald-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${checklistStats.percentage}%` }}
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-emerald-900/60">
              {['all', 'dokumen', 'pakaian', 'kesehatan', 'ibadah', 'perlengkapan'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setChecklistCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-all ${
                      checklistCategory === cat
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white/5 text-emerald-200 hover:bg-white/10'
                    }`}
                  >
                    {cat === 'all' ? 'Semua Kategori' : cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {UMRAH_CHECKLIST_DEFAULT.filter(
              (item) =>
                checklistCategory === 'all' || item.category === checklistCategory
            ).map((item) => {
              const isChecked = !!checklist[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-[#143d31] border-emerald-500/60 text-emerald-100 opacity-90'
                      : 'bg-[#0e2a22] border-emerald-800/80 text-white hover:border-amber-400/50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          isChecked ? 'line-through text-emerald-300/70' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.essential && (
                        <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded font-black shrink-0">
                          Wajib
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-300/70 leading-relaxed">
                      {item.notes}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SUB-TAB: TIPS TANAH SUCI & ZIARAH */}
      {/* ========================================================================= */}
      {activeSubTab === 'tips' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-[#0e2a22] border border-emerald-800/80 p-5 sm:p-6 text-white shadow-xl space-y-4">
            <h3 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Panduan Praktis Jamaah di Makkah & Madinah</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-emerald-100">
              <div className="p-3.5 rounded-2xl bg-[#143d31] border border-emerald-700/60 space-y-1.5">
                <h4 className="font-extrabold text-white text-sm">
                  1. Masuk Raudhah Masjid Nabawi (Aplikasi Nusuk)
                </h4>
                <p className="text-emerald-200/90 leading-relaxed">
                  Ziarah ke Raudhah asy-Syarifah saat ini wajib melakukan booking melalui aplikasi resmi <strong>Nusuk</strong> (tersedia di Play Store & App Store). Booking jadwal segera setelah visa aktif agar mendapat slot waktu yang tepat. Jamaah pria dan wanita memiliki jadwal terpisah.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#143d31] border border-emerald-700/60 space-y-1.5">
                <h4 className="font-extrabold text-white text-sm">
                  2. Sandal & Alas Kaki di Masjidil Haram
                </h4>
                <p className="text-emerald-200/90 leading-relaxed">
                  Selalu bawa kantong sandal serut pribadi dan bawa sandal masuk ke dalam masjid saat thawaf atau sholat. Jangan meletakkan sandal sembarangan di luar gerbang karena Masjidil Haram memiliki ratusan pintu yang identik dan berisiko kehilangan sandal saat keluar.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#143d31] border border-emerald-700/60 space-y-1.5">
                <h4 className="font-extrabold text-white text-sm">
                  3. Menghadapi Cuaca Ekstrem & Hidrasi Tubuh
                </h4>
                <p className="text-emerald-200/90 leading-relaxed">
                  Iklim gurun Saudi memiliki kelembaban sangat rendah. Minumlah air Zam-Zam sedikit demi sedikit secara sering tanpa menunggu haus. Gunakan lip balm dan petroleum jelly tanpa aroma di bagian paha agar tidak lecet saat berjalan jauh saat thawaf dan sa'i.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#143d31] border border-emerald-700/60 space-y-1.5">
                <h4 className="font-extrabold text-white text-sm">
                  4. Sholat Jenazah di Masjidil Haram & Nabawi
                </h4>
                <p className="text-emerald-200/90 leading-relaxed">
                  Hampir di setiap sholat fardhu di Masjidil Haram dan Masjid Nabawi disusul dengan sholat jenazah. Dengarkan aba-aba imam: <em>"Ash-shalaatu 'alal amwaat yarhamukumullah"</em>. Sholat jenazah dilakukan berdiri tanpa ruku' dan sujud dengan 4 kali takbir.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
