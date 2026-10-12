export interface DhikrPreset {
  id: string;
  arabic: string;
  latin: string;
  translationId: string;
  translationEn: string;
  virtue?: string;
  target: number;
}

export interface AsmaulHusnaItem {
  number: number;
  arabic: string;
  latin: string;
  meaningId: string;
  meaningEn: string;
  explanationId?: string;
}

export interface DuaItem {
  id: string;
  category: 'daily' | 'morning_evening' | 'prayer' | 'quranic' | 'protection' | 'forgiveness';
  titleId: string;
  titleEn: string;
  arabic: string;
  latin: string;
  translationId: string;
  translationEn: string;
  source: string;
}
