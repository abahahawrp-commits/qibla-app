import React from 'react';
import { motion } from 'motion/react';
import { Compass, Moon, BookOpen, Clock, Heart, Sparkles, Settings, Home, Grid, Trophy } from 'lucide-react';
import { PWAInstallButton } from './PWA/PWAInstallButton';

export type NavTab = 'prayer' | 'qibla' | 'quran' | 'tasbih' | 'duas' | 'quiz' | 'umrah';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenSettings: () => void;
  cityName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSettings,
  cityName,
}) => {
  return (
    <>
      {/* Desktop Top Header Bar (hidden on mobile to give authentic mobile app view) */}
      <header className="hidden md:block sticky top-0 z-40 bg-[#081c17]/95 backdrop-blur-md border-b border-emerald-900/40 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-16">
            {/* Zone 1: Brand title */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onTabChange('prayer')}
              className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
                <Moon className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
                  Nurul Islam
                </span>
                <span className="text-[10px] text-emerald-300/70 block -mt-1 font-medium tracking-wider uppercase">
                  by Fluttydev
                </span>
              </div>
            </motion.button>

            {/* Zone 2: 4-5 concise single-line nav links */}
            <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange('prayer')}
                className={`flex items-center gap-1.5 transition-all whitespace-nowrap px-4 py-2 rounded-full cursor-pointer ${
                  activeTab === 'prayer'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-white/5'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange('qibla')}
                className={`flex items-center gap-1.5 transition-all whitespace-nowrap px-4 py-2 rounded-full cursor-pointer ${
                  activeTab === 'qibla'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Qibla Compass</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange('quran')}
                className={`flex items-center gap-1.5 transition-all whitespace-nowrap px-4 py-2 rounded-full cursor-pointer ${
                  activeTab === 'quran'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Al-Qur'an</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange('tasbih')}
                className={`flex items-center gap-1.5 transition-all whitespace-nowrap px-4 py-2 rounded-full cursor-pointer ${
                  activeTab === 'tasbih'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Tasbih</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange('duas')}
                className={`flex items-center gap-1.5 transition-all whitespace-nowrap px-4 py-2 rounded-full cursor-pointer ${
                  activeTab === 'duas'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-white/5'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Doa & Asmaul</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange('quiz')}
                className={`flex items-center gap-1.5 transition-all whitespace-nowrap px-4 py-2 rounded-full cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-white/5'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Kuis Islami</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange('umrah')}
                className={`flex items-center gap-1.5 transition-all whitespace-nowrap px-4 py-2 rounded-full cursor-pointer ${
                  activeTab === 'umrah'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm">🕋</span>
                <span>Panduan Umroh</span>
              </motion.button>
            </nav>

            {/* Zone 3: 1 Primary Action */}
            <div className="flex items-center gap-2.5 shrink-0">
              <PWAInstallButton />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                onClick={onOpenSettings}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-emerald-100 bg-[#12312b] hover:bg-[#183d35] border border-emerald-800/60 rounded-full transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
                title="Pengaturan"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{cityName || 'Pengaturan'}</span>
                <span className="sm:hidden">Opsi</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#091f1a]/95 backdrop-blur-xl border-t border-emerald-900/50 px-3 py-2 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* 1. Home */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange('prayer')}
            className={`flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'prayer'
                ? 'bg-amber-400 text-slate-950 font-extrabold px-4 py-2 rounded-full shadow-lg shadow-amber-400/25 text-xs gap-1.5'
                : 'text-emerald-300/70 hover:text-white flex-col py-1 text-[10px] font-medium'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className={activeTab === 'prayer' ? 'inline' : 'block text-[9px] mt-0.5'}>
              Home
            </span>
          </motion.button>

          {/* 2. Qibla Compass */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange('qibla')}
            className={`flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'qibla'
                ? 'bg-amber-400 text-slate-950 font-extrabold px-4 py-2 rounded-full shadow-lg shadow-amber-400/25 text-xs gap-1.5'
                : 'text-emerald-300/70 hover:text-white flex-col py-1 text-[10px] font-medium'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className={activeTab === 'qibla' ? 'inline' : 'block text-[9px] mt-0.5'}>
              Kiblat
            </span>
          </motion.button>

          {/* 3. Al-Quran */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange('quran')}
            className={`flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'quran'
                ? 'bg-amber-400 text-slate-950 font-extrabold px-4 py-2 rounded-full shadow-lg shadow-amber-400/25 text-xs gap-1.5'
                : 'text-emerald-300/70 hover:text-white flex-col py-1 text-[10px] font-medium'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className={activeTab === 'quran' ? 'inline' : 'block text-[9px] mt-0.5'}>
              Al-Quran
            </span>
          </motion.button>

          {/* 4. Tasbih */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange('tasbih')}
            className={`flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'tasbih'
                ? 'bg-amber-400 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-full shadow-lg shadow-amber-400/25 text-xs gap-1.5'
                : 'text-emerald-300/70 hover:text-white flex-col py-1 text-[10px] font-medium'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className={activeTab === 'tasbih' ? 'inline' : 'block text-[9px] mt-0.5'}>
              Tasbih
            </span>
          </motion.button>

          {/* 5. Kuis Islami */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange('quiz')}
            className={`flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-amber-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-full shadow-lg shadow-amber-400/25 text-xs gap-1'
                : 'text-emerald-300/70 hover:text-white flex-col py-1 text-[10px] font-medium'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className={activeTab === 'quiz' ? 'inline' : 'block text-[9px] mt-0.5'}>
              Kuis
            </span>
          </motion.button>

          {/* 6. Panduan Umroh */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange('umrah')}
            className={`flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'umrah'
                ? 'bg-amber-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-full shadow-lg shadow-amber-400/25 text-xs gap-1'
                : 'text-emerald-300/70 hover:text-white flex-col py-1 text-[10px] font-medium'
            }`}
          >
            <span className="text-sm leading-none">🕋</span>
            <span className={activeTab === 'umrah' ? 'inline' : 'block text-[9px] mt-0.5'}>
              Umroh
            </span>
          </motion.button>

          {/* 7. More / Doa & Menu */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange('duas')}
            className={`flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'duas'
                ? 'bg-amber-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-full shadow-lg shadow-amber-400/25 text-xs gap-1'
                : 'text-emerald-300/70 hover:text-white flex-col py-1 text-[10px] font-medium'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span className={activeTab === 'duas' ? 'inline' : 'block text-[9px] mt-0.5'}>
              Menu
            </span>
          </motion.button>
        </div>
      </div>

    </>
  );
};
