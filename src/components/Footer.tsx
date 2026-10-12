import React from 'react';
import { Moon } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onTabChange: (tab: NavTab) => void;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, onOpenSettings }) => {
  return (
    <footer className="mt-12 border-t border-emerald-950/80 bg-[#061612] text-emerald-300/60 text-xs py-8 pb-28 md:pb-10">
      <div className="max-w-xl mx-auto px-4 space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
            <Moon className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-bold text-white text-sm">
            Nurul Islam · Fluttydev
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 font-medium text-emerald-300/80 text-xs">
          <button
            onClick={() => onTabChange('prayer')}
            className="hover:text-amber-400 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => onTabChange('qibla')}
            className="hover:text-amber-400 transition-colors"
          >
            Arah Kiblat
          </button>
          <button
            onClick={() => onTabChange('quran')}
            className="hover:text-amber-400 transition-colors"
          >
            Al-Qur'an
          </button>
          <button
            onClick={() => onTabChange('tasbih')}
            className="hover:text-amber-400 transition-colors"
          >
            Tasbih
          </button>
          <button
            onClick={() => onTabChange('duas')}
            className="hover:text-amber-400 transition-colors"
          >
            Doa & Asmaul
          </button>
          <button
            onClick={() => onTabChange('quiz')}
            className="hover:text-amber-400 transition-colors"
          >
            Kuis Islami
          </button>
          <button
            onClick={() => onTabChange('umrah')}
            className="hover:text-amber-400 transition-colors"
          >
            Panduan Umroh
          </button>
        </div>

        <p className="text-[11px] text-emerald-400/40 pt-2 border-t border-emerald-900/40">
          Minimal Elegant UI Concept · Dibuat dengan cinta untuk umat oleh{' '}
          <strong className="text-emerald-200">Fluttydev</strong>
        </p>
      </div>
    </footer>
  );
};
