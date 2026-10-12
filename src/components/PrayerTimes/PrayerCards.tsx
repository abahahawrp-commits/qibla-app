import React, { useState, useEffect } from 'react';
import { PrayerTimeData, PrayerName } from '../../types/prayer';
import { notificationService } from '../../utils/notificationService';
import { Sun, Sunset, Sunrise, Moon, CloudSun, Bell, BellOff, BellRing, Check, Info } from 'lucide-react';

interface PrayerCardsProps {
  prayerTimes: PrayerTimeData;
  activePrayerName: PrayerName;
  reminders: Record<PrayerName, boolean>;
  onToggleReminder: (name: PrayerName) => void;
  cityName: string;
}

interface CardMeta {
  key: PrayerName;
  name: string;
  arabic: string;
  icon: React.ComponentType<{ className?: string }>;
  isMandatory: boolean;
}

const CARDS_CONFIG: CardMeta[] = [
  { key: 'imsak', name: 'Imsak', arabic: 'الإمساك', icon: Moon, isMandatory: false },
  { key: 'fajr', name: 'Subuh', arabic: 'الفجر', icon: Sunrise, isMandatory: true },
  { key: 'sunrise', name: 'Syuruq', arabic: 'الشروq', icon: Sun, isMandatory: false },
  { key: 'dhuhr', name: 'Dzuhur', arabic: 'الظهر', icon: Sun, isMandatory: true },
  { key: 'asr', name: 'Ashar', arabic: 'العصر', icon: CloudSun, isMandatory: true },
  { key: 'maghrib', name: 'Maghrib', arabic: 'المغرب', icon: Sunset, isMandatory: true },
  { key: 'isha', name: 'Isya', arabic: 'العشاء', icon: Moon, isMandatory: true },
];

export const PrayerCards: React.FC<PrayerCardsProps> = ({
  prayerTimes,
  activePrayerName,
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
  }, []);

  const handleRequestPermission = async () => {
    const res = await notificationService.requestPermission();
    setNotificationPermission(res);
  };

  const handleSendTest = () => {
    const success = notificationService.sendTestNotification(cityName);
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 2500);
    }
  };

  const handleCardReminderClick = async (key: PrayerName) => {
    // If not yet granted, prompt user for permission
    if (notificationService.isSupported() && notificationService.getPermission() === 'default') {
      const res = await notificationService.requestPermission();
      setNotificationPermission(res);
    }
    onToggleReminder(key);
  };

  return (
    <div className="space-y-4">
      {/* Title & Notification Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Jadwal Sholat Hari Ini
          </h2>
          <p className="text-xs text-slate-500">
            Aktifkan ikon lonceng pada tiap waktu sholat untuk menerima notifikasi browser
          </p>
        </div>

        {/* Notification Permission Strip */}
        <div className="flex items-center gap-2">
          {notificationPermission === 'granted' ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                <BellRing className="w-3.5 h-3.5 text-emerald-600" />
                <span>Notifikasi Browser Aktif</span>
              </span>
              <button
                onClick={handleSendTest}
                className="text-xs text-slate-600 hover:text-emerald-700 underline underline-offset-2 font-medium"
              >
                {testSent ? 'Terkirim!' : 'Uji Notifikasi'}
              </button>
            </div>
          ) : notificationPermission === 'denied' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Izin Notifikasi Diblokir di Browser</span>
            </div>
          ) : (
            <button
              onClick={handleRequestPermission}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Aktifkan Notifikasi Browser</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of prayer cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {CARDS_CONFIG.map((card) => {
          const time = prayerTimes[card.key];
          const isNext = activePrayerName === card.key;
          const Icon = card.icon;
          const isReminderActive = !!reminders[card.key];

          return (
            <div
              key={card.key}
              className={`relative rounded-2xl p-4 transition-all border flex flex-col justify-between ${
                isNext
                  ? 'bg-gradient-to-b from-emerald-50 to-teal-50/50 border-emerald-400/80 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Header inside card */}
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`p-2 rounded-xl ${
                    isNext
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <button
                  onClick={() => handleCardReminderClick(card.key)}
                  title={isReminderActive ? 'Pengingat Aktif' : 'Nyalakan Pengingat'}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isReminderActive
                      ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isReminderActive ? (
                    <Bell className="w-3.5 h-3.5 fill-emerald-600" />
                  ) : (
                    <BellOff className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Title & Arabic */}
              <div className="space-y-0.5 my-2">
                <div className="flex items-baseline justify-between">
                  <span className={`text-sm font-semibold ${isNext ? 'text-emerald-900' : 'text-slate-800'}`}>
                    {card.name}
                  </span>
                  <span className="font-arabic text-xs text-slate-400">
                    {card.arabic}
                  </span>
                </div>
                {!card.isMandatory && (
                  <span className="text-[10px] text-slate-400 block">
                    {card.key === 'imsak' ? 'Waktu Imsak' : 'Batas Terbit Fajar'}
                  </span>
                )}
              </div>

              {/* Time display */}
              <div className="pt-2 border-t border-slate-100 mt-auto">
                <span
                  className={`text-2xl font-bold font-mono tracking-tight tabular-nums block ${
                    isNext ? 'text-emerald-700' : 'text-slate-900'
                  }`}
                >
                  {time}
                </span>
                {isNext && (
                  <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                    Mendatang
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

