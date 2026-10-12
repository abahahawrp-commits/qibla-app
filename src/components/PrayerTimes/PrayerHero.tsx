import React, { useState } from 'react';
import { NextPrayerInfo, HijriDate, LocationInfo } from '../../types/prayer';
import { MapPin, Volume2, VolumeX, Calendar, Clock, Navigation } from 'lucide-react';
import { soundManager } from '../../utils/audioService';

interface PrayerHeroProps {
  nextPrayer: NextPrayerInfo;
  hijriDate: HijriDate;
  currentDate: Date;
  location: LocationInfo;
  onOpenLocationModal: () => void;
  onDetectLocation: () => void;
  isDetectingLocation: boolean;
}

export const PrayerHero: React.FC<PrayerHeroProps> = ({
  nextPrayer,
  hijriDate,
  currentDate,
  location,
  onOpenLocationModal,
  onDetectLocation,
  isDetectingLocation,
}) => {
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);

  const formattedDateGregorian = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  const currentTimeFormatted = currentDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl shadow-emerald-950/20 border border-emerald-800/40">
      {/* Decorative Islamic geometric background watermark */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="islamic-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 20 10 L 10 20 L 0 10 Z M 10 5 L 15 10 L 10 15 L 5 10 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-grid)" />
        </svg>
      </div>

      <div className="relative p-6 sm:p-8 lg:p-10">
        {/* Top strip: Location & Dates */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLocationModal}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition-all text-xs font-medium text-emerald-100 border border-emerald-500/20"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>
                {location.city}, {location.country}
              </span>
              <span className="text-[10px] text-emerald-300 underline underline-offset-2">Ubah</span>
            </button>

            <button
              onClick={onDetectLocation}
              disabled={isDetectingLocation}
              title="Deteksi Lokasi GPS Otomatis"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/15 text-emerald-200 hover:text-white transition-colors border border-emerald-500/20 disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-emerald-200/90 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{hijriDate.formatted}</span>
            </div>
            <span aria-hidden="true" className="text-emerald-500/50">·</span>
            <span>{formattedDateGregorian}</span>
          </div>
        </div>

        {/* Center Main Stage: Current countdown & next prayer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 tracking-wider uppercase">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Menuju Waktu Sholat Berikutnya</span>
            </div>

            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                {nextPrayer.displayName}
              </h1>
              <span className="font-arabic text-3xl sm:text-4xl text-emerald-300/80">
                {nextPrayer.arabicName}
              </span>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                {nextPrayer.time}
              </span>
              <span className="text-sm sm:text-base text-emerald-200/80 font-medium">
                ({nextPrayer.remainingFormatted})
              </span>
            </div>

            {/* Remaining time progress bar */}
            <div className="pt-2 max-w-md">
              <div className="w-full h-1.5 bg-emerald-950/70 rounded-full overflow-hidden border border-emerald-700/30">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${nextPrayer.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Stage: Current Live Clock & Adhan Preview */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-full max-w-xs text-center lg:text-right">
              <span className="text-xs text-emerald-300 font-medium block mb-1">Waktu Saat Ini</span>
              <span className="text-3xl sm:text-4xl font-bold text-white font-mono tracking-wider tabular-nums">
                {currentTimeFormatted}
              </span>
              <span className="text-[11px] text-emerald-200/60 block mt-1">
                Zona: {location.timezone || 'WIB'}
              </span>
            </div>

            <button
              onClick={handleToggleAdhan}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-xs transition-all w-full max-w-xs justify-center ${
                isPlayingAdhan
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30 animate-pulse'
                  : 'bg-emerald-600/60 hover:bg-emerald-600 text-white border border-emerald-400/30'
              }`}
            >
              {isPlayingAdhan ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Hentikan Kumandang Adzan</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Dengarkan Kumandang Adzan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
