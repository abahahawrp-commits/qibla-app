import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationInfo, CalculationSettings } from '../../types/prayer';
import { calculateDayPrayerTimes, getHijriDate } from '../../utils/prayerTimes';
import {
  X,
  Calendar,
  Download,
  CalendarPlus,
  Check,
  Bell,
  Clock,
  Sparkles,
} from 'lucide-react';

interface MonthlyScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationInfo;
  settings: CalculationSettings;
  currentDate: Date;
}

export const MonthlyScheduleModal: React.FC<MonthlyScheduleModalProps> = ({
  isOpen,
  onClose,
  location,
  settings,
  currentDate,
}) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Export ICS Options state
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportSelectedPrayers, setExportSelectedPrayers] = useState<{
    imsak: boolean;
    fajr: boolean;
    sunrise: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  }>({
    imsak: true,
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  });
  const [alarmMinutes, setAlarmMinutes] = useState<number>(10);
  const [isExportingSuccess, setIsExportingSuccess] = useState<boolean>(false);

  const daysInMonth = useMemo(() => {
    const days = [];
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let d = 1; d <= totalDays; d++) {
      const dDate = new Date(currentYear, currentMonth, d);
      const timings = calculateDayPrayerTimes(dDate, location.latitude, location.longitude, settings);
      const hijri = getHijriDate(dDate);
      days.push({
        dayNumber: d,
        date: dDate,
        dayName: new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(dDate),
        hijriStr: `${hijri.day} ${hijri.monthNameId}`,
        timings,
        isToday: d === currentDate.getDate(),
      });
    }
    return days;
  }, [currentYear, currentMonth, location, settings, currentDate]);

  const monthName = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(
    currentDate
  );

  const handlePrintOrDownload = () => {
    window.print();
  };

  // Generate and download RFC 5545 iCalendar (.ics) file
  const handleExportICS = () => {
    const prayerDefinitions: Array<{
      key: keyof typeof exportSelectedPrayers;
      title: string;
      arabic: string;
      durationMinutes: number;
    }> = [
      { key: 'imsak', title: 'Waktu Imsak', arabic: 'الإمساك', durationMinutes: 10 },
      { key: 'fajr', title: 'Sholat Subuh', arabic: 'الفجر', durationMinutes: 25 },
      { key: 'sunrise', title: 'Waktu Syuruq (Terbit)', arabic: 'الشروق', durationMinutes: 15 },
      { key: 'dhuhr', title: 'Sholat Dzuhur', arabic: 'الظهر', durationMinutes: 25 },
      { key: 'asr', title: 'Sholat Ashar', arabic: 'العصر', durationMinutes: 25 },
      { key: 'maghrib', title: 'Sholat Maghrib', arabic: 'المغرب', durationMinutes: 25 },
      { key: 'isha', title: 'Sholat Isya', arabic: 'العشاء', durationMinutes: 25 },
    ];

    const timestampUtc = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');

    let icsEvents = '';

    daysInMonth.forEach((day) => {
      const y = day.date.getFullYear();
      const m = String(day.date.getMonth() + 1).padStart(2, '0');
      const d = String(day.date.getDate()).padStart(2, '0');

      prayerDefinitions.forEach((pDef) => {
        if (!exportSelectedPrayers[pDef.key]) return;

        const timeStr = day.timings[pDef.key]; // e.g. "04:32"
        if (!timeStr) return;

        const [hourStr, minStr] = timeStr.split(':');
        const startHour = Number(hourStr);
        const startMin = Number(minStr);

        // Format DTSTART: YYYYMMDDTHHmm00
        const dtStartStr = `${y}${m}${d}T${String(startHour).padStart(2, '0')}${String(startMin).padStart(2, '0')}00`;

        // Calculate DTEND
        const endDateObj = new Date(y, Number(m) - 1, Number(d), startHour, startMin + pDef.durationMinutes);
        const endY = endDateObj.getFullYear();
        const endM = String(endDateObj.getMonth() + 1).padStart(2, '0');
        const endD = String(endDateObj.getDate()).padStart(2, '0');
        const endHour = String(endDateObj.getHours()).padStart(2, '0');
        const endMin = String(endDateObj.getMinutes()).padStart(2, '0');
        const dtEndStr = `${endY}${endM}${endD}T${endHour}${endMin}00`;

        const uid = `sholat-${y}${m}${d}-${pDef.key}-${location.city.toLowerCase().replace(/\s+/g, '')}@fluttydev.com`;
        const summary = `${pDef.title} (${pDef.arabic}) - ${location.city}`;
        const description = `${pDef.title} untuk wilayah ${location.city}, ${location.country}.\\nWaktu: ${timeStr} (${location.timezone || 'WIB'}).\\nMetode Hisab: ${settings.method}.\\nAplikasi Nurul Islam by Fluttydev.`;

        let alarmBlock = '';
        if (alarmMinutes > 0) {
          alarmBlock = `BEGIN:VALARM\r\nTRIGGER:-PT${alarmMinutes}M\r\nACTION:DISPLAY\r\nDESCRIPTION:Pengingat ${alarmMinutes} menit menuju ${pDef.title}\r\nEND:VALARM\r\n`;
        }

        icsEvents += `BEGIN:VEVENT\r\nUID:${uid}\r\nDTSTAMP:${timestampUtc}\r\nDTSTART:${dtStartStr}\r\nDTEND:${dtEndStr}\r\nSUMMARY:${summary}\r\nDESCRIPTION:${description}\r\nLOCATION:${location.city}, ${location.country}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\n${alarmBlock}END:VEVENT\r\n`;
      });
    });

    const icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Fluttydev//Nurul Islam Jadwal Sholat//ID\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:Jadwal Sholat ${monthName} - ${location.city}\r\nX-WR-TIMEZONE:${location.timezone || 'Asia/Jakarta'}\r\n${icsEvents}END:VCALENDAR\r\n`;

    // Trigger download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeCity = location.city.toLowerCase().replace(/[^a-z0-9]/g, '-');
    link.href = url;
    link.download = `jadwal-sholat-${safeCity}-${monthName.toLowerCase().replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExportingSuccess(true);
    setTimeout(() => {
      setIsExportingSuccess(false);
      setShowExportModal(false);
    }, 1200);
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
            className="relative bg-[#0c251f] w-full max-w-4xl rounded-3xl shadow-2xl border border-emerald-900/80 text-white overflow-hidden flex flex-col max-h-[90vh] z-10"
          >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/60 bg-[#12312b]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Jadwal Sholat Bulanan - {monthName}
              </h3>
              <p className="text-xs text-emerald-200/70">
                {location.city}, {location.country} ({location.latitude.toFixed(3)}°,{' '}
                {location.longitude.toFixed(3)}°)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export ICS Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 rounded-xl hover:bg-amber-300 transition-colors shadow-sm"
              title="Ekspor ke Google Calendar, Apple Calendar, Outlook (.ICS)"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Ekspor Kalender (.ICS)</span>
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={handlePrintOrDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-100 bg-[#173d35] border border-emerald-700/50 rounded-xl hover:bg-[#1d4c42] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Cetak / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-y-auto flex-1 p-6 bg-[#091f1a]">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase tracking-wider text-emerald-300/80 bg-[#10332b] border-y border-emerald-900/60 sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Hijriyah</th>
                <th className="py-2.5 px-3 font-mono">Imsak</th>
                <th className="py-2.5 px-3 font-mono font-bold text-amber-300">Subuh</th>
                <th className="py-2.5 px-3 font-mono">Syuruq</th>
                <th className="py-2.5 px-3 font-mono font-bold text-amber-300">Dzuhur</th>
                <th className="py-2.5 px-3 font-mono font-bold text-amber-300">Ashar</th>
                <th className="py-2.5 px-3 font-mono font-bold text-amber-300">Maghrib</th>
                <th className="py-2.5 px-3 font-mono font-bold text-amber-300">Isya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40 font-mono text-emerald-100">
              {daysInMonth.map((row) => (
                <tr
                  key={row.dayNumber}
                  className={`transition-colors ${
                    row.isToday
                      ? 'bg-amber-400/15 font-bold text-white ring-1 ring-amber-400/30'
                      : 'hover:bg-white/5 text-emerald-200'
                  }`}
                >
                  <td className="py-2 px-3 font-sans">
                    <span className="font-semibold text-white">{row.dayNumber}</span>{' '}
                    <span className="text-emerald-400/60 text-[10px] uppercase font-sans">
                      ({row.dayName})
                    </span>
                    {row.isToday && (
                      <span className="ml-1.5 text-[10px] text-amber-400 font-bold font-sans">
                        · Hari Ini
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 font-sans text-emerald-300/80">
                    {row.hijriStr}
                  </td>
                  <td className="py-2 px-3 text-emerald-300/60">{row.timings.imsak}</td>
                  <td className="py-2 px-3 text-amber-300 font-bold">{row.timings.fajr}</td>
                  <td className="py-2 px-3 text-emerald-400/60">{row.timings.sunrise}</td>
                  <td className="py-2 px-3 text-amber-300 font-bold">{row.timings.dhuhr}</td>
                  <td className="py-2 px-3 text-amber-300 font-bold">{row.timings.asr}</td>
                  <td className="py-2 px-3 text-amber-300 font-bold">{row.timings.maghrib}</td>
                  <td className="py-2 px-3 text-amber-300 font-bold">{row.timings.isha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-emerald-900/60 bg-[#12312b] text-[11px] text-emerald-300/70 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Metode: {settings.method} · Madzhab Ashar: {settings.madhab}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Ekspor Jadwal 1 Bulan ke Kalender (.ICS)</span>
            </button>
            <span aria-hidden="true" className="text-emerald-700">·</span>
            <span>Fluttydev Islamic Companion</span>
          </div>
        </div>

        {/* Sub-Modal / Popover: Export ICS Options */}
        {showExportModal && (
          <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#0c251f] w-full max-w-md rounded-2xl shadow-2xl border border-emerald-800/80 overflow-hidden flex flex-col text-white">
              <div className="px-5 py-4 border-b border-emerald-900/60 bg-[#12312b] flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold">
                    <CalendarPlus className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    Ekspor Jadwal Sholat ke Kalender (.ICS)
                  </h4>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs text-emerald-200/90 bg-[#091f1a]">
                <p className="text-emerald-200/80 leading-relaxed text-xs">
                  File <strong className="text-amber-400">.ICS</strong> (iCalendar) dapat diimpor langsung ke{' '}
                  <strong className="text-white">Google Calendar</strong>, <strong className="text-white">Apple Calendar</strong> (iPhone/iPad/Mac),{' '}
                  <strong className="text-white">Outlook</strong>, dan aplikasi kalender smartphone lainnya.
                </p>

                {/* Pilih Waktu Sholat */}
                <div className="space-y-2">
                  <span className="font-bold text-emerald-300/80 uppercase tracking-wider text-[11px] block">
                    Pilih Waktu Sholat yang Dimasukkan:
                  </span>
                  <div className="grid grid-cols-2 gap-2 bg-[#103028] p-3 rounded-xl border border-emerald-900/60">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-white font-medium">
                      <input
                        type="checkbox"
                        checked={exportSelectedPrayers.fajr}
                        onChange={(e) =>
                          setExportSelectedPrayers({ ...exportSelectedPrayers, fajr: e.target.checked })
                        }
                        className="rounded text-amber-400 focus:ring-amber-400 accent-amber-400 w-4 h-4 cursor-pointer"
                      />
                      <span>Subuh</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none text-white font-medium">
                      <input
                        type="checkbox"
                        checked={exportSelectedPrayers.dhuhr}
                        onChange={(e) =>
                          setExportSelectedPrayers({ ...exportSelectedPrayers, dhuhr: e.target.checked })
                        }
                        className="rounded text-amber-400 focus:ring-amber-400 accent-amber-400 w-4 h-4 cursor-pointer"
                      />
                      <span>Dzuhur</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none text-white font-medium">
                      <input
                        type="checkbox"
                        checked={exportSelectedPrayers.asr}
                        onChange={(e) =>
                          setExportSelectedPrayers({ ...exportSelectedPrayers, asr: e.target.checked })
                        }
                        className="rounded text-amber-400 focus:ring-amber-400 accent-amber-400 w-4 h-4 cursor-pointer"
                      />
                      <span>Ashar</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none text-white font-medium">
                      <input
                        type="checkbox"
                        checked={exportSelectedPrayers.maghrib}
                        onChange={(e) =>
                          setExportSelectedPrayers({ ...exportSelectedPrayers, maghrib: e.target.checked })
                        }
                        className="rounded text-amber-400 focus:ring-amber-400 accent-amber-400 w-4 h-4 cursor-pointer"
                      />
                      <span>Maghrib</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none text-white font-medium">
                      <input
                        type="checkbox"
                        checked={exportSelectedPrayers.isha}
                        onChange={(e) =>
                          setExportSelectedPrayers({ ...exportSelectedPrayers, isha: e.target.checked })
                        }
                        className="rounded text-amber-400 focus:ring-amber-400 accent-amber-400 w-4 h-4 cursor-pointer"
                      />
                      <span>Isya</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none text-emerald-200">
                      <input
                        type="checkbox"
                        checked={exportSelectedPrayers.imsak}
                        onChange={(e) =>
                          setExportSelectedPrayers({ ...exportSelectedPrayers, imsak: e.target.checked })
                        }
                        className="rounded text-amber-400 focus:ring-amber-400 accent-amber-400 w-4 h-4 cursor-pointer"
                      />
                      <span>Waktu Imsak</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none col-span-2 text-emerald-300/80">
                      <input
                        type="checkbox"
                        checked={exportSelectedPrayers.sunrise}
                        onChange={(e) =>
                          setExportSelectedPrayers({ ...exportSelectedPrayers, sunrise: e.target.checked })
                        }
                        className="rounded text-amber-400 focus:ring-amber-400 accent-amber-400 w-4 h-4 cursor-pointer"
                      />
                      <span>Syuruq (Batas Terbit Fajar)</span>
                    </label>
                  </div>
                </div>

                {/* Alarm Reminder */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold text-emerald-300/80 uppercase tracking-wider text-[11px]">
                      Notifikasi Pengingat / Alarm:
                    </span>
                  </div>
                  <select
                    value={alarmMinutes}
                    onChange={(e) => setAlarmMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#12312b] border border-emerald-800/60 rounded-xl text-xs font-medium text-emerald-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value={10}>10 menit sebelum waktu sholat (Disarankan)</option>
                    <option value={15}>15 menit sebelum waktu sholat</option>
                    <option value={5}>5 menit sebelum waktu sholat</option>
                    <option value={0}>Tepat saat waktu adzan (0 menit)</option>
                    <option value={-1}>Tanpa notifikasi / alarm</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3.5 bg-[#12312b] border-t border-emerald-900/60 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:text-white rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExportICS}
                  disabled={isExportingSuccess}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-sm disabled:opacity-75"
                >
                  {isExportingSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Berhasil Diunduh!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh File .ICS Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};


