import React, { useState } from 'react';
import { usePWAInstall } from '../../utils/usePWAInstall';
import { Download, Smartphone, X, Check, Share } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'hero' | 'settings';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA on the home screen, hide the install button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop PWA prompt
  if (isInstallable) {
    if (variant === 'settings') {
      return (
        <button
          onClick={install}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 text-white hover:border-amber-400 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-white">Pasang Aplikasi (PWA)</span>
              <span className="text-[10px] text-emerald-200/80 block">
                Akses cepat dari layar utama & offline tanpa internet
              </span>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-400 text-slate-950 font-bold rounded-full text-xs">
            Pasang
          </span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-full text-xs font-extrabold shadow-sm active:scale-95 transition-all"
        title="Pasang aplikasi ke layar utama untuk akses offline"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (WebKit uses Add to Home Screen)
  if (isIOS) {
    return (
      <>
        {variant === 'settings' ? (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 text-white hover:border-amber-400 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block text-white">Pasang di iPhone / iPad</span>
                <span className="text-[10px] text-emerald-200/80 block">
                  Simpan ke Layar Utama Safari
                </span>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-bold rounded-full text-xs">
              Petunjuk
            </span>
          </button>
        ) : (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14352e] hover:bg-[#1a443a] text-emerald-200 hover:text-white rounded-full text-xs font-semibold border border-emerald-800/60 transition-all"
            title="Petunjuk pasang di iOS Safari"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Install iOS</span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div className="w-full max-w-sm rounded-3xl bg-[#0c251f] border border-emerald-800/80 p-6 shadow-2xl text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-400 text-slate-950">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    Pasang di iPhone / iPad
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-emerald-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-emerald-200/90">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#12312b] border border-emerald-800/50">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p>
                    Ketuk tombol <strong>Bagikan (Share)</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-amber-300" /> di bilah navigasi bawah Safari.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#12312b] border border-emerald-800/50">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <p>
                    Gulir ke bawah menu, lalu pilih opsi <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#12312b] border border-emerald-800/50">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center justify-center shrink-0">
                    3
                  </span>
                  <p>
                    Ketuk <strong>Tambah (Add)</strong> di pojok kanan atas. Ikon Nurul Islam siap digunakan secara offline.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
