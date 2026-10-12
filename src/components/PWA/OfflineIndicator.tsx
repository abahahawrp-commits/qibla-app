import React from 'react';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { WifiOff, CloudOff, Check } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-sm mx-auto sm:mx-0 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="bg-[#12312b]/95 backdrop-blur-md border border-amber-400/80 rounded-2xl p-3 shadow-2xl text-white flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold">
          <WifiOff className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-white block">
              Mode Offline Aktif
            </span>
          </div>
          <p className="text-[10px] text-emerald-200/90 leading-tight truncate">
            Jadwal sholat, Quran & Doa tersimpan dapat diakses.
          </p>
        </div>
      </div>
    </div>
  );
};
