import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DHIKR_PRESETS } from '../../data/dailyDuas';
import { DhikrPreset } from '../../types/dhikr';
import { soundManager } from '../../utils/audioService';
import { RotateCcw, Volume2, VolumeX, Smartphone, ArrowLeft, Sparkles, Check } from 'lucide-react';

interface TasbihCounterProps {
  onBack?: () => void;
}

export const TasbihCounter: React.FC<TasbihCounterProps> = ({ onBack }) => {
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrPreset>(DHIKR_PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(100);
  const [setNumber, setSetNumber] = useState<number>(1);
  const [totalCompletedCycles, setTotalCompletedCycles] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(true);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(36);

  // Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds to HH:MM:SS or M:SS
  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return `${h}:${String(remM).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Keyboard spacebar listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleIncrement();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [count, target, soundEnabled, vibrateEnabled, setNumber]);

  const handleIncrement = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    const nextCount = count + 1;

    if (soundEnabled) {
      soundManager.playTasbihClick(1 + (nextCount % 33) * 0.01);
    }
    if (vibrateEnabled) {
      soundManager.triggerVibration(20);
    }

    if (target > 0 && nextCount >= target) {
      setCount(0);
      setSetNumber((prev) => prev + 1);
      const newCycles = totalCompletedCycles + 1;
      setTotalCompletedCycles(newCycles);
      localStorage.setItem('nurul_islam_tasbih_total', String(newCycles));

      if (soundEnabled) soundManager.playSuccessChime();
      if (vibrateEnabled) soundManager.triggerVibration(100);
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
    if (vibrateEnabled) soundManager.triggerVibration(40);
  };

  const formattedDigits = String(count).padStart(3, '0');

  return (
    <div className="max-w-md mx-auto space-y-5 pb-12 text-white">
      {/* Header bar matching screenshot: ← Tasbih Counter */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-[#12312b] border border-emerald-800/60 text-emerald-200 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h2 className="text-base font-bold text-white tracking-tight">
            Tasbih Counter
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full border text-xs transition-colors ${
              soundEnabled
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                : 'bg-[#12312b] text-emerald-300 border-emerald-800/60'
            }`}
            title="Toggle Suara"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setVibrateEnabled(!vibrateEnabled)}
            className={`p-2 rounded-full border text-xs transition-colors ${
              vibrateEnabled
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                : 'bg-[#12312b] text-emerald-300 border-emerald-800/60'
            }`}
            title="Toggle Getar"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Counter Card (matching bottom right mockup in image.png) */}
      <div className="rounded-3xl bg-[#0c251f] border border-emerald-900/80 p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[460px]">
        {/* Top telemetry: Set: 1 & Range: 100 */}
        <div className="w-full flex items-center justify-between text-xs text-emerald-300/70 font-mono font-semibold pb-3 border-b border-emerald-900/50">
          <span>Set: {setNumber}</span>
          <span>Range: {target > 0 ? target : '∞'}</span>
        </div>

        {/* Center: Arabic Calligraphy (e.g. الله أكبر) */}
        <div className="text-center my-4 space-y-1">
          <span className="font-arabic text-4xl sm:text-5xl font-bold text-white drop-shadow-md block leading-tight">
            {selectedDhikr.arabic}
          </span>
          <span className="text-sm font-semibold text-amber-300 block">
            {selectedDhikr.latin}
          </span>
          <span className="text-xs text-emerald-200/60 block max-w-xs mx-auto line-clamp-1">
            "{selectedDhikr.translationId}"
          </span>
        </div>

        {/* Timer display: 0:00:36 */}
        <div className="text-xs text-emerald-300/60 font-mono font-medium tracking-wider">
          {formatTimer(elapsedSeconds)}
        </div>

        {/* Giant Glowing Digital Readout: 038 */}
        <div className="my-3">
          <motion.span
            key={count}
            initial={{ scale: 1.12, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="text-7xl sm:text-8xl font-black text-emerald-400 font-mono tracking-wider tabular-nums drop-shadow-[0_0_20px_rgba(52,211,153,0.3)] select-none inline-block"
          >
            {formattedDigits}
          </motion.span>
        </div>

        {/* Big Tactile Tap Circle Button */}
        <div className="relative my-3">
          {/* Subtle pulsating aura behind button */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-amber-400 blur-xl pointer-events-none"
          />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.91 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={handleIncrement}
            className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-black shadow-xl shadow-amber-500/25 flex flex-col items-center justify-center transition-shadow select-none focus:outline-none cursor-pointer"
          >
            <span className="text-sm uppercase tracking-wider font-extrabold">TEKAN</span>
            <span className="text-[10px] text-slate-800 font-medium">atau Spasi</span>
          </motion.button>
        </div>

        {/* Bottom bar inside card: Reset & Progress */}
        <div className="w-full flex items-center justify-between pt-4 border-t border-emerald-900/50 text-xs">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14352e] hover:bg-[#1a443a] text-emerald-200 hover:text-white transition-colors text-[11px] font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset</span>
          </button>

          <span className="text-[11px] text-emerald-300/80 font-mono">
            Total Selesai: <strong className="text-amber-400">{totalCompletedCycles}x</strong>
          </span>
        </div>
      </div>

      {/* Target Selector & Presets */}
      <div className="rounded-3xl bg-[#0c251f] border border-emerald-900/80 p-5 space-y-4">
        {/* Target Buttons */}
        <div>
          <span className="text-[11px] font-bold text-emerald-300/80 uppercase tracking-wider block mb-2">
            Target Putaran (Range)
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[33, 99, 100, 0].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTarget(t);
                  setCount(0);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all border ${
                  target === t
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-extrabold'
                    : 'bg-[#12312b] text-emerald-100 border-emerald-800/60 hover:bg-[#173d35]'
                }`}
              >
                {t === 0 ? 'Bebas' : `${t}x`}
              </button>
            ))}
          </div>
        </div>

        {/* Dhikr Presets */}
        <div>
          <span className="text-[11px] font-bold text-emerald-300/80 uppercase tracking-wider block mb-2">
            Pilihan Kalimat Dzikir
          </span>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {DHIKR_PRESETS.map((preset) => {
              const isSelected = selectedDhikr.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedDhikr(preset);
                    setTarget(preset.target);
                    setCount(0);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#183d35] border-amber-400 text-white shadow-md'
                      : 'bg-[#0f2823] border-emerald-900/60 text-emerald-100 hover:bg-[#14352e]'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{preset.latin}</span>
                    <span className="text-[10px] text-emerald-300/70 block truncate max-w-[180px]">
                      {preset.translationId}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-arabic text-base font-bold text-amber-300 block">
                      {preset.arabic}
                    </span>
                    <span className="text-[9px] text-emerald-300/60 font-mono">
                      {preset.target}x
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
