export interface PrayerTimeData {
  imsak: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  midnight: string;
}

export type PrayerName = 'imsak' | 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface NextPrayerInfo {
  name: PrayerName;
  displayName: string;
  arabicName: string;
  time: string;
  remainingSeconds: number;
  remainingFormatted: string;
  progressPercent: number;
}

export interface LocationInfo {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isAutoDetected: boolean;
}

export type CalculationMethod =
  | 'KEMENAG'
  | 'MWL'
  | 'ISNA'
  | 'EGYPT'
  | 'MAKKAH'
  | 'KARACHI'
  | 'TEHRAN';

export interface CalculationSettings {
  method: CalculationMethod;
  madhab: 'shafi' | 'hanafi'; // Asr shadow multiplier: 1 for Shafi/Hanbali/Maliki, 2 for Hanafi
  fajrAngle: number;
  ishaAngle: number;
  imsakMinutesBeforeFajr: number;
  adjustments: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthNameEn: string;
  monthNameAr: string;
  monthNameId: string;
  formatted: string;
}
