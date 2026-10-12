/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, NavTab } from './components/Navbar';
import { HomeScreen } from './components/Home/HomeScreen';
import { PrayerHero } from './components/PrayerTimes/PrayerHero';
import { PrayerCards } from './components/PrayerTimes/PrayerCards';
import { MonthlyScheduleModal } from './components/PrayerTimes/MonthlyScheduleModal';
import { LocationSelectorModal } from './components/PrayerTimes/LocationSelectorModal';
import { CalculationSettingsModal } from './components/PrayerTimes/CalculationSettingsModal';
import { QiblaCompass } from './components/Qibla/QiblaCompass';
import { QuranHome } from './components/Quran/QuranHome';
import { SurahDetail } from './components/Quran/SurahDetail';
import { TasbihCounter } from './components/Tasbih/TasbihCounter';
import { DuasAndAsmaulHusna } from './components/Duas/DuasAndAsmaulHusna';
import { IslamicQuiz } from './components/Quiz/IslamicQuiz';
import { UmrahGuide } from './components/Umrah/UmrahGuide';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/PWA/OfflineIndicator';

import {
  LocationInfo,
  CalculationSettings,
  PrayerName,
  PrayerTimeData,
} from './types/prayer';
import { BookmarkItem, LastReadItem } from './types/quran';
import { POPULAR_CITIES } from './data/cities';
import {
  calculateDayPrayerTimes,
  getNextPrayer,
  getHijriDate,
  DEFAULT_SETTINGS,
} from './utils/prayerTimes';
import { notificationService } from './utils/notificationService';
import { soundManager } from './utils/audioService';
import { Calendar, Compass, BookOpen, Clock, Heart, Sparkles, Bell, X, Volume2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('prayer');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  const [initialAyahNumber, setInitialAyahNumber] = useState<number | undefined>(undefined);
  const [duasInitialSection, setDuasInitialSection] = useState<'duas' | 'asmaulHusna'>('duas');

  // Active prayer banner alert state
  const [activePrayerAlert, setActivePrayerAlert] = useState<{
    prayerKey: PrayerName;
    time: string;
    displayName: string;
  } | null>(null);

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState<boolean>(false);

  // Location state (defaults to Jakarta)
  const [location, setLocation] = useState<LocationInfo>(() => {
    const saved = localStorage.getItem('nurul_islam_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return POPULAR_CITIES[0]; // Jakarta
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);

  // Calculation settings state
  const [settings, setSettings] = useState<CalculationSettings>(() => {
    const saved = localStorage.getItem('nurul_islam_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Prayer notification reminders
  const [reminders, setReminders] = useState<Record<PrayerName, boolean>>(() => {
    const saved = localStorage.getItem('nurul_islam_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      imsak: false,
      fajr: true,
      sunrise: false,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true,
    };
  });

  // Quran Bookmarks & Last Read
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const saved = localStorage.getItem('nurul_islam_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [];
  });

  const [lastRead, setLastRead] = useState<LastReadItem | null>(() => {
    const saved = localStorage.getItem('nurul_islam_last_read');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return null;
  });

  // Current real-time clock (updates every 1000ms)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute daily prayer times
  const prayerTimes: PrayerTimeData = useMemo(() => {
    return calculateDayPrayerTimes(
      currentDate,
      location.latitude,
      location.longitude,
      settings
    );
  }, [currentDate, location, settings]);

  // Compute next upcoming prayer & countdown
  const nextPrayer = useMemo(() => {
    return getNextPrayer(prayerTimes, currentDate);
  }, [prayerTimes, currentDate]);

  // Compute hijri date
  const hijriDate = useMemo(() => {
    return getHijriDate(currentDate);
  }, [currentDate]);

  // Monitor prayer times each minute and trigger browser push notification & sound
  useEffect(() => {
    const hoursStr = String(currentDate.getHours()).padStart(2, '0');
    const minsStr = String(currentDate.getMinutes()).padStart(2, '0');
    const currentHHMM = `${hoursStr}:${minsStr}`;

    const prayerList: Array<{ key: PrayerName; displayName: string }> = [
      { key: 'imsak', displayName: 'Imsak' },
      { key: 'fajr', displayName: 'Subuh' },
      { key: 'sunrise', displayName: 'Syuruq' },
      { key: 'dhuhr', displayName: 'Dzuhur' },
      { key: 'asr', displayName: 'Ashar' },
      { key: 'maghrib', displayName: 'Maghrib' },
      { key: 'isha', displayName: 'Isya' },
    ];

    prayerList.forEach((item) => {
      // Check if user enabled reminder for this prayer
      if (reminders[item.key]) {
        const scheduledTime = prayerTimes[item.key];
        if (scheduledTime === currentHHMM) {
          const dateTag = `${currentDate.toDateString()}-${item.key}-${currentHHMM}`;
          if (!notificationService.hasAlreadyNotified(dateTag)) {
            notificationService.markAsNotified(dateTag);
            notificationService.notifyPrayerTime({
              prayerKey: item.key,
              cityName: location.city,
              playAdhanSound: true,
            });
            setActivePrayerAlert({
              prayerKey: item.key,
              time: currentHHMM,
              displayName: item.displayName,
            });
          }
        }
      }
    });
  }, [currentDate, prayerTimes, reminders, location.city]);

  // Save location updates
  const handleUpdateLocation = (newLoc: LocationInfo) => {
    setLocation(newLoc);
    localStorage.setItem('nurul_islam_location', JSON.stringify(newLoc));
  };

  // Save settings updates
  const handleUpdateSettings = (newSettings: CalculationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('nurul_islam_settings', JSON.stringify(newSettings));
  };

  // Toggle prayer reminder
  const handleToggleReminder = (name: PrayerName) => {
    const updated = { ...reminders, [name]: !reminders[name] };
    setReminders(updated);
    localStorage.setItem('nurul_islam_reminders', JSON.stringify(updated));
  };

  // Toggle Quran Bookmark
  const handleToggleBookmark = (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => {
    const exists = bookmarks.find(
      (b) => b.surahNumber === item.surahNumber && b.ayahNumber === item.ayahNumber
    );
    let updated: BookmarkItem[];
    if (exists) {
      updated = bookmarks.filter((b) => b.id !== exists.id);
    } else {
      const newItem: BookmarkItem = {
        ...item,
        id: `${item.surahNumber}-${item.ayahNumber}-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      updated = [newItem, ...bookmarks];
    }
    setBookmarks(updated);
    localStorage.setItem('nurul_islam_bookmarks', JSON.stringify(updated));
  };

  // Save Last Read
  const handleSaveLastRead = (item: LastReadItem) => {
    setLastRead(item);
    localStorage.setItem('nurul_islam_last_read', JSON.stringify(item));
  };

  // Detect GPS Location
  const handleDetectGPS = () => {
    if (!('geolocation' in navigator)) {
      alert('Geolokasi tidak didukung oleh browser Anda.');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // Find closest known city or label as "Lokasi GPS Terdeteksi"
        let closestCity = 'Lokasi Saya (GPS)';
        let minDistance = Infinity;

        POPULAR_CITIES.forEach((c) => {
          const d =
            Math.pow(c.latitude - latitude, 2) + Math.pow(c.longitude - longitude, 2);
          if (d < minDistance) {
            minDistance = d;
            if (d < 0.25) {
              closestCity = c.city;
            }
          }
        });

        const newLoc: LocationInfo = {
          city: closestCity,
          country: 'Otomatis',
          latitude,
          longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta',
          isAutoDetected: true,
        };

        handleUpdateLocation(newLoc);
        setIsDetectingLocation(false);
      },
      () => {
        setIsDetectingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-[#071914] text-slate-100 flex flex-col font-sans-custom relative">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'quran') {
            setSelectedSurahNumber(null);
            setInitialAyahNumber(undefined);
          }
        }}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        cityName={location.city}
      />

      {/* Active Prayer Time Banner Alert */}
      <AnimatePresence>
        {activePrayerAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -16 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white border-b border-emerald-700/50 shadow-md sticky top-16 z-30"
          >
            <div className="px-4 py-3">
              <div className="max-w-md mx-auto flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold animate-bounce">
                    <Bell className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm block">
                      Waktu {activePrayerAlert.displayName} Telah Tiba ({activePrayerAlert.time})
                    </span>
                    <span className="text-[11px] text-emerald-200/80 block">
                      Wilayah {location.city}. Mari bersiap sholat.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => soundManager.playAdhanStream()}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Adzan</span>
                  </button>
                  <button
                    onClick={() => setActivePrayerAlert(null)}
                    className="p-1 rounded-lg text-emerald-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area with Smooth Page Transition */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-3 sm:pt-5 pb-24 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'prayer' && (
              <HomeScreen
                prayerTimes={prayerTimes}
                nextPrayer={nextPrayer}
                hijriDate={hijriDate}
                currentDate={currentDate}
                location={location}
                reminders={reminders}
                onToggleReminder={handleToggleReminder}
                onNavigate={(tab, subSection) => {
                  setActiveTab(tab);
                  if (subSection) {
                    setDuasInitialSection(subSection);
                  }
                  if (tab === 'quran') {
                    setSelectedSurahNumber(null);
                    setInitialAyahNumber(undefined);
                  }
                }}
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
                onOpenMonthlyModal={() => setIsMonthlyModalOpen(true)}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
              />
            )}

            {activeTab === 'qibla' && (
              <QiblaCompass
                location={location}
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
                onBack={() => setActiveTab('prayer')}
              />
            )}

            {activeTab === 'quran' && (
              <div>
                <AnimatePresence mode="wait">
                  {selectedSurahNumber ? (
                    <motion.div
                      key="surah-detail"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <SurahDetail
                        surahNumber={selectedSurahNumber}
                        initialAyahNumber={initialAyahNumber}
                        onBack={() => {
                          setSelectedSurahNumber(null);
                          setInitialAyahNumber(undefined);
                        }}
                        onSelectSurah={(num) => {
                          setSelectedSurahNumber(num);
                          setInitialAyahNumber(undefined);
                        }}
                        bookmarks={bookmarks}
                        onToggleBookmark={handleToggleBookmark}
                        onSaveLastRead={handleSaveLastRead}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="quran-home"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <QuranHome
                        onSelectSurah={(num) => setSelectedSurahNumber(num)}
                        bookmarks={bookmarks}
                        lastRead={lastRead}
                        onSelectBookmark={(surahNum, ayahNum) => {
                          setSelectedSurahNumber(surahNum);
                          setInitialAyahNumber(ayahNum);
                        }}
                        onBack={() => setActiveTab('prayer')}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {activeTab === 'tasbih' && (
              <TasbihCounter onBack={() => setActiveTab('prayer')} />
            )}

            {activeTab === 'duas' && (
              <DuasAndAsmaulHusna
                initialSection={duasInitialSection}
                onBack={() => setActiveTab('prayer')}
              />
            )}

            {activeTab === 'quiz' && (
              <IslamicQuiz onBack={() => setActiveTab('prayer')} />
            )}

            {activeTab === 'umrah' && (
              <UmrahGuide onBack={() => setActiveTab('prayer')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'quran') {
            setSelectedSurahNumber(null);
          }
        }}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={location}
        onSelectLocation={handleUpdateLocation}
        onDetectGPS={handleDetectGPS}
        isDetecting={isDetectingLocation}
      />

      {/* Calculation Settings Modal */}
      <CalculationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        reminders={reminders}
        onToggleReminder={handleToggleReminder}
        cityName={location.city}
      />

      {/* Monthly Timetable Modal */}
      <MonthlyScheduleModal
        isOpen={isMonthlyModalOpen}
        onClose={() => setIsMonthlyModalOpen(false)}
        location={location}
        settings={settings}
        currentDate={currentDate}
      />
    </div>
  );
}

