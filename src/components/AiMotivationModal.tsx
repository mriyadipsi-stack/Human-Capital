import React, { useState } from 'react';
import { Sparkles, X, Copy, Check, Quote, RefreshCw, Send } from 'lucide-react';

interface AiMotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiMotivationModal: React.FC<AiMotivationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [motivationText, setMotivationText] = useState<string>(
    `"Barangsiapa mengerjakan kebaikan sekecil apa pun, niscaya dia akan melihat balasan kebaikan itu." (QS. Az-Zalzalah: 7)\n\nMasyaAllah, apresiasi setinggi-tingginya untuk seluruh insan PT Keberkahan Tujuan Utama yang senantiasa istiqomah melaksanakan ibadah Shalat Subuh & Isya berjamaah di masjid, membaca Al-Qur'an, serta Dzikir Pagi dan Petang. Semoga keistiqomahan ini mendatangkan limpahan keberkahan dan keberhasilan bagi perusahaan kita. Tetap semangat menggapai ridho-Nya!`
  );

  const handleGenerateNew = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/spiritual-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: 'Keistiqomahan & Keberkahan Rezeki Kerja' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setMotivationText(data.message);
        }
      }
    } catch (e) {
      console.log('Using default local fallback text');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(motivationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-200 flex items-center justify-center border border-amber-300/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif">Pesan Motivasi & Tausiyah Spiritual</h3>
              <p className="text-xs text-amber-100">Generator pesan penguat keistiqomahan untuk grup WA/Slack perusahaan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl relative">
            <Quote className="w-8 h-8 text-amber-300/50 absolute top-3 left-3 -z-0" />
            <p className="relative z-10 text-slate-800 leading-relaxed font-serif whitespace-pre-line text-xs">
              {motivationText}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handleGenerateNew}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-600' : ''}`} />
              <span>{loading ? 'Generasi Pesan...' : 'Buat Pesan Baru'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-sm cursor-pointer text-xs"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Pesan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
