import React, { useState, useMemo, useEffect } from 'react';
import { DAILY_DUAS } from '../../data/dailyDuas';
import { ASMAUL_HUSNA } from '../../data/asmaulHusna';
import { DuaItem, AsmaulHusnaItem } from '../../types/dhikr';
import { Search, Heart, Sparkles, Copy, Check, ArrowLeft } from 'lucide-react';

interface DuasAndAsmaulHusnaProps {
  initialSection?: 'duas' | 'asmaulHusna';
  onBack?: () => void;
}

export const DuasAndAsmaulHusna: React.FC<DuasAndAsmaulHusnaProps> = ({
  initialSection = 'duas',
  onBack,
}) => {
  const [activeSection, setActiveSection] = useState<'duas' | 'asmaulHusna'>(initialSection);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Filtered Duas
  const filteredDuas = useMemo(() => {
    return DAILY_DUAS.filter((dua) => {
      const matchSearch =
        dua.titleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.translationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dua.latin.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        selectedCategory === 'all' || dua.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  // Filtered Asmaul Husna
  const filteredAsmaulHusna = useMemo(() => {
    return ASMAUL_HUSNA.filter((item) => {
      return (
        item.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaningId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.arabic.includes(searchQuery) ||
        String(item.number) === searchQuery.trim()
      );
    });
  }, [searchQuery]);

  const handleCopyDua = (dua: DuaItem) => {
    const text = `${dua.titleId}\n\n${dua.arabic}\n\n${dua.latin}\n\nArtinya:\n"${dua.translationId}"\n\n(${dua.source})`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAsma = (asma: AsmaulHusnaItem) => {
    const text = `${asma.number}. ${asma.latin} (${asma.arabic})\nArtinya: ${asma.meaningId}`;
    navigator.clipboard.writeText(text);
    setCopiedId(asma.number);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-12 text-white">
      {/* Top App Bar Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-[#12312b] border border-emerald-800/60 text-emerald-200 hover:text-white transition-colors"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h2 className="text-base font-bold text-white tracking-tight">
            Doa & Asmaul Husna
          </h2>
        </div>

        <span className="text-xs text-emerald-300/80 font-medium font-mono">
          {activeSection === 'duas' ? `${filteredDuas.length} Doa` : '99 Nama Allah'}
        </span>
      </div>

      {/* Top Segmented Switcher & Search Bar */}
      <div className="rounded-3xl bg-[#0c251f] border border-emerald-900/80 p-4 space-y-3 shadow-md">
        {/* Segmented Control matching amber active style */}
        <div className="flex items-center gap-1.5 bg-[#12312b] p-1 rounded-2xl border border-emerald-900/50">
          <button
            onClick={() => {
              setActiveSection('duas');
              setSearchQuery('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSection === 'duas'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Kumpulan Doa</span>
          </button>

          <button
            onClick={() => {
              setActiveSection('asmaulHusna');
              setSearchQuery('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSection === 'asmaulHusna'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>99 Asmaul Husna</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeSection === 'duas'
                ? 'Cari doa (misal: tidur, rezeki, bangun, perlindungan)...'
                : 'Cari Asmaul Husna (misal: Rahman, Malik, Quddus)...'
            }
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#12312b] border border-emerald-800/60 rounded-xl text-white placeholder-emerald-400/50 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* SECTION 1: DUAS */}
      {activeSection === 'duas' && (
        <div className="space-y-3">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'Semua Doa' },
              { id: 'daily', label: 'Aktivitas Harian' },
              { id: 'protection', label: 'Perlindungan' },
              { id: 'forgiveness', label: 'Pengampunan' },
              { id: 'quranic', label: 'Dalam Al-Qur’an' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all text-xs ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-[#0c251f] border border-emerald-900/60 text-emerald-300 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Duas List in Clean White Cards */}
          <div className="space-y-3">
            {filteredDuas.map((dua) => (
              <div
                key={dua.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between space-y-3 text-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                      {dua.titleId}
                    </h3>
                    <button
                      onClick={() => handleCopyDua(dua)}
                      title="Salin Doa"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      {copiedId === dua.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Arabic */}
                  <div className="py-3 text-right">
                    <p
                      className="font-arabic text-xl sm:text-2xl text-emerald-950 font-bold leading-loose text-right"
                      dir="rtl"
                    >
                      {dua.arabic}
                    </p>
                  </div>

                  {/* Latin */}
                  <p className="text-xs text-slate-600 italic font-medium mb-1.5">
                    {dua.latin}
                  </p>

                  {/* Meaning */}
                  <p className="text-xs text-slate-800 leading-relaxed font-normal">
                    "{dua.translationId}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                  {dua.source}
                </div>
              </div>
            ))}

            {filteredDuas.length === 0 && (
              <div className="py-12 text-center text-emerald-300/60 text-xs">
                Tidak ada doa yang sesuai dengan pencarian "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: ASMAUL HUSNA */}
      {activeSection === 'asmaulHusna' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredAsmaulHusna.map((item) => (
              <div
                key={item.number}
                className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-between text-center text-slate-900 relative"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                  <span>#{item.number}</span>
                  <button
                    onClick={() => handleCopyAsma(item)}
                    title="Salin"
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                  >
                    {copiedId === item.number ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <div className="my-1.5">
                  <span className="font-arabic text-2xl font-bold text-emerald-900 block mb-0.5">
                    {item.arabic}
                  </span>
                  <span className="text-xs font-bold text-slate-900 block">
                    {item.latin}
                  </span>
                </div>

                <div className="pt-1.5 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500 block line-clamp-1 font-medium">
                    {item.meaningId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
