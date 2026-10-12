import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationInfo } from '../../types/prayer';
import { POPULAR_CITIES } from '../../data/cities';
import { X, Search, MapPin, Navigation, Check } from 'lucide-react';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
  onDetectGPS: () => void;
  isDetecting: boolean;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onDetectGPS,
  isDetecting,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLng, setCustomLng] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const filteredCities = POPULAR_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      onSelectLocation({
        city: customCity || 'Lokasi Kustom',
        country: 'Koordinat Manual',
        latitude: lat,
        longitude: lng,
        timezone: 'Asia/Jakarta',
        isAutoDetected: false,
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative bg-[#0c251f] w-full max-w-lg rounded-3xl shadow-2xl border border-emerald-900/80 text-white overflow-hidden flex flex-col max-h-[85vh] z-10"
          >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/60 bg-[#12312b]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">Pilih Kota & Lokasi</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar & GPS button */}
        <div className="p-4 border-b border-emerald-900/50 space-y-3 bg-[#091f1a]">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kota (misal: Jakarta, Surabaya, Makkah)..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#12312b] border border-emerald-800/60 rounded-xl text-white placeholder-emerald-400/50 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <button
            onClick={() => {
              onDetectGPS();
              onClose();
            }}
            disabled={isDetecting}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-sm"
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>Deteksi Otomatis Lokasi Saya (GPS Saat Ini)</span>
          </button>
        </div>

        {/* City list */}
        <div className="overflow-y-auto flex-1 p-3 divide-y divide-emerald-900/40 bg-[#091f1a]">
          {filteredCities.map((city) => {
            const isSelected =
              Math.abs(city.latitude - currentLocation.latitude) < 0.01 &&
              Math.abs(city.longitude - currentLocation.longitude) < 0.01;

            return (
              <button
                key={`${city.city}-${city.country}`}
                onClick={() => {
                  onSelectLocation(city);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-colors ${
                  isSelected
                    ? 'bg-amber-400/15 text-white font-bold ring-1 ring-amber-400/30'
                    : 'hover:bg-white/5 text-emerald-100'
                }`}
              >
                <div>
                  <span className="text-xs sm:text-sm block font-semibold">{city.city}</span>
                  <span className="text-[10px] text-emerald-400/60 block">
                    {city.country} · {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
              </button>
            );
          })}

          {filteredCities.length === 0 && (
            <div className="py-8 text-center text-emerald-400/50 text-xs">
              Kota tidak ditemukan dalam daftar rekomendasi. Coba masukkan koordinat manual di bawah.
            </div>
          )}
        </div>

        {/* Custom coordinates accordion */}
        <div className="p-4 border-t border-emerald-900/60 bg-[#12312b]">
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
            >
              + Masukkan Koordinat Lintang & Bujur Manual
            </button>
          ) : (
            <form onSubmit={handleApplyCustom} className="space-y-2">
              <span className="text-xs font-semibold text-emerald-200 block">Koordinat Kustom:</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Nama Tempat"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  className="px-2 py-1.5 text-xs bg-[#091f1a] border border-emerald-800/60 text-white rounded-lg focus:outline-none"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  className="px-2 py-1.5 text-xs bg-[#091f1a] border border-emerald-800/60 text-white rounded-lg focus:outline-none"
                  required
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={customLng}
                  onChange={(e) => setCustomLng(e.target.value)}
                  className="px-2 py-1.5 text-xs bg-[#091f1a] border border-emerald-800/60 text-white rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="px-3 py-1 text-xs text-emerald-300 hover:bg-white/10 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
                >
                  Terapkan
                </button>
              </div>
            </form>
          )}
        </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
