export type UmrahCategory =
  | 'persiapan'
  | 'ihram'
  | 'tawaf'
  | 'sai'
  | 'tahallul'
  | 'ziarah';

export interface UmrahStep {
  id: number;
  stepNumber: number;
  title: string;
  arabicTitle: string;
  category: UmrahCategory;
  isRukun: boolean; // True jika Rukun (wajib dilakukan, tidak sah jika ditinggal), False jika Wajib/Sunnah
  location: string;
  summary: string;
  description: string;
  instructions: string[];
  doaIds: string[];
  tips: string[];
  mistakesToAvoid: string[];
}

export interface UmrahDoa {
  id: string;
  title: string;
  occasion: string;
  arabic: string;
  latin: string;
  translation: string;
  source: string;
  category:
    | 'ihram'
    | 'talbiyah'
    | 'masjidil_haram'
    | 'kabah'
    | 'tawaf'
    | 'maqam_ibrahim'
    | 'zamzam'
    | 'sai'
    | 'tahallul'
    | 'ziarah';
  tips?: string;
}

export interface MiqatStation {
  id: string;
  name: string;
  arabicName: string;
  distanceKm: number;
  direction: string;
  usedBy: string;
  description: string;
  isIndonesiaCommon: boolean; // Bir Ali & Yalamlam / Qarnul Manazil
}

export interface IhramProhibition {
  id: string;
  title: string;
  category: 'semua' | 'pria' | 'wanita';
  penalty: string;
  explanation: string;
}

export interface UmrahChecklistItem {
  id: string;
  title: string;
  category: 'dokumen' | 'pakaian' | 'kesehatan' | 'ibadah' | 'perlengkapan';
  essential: boolean;
  notes: string;
}
