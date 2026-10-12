import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalculationSettings, CalculationMethod, PrayerName } from '../../types/prayer';
import { CALCULATION_METHODS } from '../../utils/prayerTimes';
import { notificationService } from '../../utils/notificationService';
import { X, Sliders, Check, Bell, BellRing, BellOff, Volume2, Info, Smartphone, CloudLightning, Sparkles } from 'lucide-react';
import { PWAInstallButton } from '../PWA/PWAInstallButton';

interface CalculationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CalculationSettings;
  onUpdateSettings: (newSettings: CalculationSettings) => void;
  reminders: Record<PrayerName, boolean>;
  onToggleReminder: (name: PrayerName) => void;
  cityName: string;
}

export const CalculationSettingsModal: React.FC<CalculationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  reminders,
  onToggleReminder,
  cityName,
}) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [testSent, setTestSent] = useState<boolean>(false);

  useEffect(() => {
    if (notificationService.isSupported()) {
      setNotificationPermission(notificationService.getPermission());
    }
  }, [isOpen]);

  const handleRequestPermission = async () => {
    const res = await notificationService.requestPermission();
    setNotificationPermission(res);
  };

  const handleSendTestNotification = () => {
    const success = notificationService.sendTestNotification(cityName);
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 2500);
    }
  };

  const handleMethodChange = (method: CalculationMethod) => {
    const meta = CALCULATION_METHODS[method];
    onUpdateSettings({
      ...settings,
      method,
      fajrAngle: meta.fajrAngle,
      ishaAngle: meta.ishaAngle,
    });
  };

  const handleMadhabChange = (madhab: 'shafi' | 'hanafi') => {
    onUpdateSettings({
      ...settings,
      madhab,
    });
  };

  const handleAdjustmentChange = (
    key: keyof CalculationSettings['adjustments'],
    val: number
  ) => {
    onUpdateSettings({
      ...settings,
      adjustments: {
        ...settings.adjustments,
        [key]: val,
      },
    });
  };

  const prayerNamesList: Array<{ key: PrayerName; label: string }> = [
    { key: 'imsak', label: 'Imsak' },
    { key: 'fajr', label: 'Subuh' },
    { key: 'sunrise', label: 'Syuruq' },
    { key: 'dhuhr', label: 'Dzuhur' },
    { key: 'asr', label: 'Ashar' },
    { key: 'maghrib', label: 'Maghrib' },
    { key: 'isha', label: 'Isya' },
  ];

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
            className="relative bg-[#0c251f] w-full max-w-lg rounded-3xl shadow-2xl border border-emerald-900/80 text-white overflow-hidden flex flex-col max-h-[90vh] z-10"
          >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/60 bg-[#12312b]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">
              Pengaturan Sholat & Notifikasi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#091f1a]">
          {/* Push Notifications Section */}
          <div className="space-y-3 bg-[#103028] p-4 rounded-2xl border border-emerald-800/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <BellRing className="w-4 h-4 text-amber-400" />
                <span>Notifikasi Browser (Push Notification)</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  notificationPermission === 'granted'
                    ? 'bg-amber-400 text-slate-950'
                    : notificationPermission === 'denied'
                    ? 'bg-rose-900 text-rose-200'
                    : 'bg-emerald-900 text-emerald-200'
                }`}
              >
                {notificationPermission === 'granted'
                  ? 'Diizinkan'
                  : notificationPermission === 'denied'
                  ? 'Diblokir'
                  : 'Perlu Izin'}
              </span>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Browser akan memunculkan banner notifikasi dan membunyikan adzan saat waktu sholat yang dicentang tiba.
            </p>

            <div className="flex items-center gap-2 pt-1">
              {notificationPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Izinkan Notifikasi Sekarang
                </button>
              )}

              <button
                type="button"
                onClick={handleSendTestNotification}
                className="px-3 py-1.5 bg-[#173d35] border border-emerald-700/50 hover:bg-[#1d4c42] text-white rounded-xl text-xs font-medium transition-colors"
              >
                {testSent ? '✓ Notifikasi Terkirim' : 'Uji Notifikasi Browser'}
              </button>
            </div>

            {/* Checklist of prayers for notification */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-emerald-300/80 block mb-2">
                Pilih Waktu Sholat yang Diberi Notifikasi:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {prayerNamesList.map((p) => {
                  const isChecked = !!reminders[p.key];
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => onToggleReminder(p.key)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-[#143830] text-emerald-300 border-emerald-800/60 hover:bg-[#19453b]'
                      }`}
                    >
                      <span>{p.label}</span>
                      {isChecked ? (
                        <Bell className="w-3 h-3 fill-current" />
                      ) : (
                        <BellOff className="w-3 h-3 opacity-40" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Method Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider block">
              Metode Perhitungan Astronomis
            </label>
            <div className="space-y-1.5">
              {(Object.keys(CALCULATION_METHODS) as CalculationMethod[]).map((key) => {
                const item = CALCULATION_METHODS[key];
                const isSelected = settings.method === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleMethodChange(key)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400 text-white font-medium ring-1 ring-amber-400/30'
                        : 'bg-[#0f2823] border-emerald-900/60 hover:border-emerald-700 text-emerald-100'
                    }`}
                  >
                    <div>
                      <span className="text-xs sm:text-sm font-semibold block">{item.name}</span>
                      <span className="text-[10px] text-emerald-300/70 block">
                        {item.desc} (Subuh: {item.fajrAngle}°, Isya: {item.ishaAngle}°)
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Asr Juristic Madhab */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider block">
              Penetapan Waktu Ashar (Madzhab)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleMadhabChange('shafi')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  settings.madhab === 'shafi'
                    ? 'bg-amber-400/15 border-amber-400 text-white font-semibold ring-1 ring-amber-400/30'
                    : 'bg-[#0f2823] border-emerald-900/60 text-emerald-100 hover:bg-[#14352e]'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold block">Syafi'i, Maliki, Hanbali</span>
                <span className="text-[10px] text-emerald-300/70 block mt-0.5">
                  Standar (Bayangan 1x objek)
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleMadhabChange('hanafi')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  settings.madhab === 'hanafi'
                    ? 'bg-amber-400/15 border-amber-400 text-white font-semibold ring-1 ring-amber-400/30'
                    : 'bg-[#0f2823] border-emerald-900/60 text-emerald-100 hover:bg-[#14352e]'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold block">Hanafi</span>
                <span className="text-[10px] text-emerald-300/70 block mt-0.5">
                  Bayangan 2x objek
                </span>
              </button>
            </div>
          </div>

          {/* Adjustment Offsets (Ihtiyat) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">
                Koreksi Waktu / Ihtiyat (Menit)
              </label>
              <span className="text-[10px] text-emerald-400/60">
                Standar Kemenag: +2 menit
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center">
              {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((key) => {
                const labelMap = {
                  fajr: 'Subuh',
                  dhuhr: 'Dzuhur',
                  asr: 'Ashar',
                  maghrib: 'Maghrib',
                  isha: 'Isya',
                };

                return (
                  <div key={key} className="bg-[#12312b] p-2 rounded-xl border border-emerald-800/60">
                    <span className="text-[10px] font-medium text-emerald-300 block mb-1">
                      {labelMap[key]}
                    </span>
                    <input
                      type="number"
                      value={settings.adjustments[key]}
                      onChange={(e) =>
                        handleAdjustmentChange(key, parseInt(e.target.value) || 0)
                      }
                      className="w-full text-center text-xs font-bold bg-[#091f1a] text-white border border-emerald-700/60 rounded-md py-1 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* PWA & Service Worker Offline Access Section */}
          <div className="space-y-3 bg-[#103028] p-4 rounded-2xl border border-emerald-800/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <CloudLightning className="w-4 h-4 text-amber-400" />
                <span>Akses Offline & Service Worker</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-900 text-emerald-200">
                Aktif
              </span>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Aplikasi ini dilengkapi <strong>Service Worker</strong> untuk menyimpan jadwal sholat, seluruh 114 daftar surah, ayat Quran yang telah dibuka, serta kumpulan doa dan 99 Asmaul Husna agar selalu dapat diakses tanpa koneksi internet.
            </p>

            <div className="pt-1">
              <PWAInstallButton variant="settings" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-emerald-900/60 bg-[#12312b] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Simpan & Tutup
          </button>
        </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

