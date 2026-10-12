import {
  PrayerTimeData,
  PrayerName,
  NextPrayerInfo,
  CalculationSettings,
  HijriDate,
  CalculationMethod,
} from '../types/prayer';

// Standard calculation method configurations
export const CALCULATION_METHODS: Record<
  CalculationMethod,
  { name: string; fajrAngle: number; ishaAngle: number; desc: string }
> = {
  KEMENAG: {
    name: 'Kemenag RI (Indonesia)',
    fajrAngle: 20.0,
    ishaAngle: 18.0,
    desc: 'Kementerian Agama Republik Indonesia',
  },
  MWL: {
    name: 'Muslim World League',
    fajrAngle: 18.0,
    ishaAngle: 17.0,
    desc: 'Liga Muslim Dunia (Eropa & Global)',
  },
  MAKKAH: {
    name: 'Umm Al-Qura (Makkah)',
    fajrAngle: 18.5,
    ishaAngle: 19.0, // 90 min interval represented as effective angle
    desc: 'Arab Saudi & Semenanjung Arab',
  },
  EGYPT: {
    name: 'Egyptian General Authority',
    fajrAngle: 19.5,
    ishaAngle: 17.5,
    desc: 'Otoritas Umum Survei Mesir (Afrika & Timur Tengah)',
  },
  ISNA: {
    name: 'ISNA (North America)',
    fajrAngle: 15.0,
    ishaAngle: 15.0,
    desc: 'Islamic Society of North America',
  },
  KARACHI: {
    name: 'Univ. Islamic Sciences (Karachi)',
    fajrAngle: 18.0,
    ishaAngle: 18.0,
    desc: 'Pakistan, India, Bangladesh',
  },
  TEHRAN: {
    name: 'Institute of Geophysics (Tehran)',
    fajrAngle: 17.7,
    ishaAngle: 14.0,
    desc: 'Institut Geofisika Universitas Teheran',
  },
};

export const DEFAULT_SETTINGS: CalculationSettings = {
  method: 'KEMENAG',
  madhab: 'shafi',
  fajrAngle: 20.0,
  ishaAngle: 18.0,
  imsakMinutesBeforeFajr: 10,
  adjustments: {
    fajr: 2, // Kemenag ihtiyat +2 mins
    dhuhr: 2,
    asr: 2,
    maghrib: 2,
    isha: 2,
  },
};

// Trigonometric helpers in degrees
const d2r = (d: number) => (d * Math.PI) / 180.0;
const r2d = (r: number) => (r * 180.0) / Math.PI;
const sinDeg = (d: number) => Math.sin(d2r(d));
const cosDeg = (d: number) => Math.cos(d2r(d));
const tanDeg = (d: number) => Math.tan(d2r(d));
const acosDeg = (x: number) => r2d(Math.acos(Math.max(-1, Math.min(1, x))));
const atan2Deg = (y: number, x: number) => r2d(Math.atan2(y, x));

// Julian Day Calculation
function getJulianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Astronomical Solar Coordinates
function getSunCoordinates(jd: number) {
  const d = jd - 2451545.0; // days since J2000.0
  const g = 357.529 + 0.98560028 * d; // mean anomaly
  const q = 280.459 + 0.98564736 * d; // mean longitude
  const L = q + 1.915 * sinDeg(g) + 0.02 * sinDeg(2 * g); // ecliptic longitude
  const e = 23.439 - 0.00000036 * d; // obliquity of ecliptic

  const RA = atan2Deg(cosDeg(e) * sinDeg(L), cosDeg(L)) / 15.0; // right ascension in hours
  const normalizedRA = (RA + 24) % 24;
  const sinDec = sinDeg(e) * sinDeg(L);
  const dec = r2d(Math.asin(sinDec)); // declination in degrees

  // Equation of Time (EoT in hours)
  const EqT = q / 15.0 - normalizedRA;
  return { dec, EqT };
}

