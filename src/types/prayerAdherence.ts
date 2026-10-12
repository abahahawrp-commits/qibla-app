import { PrayerName } from './prayer';

export type FardhuPrayer = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface DailyPrayerCheck {
  completed: boolean; // Sholat ditunaikan
  reminderEnabled: boolean; // Pengingat diaktifkan saat itu
  ontime: boolean; // Dikerjakan tepat waktu
  timestamp?: string; // Jam ditunaikan
}

export interface DailyAdherenceRecord {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Sen, Sel, Rab, dll
  prayers: Record<FardhuPrayer, DailyPrayerCheck>;
  totalCompleted: number; // 0 to 5
  totalTarget: number; // 0 to 5 based on tracked
  adherencePercentage: number; // 0 to 100%
  allFiveCompleted: boolean;
}

export interface PrayerStatMetric {
  prayer: FardhuPrayer;
  name: string;
  arabic: string;
  color: string;
  completedDays: number;
  totalDays: number;
  percentage: number;
  reminderActive: boolean;
  withReminderRate: number; // % completed when reminder was on
  withoutReminderRate: number; // % completed when reminder was off
}

export interface AdherenceSummary {
  period: 'weekly' | 'monthly';
  totalDays: number;
  overallAdherenceRate: number; // 0 to 100%
  completedPrayersCount: number;
  totalPossiblePrayers: number;
  bestPrayer: { name: string; percentage: number };
  worstPrayer: { name: string; percentage: number };
  activeRemindersCount: number; // out of 5
  streakDays: number;
  reminderBoostPercentage: number; // e.g. +32% higher when reminder is active
  predicate: {
    title: string;
    description: string;
    color: string;
  };
}
