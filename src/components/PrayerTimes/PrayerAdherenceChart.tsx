import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Bell,
  BellOff,
  CheckCircle2,
  Circle,
  TrendingUp,
  Award,
  Calendar,
  Share2,
  Info,
  Clock,
  Sparkles,
  BarChart3,
  Flame,
  Check,
  ChevronDown,
} from 'lucide-react';
import { PrayerName } from '../../types/prayer';
import { FardhuPrayer, DailyAdherenceRecord } from '../../types/prayerAdherence';
import {
  prayerAdherenceService,
  FARDHU_PRAYERS,
} from '../../utils/prayerAdherenceService';

interface PrayerAdherenceChartProps {
  reminders: Record<PrayerName, boolean>;
  onToggleReminder: (name: PrayerName) => void;
  cityName: string;
}

type PeriodType = 'weekly' | 'monthly';
type ChartViewType = 'dailyBar' | 'adherenceTrend' | 'radarPrayer' | 'reminderImpact';

export const PrayerAdherenceChart: React.FC<PrayerAdherenceChartProps> = ({
  reminders,
  onToggleReminder,
  cityName,
}) => {
  const [period, setPeriod] = useState<PeriodType>('weekly');
  const [chartView, setChartView] = useState<ChartViewType>('dailyBar');
  const [copied, setCopied] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Compute days count based on period
  const daysCount = period === 'weekly' ? 7 : 30;

  // Retrieve adherence records
  const records: DailyAdherenceRecord[] = useMemo(() => {
    // refreshKey allows re-evaluating when today's prayers are checked
    return prayerAdherenceService.getAdherenceHistory(daysCount, reminders);
  }, [daysCount, reminders, refreshKey]);

  // Compute overall summary
  const summary = useMemo(() => {
    return prayerAdherenceService.calculateSummary(records, reminders, period);
  }, [records, reminders, period]);

  // Compute metrics per prayer
  const metrics = useMemo(() => {
    return prayerAdherenceService.getPrayerStatMetrics(records, reminders);
  }, [records, reminders]);

  // Today's record for interactive quick log
  const todayRecord = records[records.length - 1];

  const handleToggleTodayPrayer = (prayer: FardhuPrayer) => {
    if (!todayRecord) return;
    const currentState = todayRecord.prayers[prayer].completed;
    prayerAdherenceService.saveDayPrayerCheck(
      todayRecord.date,
      prayer,
      !currentState
    );
    setRefreshKey((prev) => prev + 1);
  };

  const handleCopyReport = async () => {
    const text = prayerAdherenceService.generateTextReport(
      summary,
      metrics,
      cityName
    );
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Ignored
    }
  };

  // Recharts Data Transformation: Daily stacked/grouped bars
  const barChartData = useMemo(() => {
    return records.map((rec) => {
      // Extract formatted day or date
      const dateParts = rec.date.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}`;
      const label = period === 'weekly' ? rec.dayLabel : formattedDate;

      return {
        tanggal: label,
        fullName: `${rec.dayLabel}, ${formattedDate}`,
        Subuh: rec.prayers.fajr.completed ? 1 : 0,
        Dzuhur: rec.prayers.dhuhr.completed ? 1 : 0,
        Ashar: rec.prayers.asr.completed ? 1 : 0,
        Maghrib: rec.prayers.maghrib.completed ? 1 : 0,
        Isya: rec.prayers.isha.completed ? 1 : 0,
        Total: rec.totalCompleted,
        Persentase: rec.adherencePercentage,
      };
    });
  }, [records, period]);

  // Recharts Data Transformation: Trend Area
  const trendChartData = useMemo(() => {
    return records.map((rec) => {
      const dateParts = rec.date.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}`;
      const label = period === 'weekly' ? rec.dayLabel : formattedDate;

      return {
        tanggal: label,
        kepatuhan: rec.adherencePercentage,
        target: 100,
        totalSholat: rec.totalCompleted,
      };
    });
  }, [records, period]);

  // Recharts Data Transformation: Radar Chart
  const radarChartData = useMemo(() => {
    return metrics.map((m) => ({
      subject: m.name,
      kepatuhan: m.percentage,
      pengingatAktif: m.reminderActive ? 100 : 40,
      fullMark: 100,
    }));
  }, [metrics]);

  // Recharts Data Transformation: Reminder Impact Comparison
  const reminderImpactData = useMemo(() => {
    return metrics.map((m) => ({
      sholat: m.name,
      denganPengingat: m.withReminderRate,
      tanpaPengingat: m.withoutReminderRate,
      statusPengingat: m.reminderActive ? 'Aktif' : 'Mati',
    }));
  }, [metrics]);

  return (
    <div className="rounded-3xl bg-[#12312b] border border-emerald-900/80 p-4 sm:p-6 text-white shadow-xl relative overflow-hidden space-y-5">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <BarChart3 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Pola & Statistik Kepatuhan Sholat
              </h3>
              <span className="text-[10px] bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 px-2 py-0.5 rounded-full font-bold">
                Recharts
              </span>
            </div>
            <p className="text-xs text-emerald-200/80">
              Analisis kedisiplinan sholat fardhu berdasarkan pengingat adzan
            </p>
          </div>
        </div>

        {/* Period Switcher (Mingguan / Bulanan) */}
        <div className="flex items-center bg-[#0d231e] p-1 rounded-2xl border border-emerald-900/70 self-start sm:self-auto">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              period === 'weekly'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-emerald-300/80 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7 Hari (Mingguan)</span>
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              period === 'monthly'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-emerald-300/80 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>30 Hari (Bulanan)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
        {/* 1. Overall Adherence */}
        <div className="bg-[#0e2722] border border-emerald-900/70 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-300/70 text-xs mb-1">
            <span>Tingkat Kepatuhan</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-amber-300">
              {summary.overallAdherenceRate}%
            </span>
            <span className="text-[10px] text-emerald-200/70">
              ({summary.completedPrayersCount}/{summary.totalPossiblePrayers})
            </span>
          </div>
          <div className="mt-1">
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-full inline-block truncate max-w-full">
              {summary.predicate.title.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* 2. Active Reminders */}
        <div className="bg-[#0e2722] border border-emerald-900/70 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-300/70 text-xs mb-1">
            <span>Pengingat Aktif</span>
            <Bell className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white">
              {summary.activeRemindersCount}
              <span className="text-sm font-semibold text-emerald-400">/5</span>
            </span>
            <span className="text-[10px] text-emerald-200/70">Waktu</span>
          </div>
          <div className="mt-1">
            <span className="text-[10px] font-medium text-amber-300/90 truncate block">
              {summary.activeRemindersCount === 5 ? 'Lengkap Semua Waktu' : 'Tingkatkan Notifikasi'}
            </span>
          </div>
        </div>

        {/* 3. Reminder Boost */}
        <div className="bg-[#0e2722] border border-emerald-900/70 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-300/70 text-xs mb-1">
            <span>Efek Pengingat</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-emerald-300">
              +{summary.reminderBoostPercentage}%
            </span>
          </div>
          <div className="mt-1">
            <span className="text-[10px] text-emerald-200/70 truncate block">
              Kepatuhan saat lonceng aktif
            </span>
          </div>
        </div>

        {/* 4. Consecutive Streak */}
        <div className="bg-[#0e2722] border border-emerald-900/70 rounded-2xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-300/70 text-xs mb-1">
            <span>Runtutan Istiqomah</span>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-amber-400">
              {summary.streakDays}
            </span>
            <span className="text-[10px] text-emerald-200/70">Hari</span>
          </div>
          <div className="mt-1">
            <span className="text-[10px] text-emerald-200/80 truncate block">
              Minimal 4 sholat tertunaikan
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Quick Prayer Check for Today */}
      {todayRecord && (
        <div className="bg-[#0a1e1a] border border-emerald-800/60 rounded-2xl p-3.5 relative z-10 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Catat Sholat Hari Ini (Muhasabah):
              </span>
              <span className="text-[11px] text-emerald-300/80">
                {todayRecord.dayLabel}, {todayRecord.date}
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-300">
              {todayRecord.totalCompleted}/5 Selesai
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {FARDHU_PRAYERS.map(({ key, name }) => {
              const isChecked = todayRecord.prayers[key].completed;
              const hasReminder = !!reminders[key];

              return (
                <div
                  key={key}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center relative select-none ${
                    isChecked
                      ? 'bg-emerald-900/70 border-emerald-500/80 text-white shadow-sm'
                      : 'bg-[#102d26] border-emerald-900/80 hover:border-emerald-700 text-emerald-200/80'
                  }`}
                >
                  <button
                    onClick={() => handleToggleTodayPrayer(key)}
                    className="w-full flex flex-col items-center gap-1"
                    title={`Klik untuk tandai sudah/belum sholat ${name}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${
                        isChecked
                          ? 'bg-emerald-500 text-slate-950 scale-105'
                          : 'border border-emerald-700/80 text-transparent'
                      }`}
                    >
                      {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                    </div>
                    <span className="text-[11px] font-bold tracking-tight">
                      {name}
                    </span>
                  </button>

                  {/* Reminder Bell quick toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleReminder(key);
                    }}
                    title={hasReminder ? `Pengingat ${name} aktif (Klik untuk matikan)` : `Pengingat ${name} mati (Klik untuk aktifkan)`}
                    className={`mt-1 p-1 rounded-md transition-colors ${
                      hasReminder
                        ? 'text-amber-400 hover:text-amber-300'
                        : 'text-emerald-700 hover:text-emerald-500'
                    }`}
                  >
                    {hasReminder ? (
                      <Bell className="w-3 h-3 fill-amber-400" />
                    ) : (
                      <BellOff className="w-3 h-3" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chart Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-emerald-900/60 relative z-10">
        <button
          onClick={() => setChartView('dailyBar')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            chartView === 'dailyBar'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-300/80 hover:text-white bg-[#0f2823] border border-emerald-900/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Grafik Harian</span>
        </button>

        <button
          onClick={() => setChartView('adherenceTrend')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            chartView === 'adherenceTrend'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-300/80 hover:text-white bg-[#0f2823] border border-emerald-900/60'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Tren Kepatuhan (%)</span>
        </button>

        <button
          onClick={() => setChartView('radarPrayer')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            chartView === 'radarPrayer'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-300/80 hover:text-white bg-[#0f2823] border border-emerald-900/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Radar 5 Waktu</span>
        </button>

        <button
          onClick={() => setChartView('reminderImpact')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            chartView === 'reminderImpact'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-300/80 hover:text-white bg-[#0f2823] border border-emerald-900/60'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Pengaruh Pengingat</span>
        </button>
      </div>

      {/* Chart Canvas Area */}
      <div className="bg-[#0a1e19] border border-emerald-900/70 rounded-2xl p-3 sm:p-4 relative z-10">
        {/* Chart View 1: Daily Stacked / Count Bar Chart */}
        {chartView === 'dailyBar' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-200/80 px-1">
              <span>Sholat fardhu tertunaikan per hari (Maks. 5 sholat)</span>
              <span className="text-[11px] text-amber-300 font-medium">
                🎯 Target Harian: 5 Waktu
              </span>
            </div>
            <div className="w-full h-[260px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#163e34" />
                  <XAxis
                    dataKey="tanggal"
                    stroke="#5ea894"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#5ea894"
                    fontSize={11}
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c241e',
                      borderColor: '#10b981',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}
                    formatter={(value: any, name: any) => [
                      value === 1 ? '✓ Tertunaikan' : `${value} Waktu`,
                      name,
                    ]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <Bar dataKey="Subuh" stackId="a" fill="#10b981" />
                  <Bar dataKey="Dzuhur" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="Ashar" stackId="a" fill="#06b6d4" />
                  <Bar dataKey="Maghrib" stackId="a" fill="#f97316" />
                  <Bar dataKey="Isya" stackId="a" fill="#a855f7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart View 2: Trend Area Chart */}
        {chartView === 'adherenceTrend' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-200/80 px-1">
              <span>Tren persentase kepatuhan ({period === 'weekly' ? '7 hari terakhir' : '30 hari terakhir'})</span>
              <span className="text-[11px] text-emerald-400 font-semibold">
                Rata-rata: {summary.overallAdherenceRate}%
              </span>
            </div>
            <div className="w-full h-[260px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendChartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="adherenceColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#163e34" />
                  <XAxis
                    dataKey="tanggal"
                    stroke="#5ea894"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#5ea894"
                    fontSize={11}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    unit="%"
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c241e',
                      borderColor: '#10b981',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#f59e0b' }}
                    formatter={(value: any) => [`${value}% (${Math.round((Number(value) * 5) / 100)} / 5 Sholat)`, 'Kepatuhan']}
                  />
                  <Area
                    type="monotone"
                    dataKey="kepatuhan"
                    name="Tingkat Kepatuhan"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#adherenceColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart View 3: Radar Chart for 5 Prayers */}
        {chartView === 'radarPrayer' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-200/80 px-1">
              <span>Distribusi & konsistensi pada tiap waktu sholat</span>
              <span className="text-[11px] text-amber-300 font-medium">
                Paling Disiplin: {summary.bestPrayer.name} ({summary.bestPrayer.percentage}%)
              </span>
            </div>
            <div className="w-full h-[260px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarChartData} outerRadius="75%">
                  <PolarGrid stroke="#1b493e" />
                  <PolarAngleAxis
                    dataKey="subject"
                    stroke="#8fd1bf"
                    fontSize={12}
                    tick={{ fill: '#e2e8f0', fontWeight: 'bold' }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    stroke="#43776b"
                    fontSize={10}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c241e',
                      borderColor: '#f59e0b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Tingkat Kepatuhan']}
                  />
                  <Radar
                    name="Kepatuhan (%)"
                    dataKey="kepatuhan"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.45}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart View 4: Reminder Impact Comparison */}
        {chartView === 'reminderImpact' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-200/80 px-1">
              <span>Perbandingan kepatuhan: Pengingat Aktif vs Nonaktif</span>
              <span className="text-[11px] text-emerald-400 font-semibold">
                Dampak Notifikasi: +{summary.reminderBoostPercentage}%
              </span>
            </div>
            <div className="w-full h-[260px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reminderImpactData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#163e34" />
                  <XAxis
                    dataKey="sholat"
                    stroke="#5ea894"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#5ea894"
                    fontSize={11}
                    domain={[0, 100]}
                    unit="%"
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c241e',
                      borderColor: '#10b981',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: any) => [
                      `${val}%`,
                      name === 'denganPengingat'
                        ? '🔔 Saat Pengingat Aktif'
                        : '🔕 Saat Pengingat Mati',
                    ]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    formatter={(value) =>
                      value === 'denganPengingat'
                        ? '🔔 Dengan Pengingat'
                        : '🔕 Tanpa Pengingat'
                    }
                  />
                  <Bar
                    dataKey="denganPengingat"
                    name="denganPengingat"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="tanpaPengingat"
                    name="tanpaPengingat"
                    fill="#64748b"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Prayer Adherence Breakdown Cards & Reminder Toggles */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs text-emerald-200/90 font-bold px-1">
          <span>Rincian Tiap Waktu Sholat & Status Pengingat:</span>
          <span className="text-[11px] text-slate-400 font-normal">
            Klik lonceng untuk update alarm
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {metrics.map((m) => {
            const hasReminder = !!reminders[m.prayer];
            return (
              <div
                key={m.prayer}
                className="bg-[#0f2823] border border-emerald-900/60 rounded-2xl p-2.5 flex sm:flex-col justify-between items-center sm:items-stretch gap-2 transition-colors hover:border-emerald-700/80"
              >
                <div className="flex items-center gap-2 sm:justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: m.color }}
                    />
                    <span className="text-xs font-bold text-white">
                      {m.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-arabic text-emerald-300/60 hidden sm:inline">
                    {m.arabic}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 sm:mt-1">
                  <span className="text-lg font-black font-mono text-amber-300">
                    {m.percentage}%
                  </span>
                  <span className="text-[10px] text-emerald-200/60">
                    ({m.completedDays}/{m.totalDays} hari)
                  </span>
                </div>

                {/* Direct Reminder Toggle */}
                <button
                  onClick={() => onToggleReminder(m.prayer)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                    hasReminder
                      ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/60 hover:bg-emerald-800'
                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/50 hover:bg-slate-700'
                  }`}
                >
                  {hasReminder ? (
                    <>
                      <Bell className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>Pengingat Aktif</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="w-2.5 h-2.5 text-slate-400" />
                      <span>Mati (Nyalakan)</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Islamic Muhasabah Recommendation Note & Action Button */}
      <div className="p-3.5 rounded-2xl bg-[#091b17] border border-emerald-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <span>Evaluasi & Muhasabah Diri:</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded font-semibold">
                {summary.predicate.title}
              </span>
            </div>
            <p className="text-emerald-200/80 text-[11px] mt-0.5">
              {summary.predicate.description}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyReport}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" />
              <span className="text-amber-200">Laporan Tersalin!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Salin Ringkasan Laporan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