// Compute prayer time in hours (0-24)
export function calculateDayPrayerTimes(
  date: Date,
  latitude: number,
  longitude: number,
  settings: CalculationSettings = DEFAULT_SETTINGS
): PrayerTimeData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Local timezone offset in hours
  const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

  const jd = getJulianDate(year, month, day);
  const { dec, EqT } = getSunCoordinates(jd);

  // Solar noon (Dhuhr) in local hours
  // Midday = 12 + timezone - (longitude / 15) - EqT
  const noon = 12 + timezoneOffsetHours - longitude / 15.0 - EqT;

  // Helper for sun hour angle
  const hourAngle = (angle: number): number => {
    const val = (-sinDeg(angle) - sinDeg(latitude) * sinDeg(dec)) / (cosDeg(latitude) * cosDeg(dec));
    if (val < -1 || val > 1) {
      return 0; // Extreme latitudes
    }
    return acosDeg(val) / 15.0;
  };

  // Asr hour angle based on shadow length multiplier
  const asrMultiplier = settings.madhab === 'hanafi' ? 2 : 1;
  const asrAngle = -r2d(Math.atan(1.0 / (asrMultiplier + tanDeg(Math.abs(latitude - dec)))));
  const asrHA = hourAngle(-asrAngle);

  // Sun angles
  const fajrAngle = settings.fajrAngle || 20.0;
  const ishaAngle = settings.ishaAngle || 18.0;

  const sunriseHA = hourAngle(0.833); // 50 arcminutes for sun disc and refraction
  const fajrHA = hourAngle(fajrAngle);
  const ishaHA = hourAngle(ishaAngle);

  // Raw prayer times in hours
  const rawDhuhr = noon;
  const rawSunrise = noon - sunriseHA;
  const rawSunset = noon + sunriseHA;
  const rawFajr = noon - fajrHA;
  const rawAsr = noon + asrHA;
  const rawMaghrib = rawSunset;
  const rawIsha = noon + ishaHA;

  // Format hour float to HH:MM with adjustments
  const toTimeString = (hourFloat: number, adjustmentMinutes = 0): string => {
    let totalMinutes = Math.round(hourFloat * 60) + adjustmentMinutes;
    while (totalMinutes < 0) totalMinutes += 24 * 60;
    while (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const adj = settings.adjustments;
  const dhuhrStr = toTimeString(rawDhuhr, adj.dhuhr);
  const fajrStr = toTimeString(rawFajr, adj.fajr);
  const sunriseStr = toTimeString(rawSunrise, 0);
  const asrStr = toTimeString(rawAsr, adj.asr);
  const maghribStr = toTimeString(rawMaghrib, adj.maghrib);
  const ishaStr = toTimeString(rawIsha, adj.isha);

  // Imsak is X minutes before Fajr
  const [fajrH, fajrM] = fajrStr.split(':').map(Number);
  let imsakTotalMin = fajrH * 60 + fajrM - settings.imsakMinutesBeforeFajr;
  if (imsakTotalMin < 0) imsakTotalMin += 24 * 60;
  const imsakStr = `${String(Math.floor(imsakTotalMin / 60)).padStart(2, '0')}:${String(
    imsakTotalMin % 60
  ).padStart(2, '0')}`;

  // Midnight is midway between Sunset and Fajr next morning
  const [maghribH, maghribM] = maghribStr.split(':').map(Number);
  let nightMinutes = fajrH * 60 + fajrM + 24 * 60 - (maghribH * 60 + maghribM);
  let midnightTotalMin = (maghribH * 60 + maghribM + Math.round(nightMinutes / 2)) % (24 * 60);
  const midnightStr = `${String(Math.floor(midnightTotalMin / 60)).padStart(2, '0')}:${String(
    midnightTotalMin % 60
  ).padStart(2, '0')}`;

  return {
    imsak: imsakStr,
    fajr: fajrStr,
    sunrise: sunriseStr,
    dhuhr: dhuhrStr,
    asr: asrStr,
    maghrib: maghribStr,
    isha: ishaStr,
    midnight: midnightStr,
  };
}

// Find next prayer and remaining time
export function getNextPrayer(
  prayerTimes: PrayerTimeData,
  currentDate: Date = new Date()
): NextPrayerInfo {
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const currentSeconds = currentMinutes * 60 + currentDate.getSeconds();

  const prayers: { name: PrayerName; displayName: string; arabicName: string; time: string }[] = [
    { name: 'imsak', displayName: 'Imsak', arabicName: 'الإمساك', time: prayerTimes.imsak },
    { name: 'fajr', displayName: 'Subuh', arabicName: 'الفجر', time: prayerTimes.fajr },
    { name: 'sunrise', displayName: 'Syuruq', arabicName: 'الشروق', time: prayerTimes.sunrise },
    { name: 'dhuhr', displayName: 'Dzuhur', arabicName: 'الظهر', time: prayerTimes.dhuhr },
    { name: 'asr', displayName: 'Ashar', arabicName: 'العصر', time: prayerTimes.asr },
    { name: 'maghrib', displayName: 'Maghrib', arabicName: 'المغرب', time: prayerTimes.maghrib },
    { name: 'isha', displayName: 'Isya', arabicName: 'العشاء', time: prayerTimes.isha },
  ];

  // Convert each prayer to seconds from start of day
  const prayerSeconds = prayers.map((p) => {
    const [h, m] = p.time.split(':').map(Number);
    return {
      ...p,
      seconds: h * 3600 + m * 60,
    };
  });

  // Find the next upcoming prayer today
  let next = prayerSeconds.find((p) => p.seconds > currentSeconds);
  let previous = [...prayerSeconds].reverse().find((p) => p.seconds <= currentSeconds);

  let remainingSeconds = 0;
  let totalSpanSeconds = 3600;

  if (next) {
    remainingSeconds = next.seconds - currentSeconds;
    if (previous) {
      totalSpanSeconds = Math.max(60, next.seconds - previous.seconds);
    }
  } else {
    // Next prayer is tomorrow's Imsak/Subuh
    next = prayerSeconds[0]; // Imsak
    const secondsUntilMidnight = 24 * 3600 - currentSeconds;
    remainingSeconds = secondsUntilMidnight + next.seconds;
    const lastPrayer = prayerSeconds[prayerSeconds.length - 1]; // Isha
    totalSpanSeconds = 24 * 3600 - lastPrayer.seconds + next.seconds;
  }

  const elapsedSeconds = totalSpanSeconds - remainingSeconds;
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedSeconds / totalSpanSeconds) * 100)));

  // Format remaining time (HH:MM:SS)
  const remH = Math.floor(remainingSeconds / 3600);
  const remM = Math.floor((remainingSeconds % 3600) / 60);
  const remS = remainingSeconds % 60;

  let remainingFormatted = '';
  if (remH > 0) {
    remainingFormatted = `${remH} jam ${remM} menit lagi`;
  } else if (remM > 0) {
    remainingFormatted = `${remM} menit ${remS} dtk lagi`;
  } else {
    remainingFormatted = `${remS} detik lagi`;
  }

  return {
    name: next.name,
    displayName: next.displayName,
    arabicName: next.arabicName,
    time: next.time,
    remainingSeconds,
    remainingFormatted,
    progressPercent,
  };
}

