export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameLatin: string;
  nameTranslationId: string;
  nameTranslationEn: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  revelationTypeId: 'Makkiyyah' | 'Madaniyyah';
  audioFull?: string;
}

export interface Ayah {
  number: number; // Verse number in surah
  numberInQuran: number; // Absolute verse number (1 - 6236)
  arab: string; // Arabic text
  latin: string; // Transliteration
  translationId: string; // Indonesian translation
  translationEn: string; // English translation
  audio: {
    [key: string]: string; // reciter audio url
  };
  juz?: number;
  page?: number;
}

export interface SurahDetailData extends SurahMeta {
  tafsirSummary?: string;
  bismillah?: {
    arab: string;
    translationId: string;
    translationEn: string;
  };
  ayahs: Ayah[];
  previousSurah?: { number: number; nameLatin: string } | null;
  nextSurah?: { number: number; nameLatin: string } | null;
}

export interface BookmarkItem {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahTextSnippet: string;
  createdAt: string;
}

export interface LastReadItem {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: string;
}

export type ReciterKey = 'alafasy' | 'sudais' | 'juhany' | 'al-dossari' | 'al-qasim';

export interface Reciter {
  id: ReciterKey;
  name: string;
  style: string;
}