// Hijri Date Calculation Algorithm (Umm al-Qura / Tabular Islamic Calendar)
export function getHijriDate(date: Date = new Date(), adjustmentDays = 0): HijriDate {
  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() + adjustmentDays);

  const year = adjustedDate.getFullYear();
  const month = adjustedDate.getMonth() + 1;
  const day = adjustedDate.getDate();

  const jd = Math.floor(getJulianDate(year, month, day));
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const lPrime = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - lPrime) / 5316) * Math.floor((50 * lPrime) / 17719) +
    Math.floor(lPrime / 5670) * Math.floor((43 * lPrime) / 15238);
  const lDoublePrime =
    lPrime -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const hMonth = Math.floor((24 * lDoublePrime) / 709);
  const hDay = lDoublePrime - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  const monthNamesId = [
    'Muharram',
    'Safar',
    "Rabi'ul Awwal",
    "Rabi'ul Akhir",
    'Jumadil Awwal',
    'Jumadil Akhir',
    'Rajab',
    "Sya'ban",
    'Ramadhan',
    'Syawwal',
    "Dzulqa'dah",
    'Dzulhijjah',
  ];

  const monthNamesEn = [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Jumada al-Awwal',
    'Jumada al-Thani',
    'Rajab',
    'Shaban',
    'Ramadan',
    'Shawwal',
    'Dhu al-Qadah',
    'Dhu al-Hijjah',
  ];

  const monthNamesAr = [
    'مُحَرَّم',
    'صَفَر',
    'رَبِيع الأَوَّل',
    'رَبِيع الآخِر',
    'جُمَادَى الأُولَى',
    'جُمَادَى الآخِرَة',
    'رَجَب',
    'شَعْبَان',
    'رَمَضَان',
    'شَوَّال',
    'ذُو القَعْدَة',
    'ذُو الحِجَّة',
  ];

  const monthIdx = Math.max(0, Math.min(11, hMonth - 1));

  return {
    day: hDay,
    month: hMonth,
    year: hYear,
    monthNameId: monthNamesId[monthIdx] || 'Muharram',
    monthNameEn: monthNamesEn[monthIdx] || 'Muharram',
    monthNameAr: monthNamesAr[monthIdx] || 'مُحَرَّم',
    formatted: `${hDay} ${monthNamesId[monthIdx]} ${hYear} H`,
  };
}
