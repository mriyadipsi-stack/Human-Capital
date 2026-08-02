import React, { useState } from 'react';
import {
  FileCode,
  ExternalLink,
  Copy,
  Check,
  Layout,
  Table,
  Zap,
  Mail,
  HelpCircle,
  Code2,
  ChevronRight,
  Database,
  Share2,
} from 'lucide-react';
import { generateGasScriptCode } from '../utils/calculations';

export const GasLookerGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'gas' | 'looker' | 'formulas'>('gas');

  const gasCode = generateGasScriptCode();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gasCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const spreadsheetUrl = "https://docs.google.com/spreadsheets/d/1LY8Ypvv2e2z01uPeyX1WOjkzptrUE1KPq7SHa_IO-Y8/edit?gid=1850533427#gid=1850533427";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                Panduan Integrasi Resmi
              </span>
              <span className="text-slate-300 text-xs font-mono">ID Spreadsheet: 1LY8Ypvv...IO-Y8</span>
            </div>
            <h2 className="text-xl font-bold font-serif mt-2">
              Panduan Google Apps Script (GAS) & Google Looker Studio
            </h2>
            <p className="text-xs text-emerald-200 mt-1 max-w-2xl">
              Integrasikan spreadsheet Spiritual Company Anda menjadi sistem otomatis dengan notifikasi email dan dashboard visual interaktif di Looker Studio.
            </p>
          </div>

          <a
            href={spreadsheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md whitespace-nowrap self-start md:self-auto"
          >
            <span>Buka Google Sheet Asli</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 mt-6 border-t border-emerald-800/60 pt-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('gas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'gas'
                ? 'bg-emerald-500 text-emerald-950 font-bold'
                : 'text-emerald-200 hover:bg-emerald-800/50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>1. Google Apps Script (.gs)</span>
          </button>

          <button
            onClick={() => setActiveTab('looker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'looker'
                ? 'bg-emerald-500 text-emerald-950 font-bold'
                : 'text-emerald-200 hover:bg-emerald-800/50'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>2. Google Looker Studio Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'formulas'
                ? 'bg-emerald-500 text-emerald-950 font-bold'
                : 'text-emerald-200 hover:bg-emerald-800/50'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>3. Rumus Formula Sheet</span>
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-6 text-xs text-slate-700">
        {/* TAB 1: GOOGLE APPS SCRIPT */}
        {activeTab === 'gas' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 text-xs">Fungsi Script Otomatisasi (Google Apps Script)</h4>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Script ini akan berjalan di dalam Google Sheets Anda untuk:
                  (1) Menghitung total insentif uang secara otomatis saat presensi di-centang,
                  (2) Menyediakan API JSON endpoint, dan
                  (3) Mengirim rekap insentif bulanan ke email karyawan.
                </p>
              </div>
            </div>

            {/* Step-by-step installation */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <ChevronRight className="w-4 h-4 text-emerald-600" /> Cara Memasang Script di Google Sheets Anda:
              </h3>

              <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-2">
                <li>
                  Buka Google Sheet Anda: <a href={spreadsheetUrl} target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold underline">docs.google.com/spreadsheets/...</a>
                </li>
                <li>Pada menu atas, klik <strong>Ekstensi (Extensions)</strong> &gt; pilih <strong>Apps Script</strong>.</li>
                <li>Hapus semua kode bawaan di editor `Code.gs`.</li>
                <li>Salin (Copy) kode script di bawah ini dan tempelkan (Paste) ke editor Apps Script.</li>
                <li>Klik tombol <strong>Simpan (Save / Icon Disket)</strong>, lalu jalankan fungsi `hitunghInsentifBaris` atau pasang Trigger <code>On Edit</code>.</li>
              </ol>
            </div>

            {/* Code Box */}
            <div className="relative rounded-xl border border-slate-800 bg-slate-950 text-slate-100 overflow-hidden shadow-lg">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" /> Code.gs (SpiritualCompanyAutomation)
                </span>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tersalin!' : 'Salin Kode Script'}</span>
                </button>
              </div>

              <pre className="p-4 text-[11px] font-mono overflow-x-auto text-emerald-300/90 leading-relaxed max-h-96">
                <code>{gasCode}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: GOOGLE LOOKER STUDIO SETUP */}
        {activeTab === 'looker' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Layout className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 text-xs">Menghubungkan Spreadsheet ke Google Looker Studio</h4>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Google Looker Studio (dahulu Data Studio) memungkinkan Anda membuat grafik interaktif, filter tanggal, dan tabel insentif karyawan tanpa coding tambahan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1 */}
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                  1
                </span>
                <h4 className="font-bold text-slate-900 text-xs">Buat Laporan Baru di Looker Studio</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Buka <a href="https://lookerstudio.google.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold">lookerstudio.google.com</a>, lalu klik tombol <strong>"Laporan Kosong" (Blank Report)</strong>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                  2
                </span>
                <h4 className="font-bold text-slate-900 text-xs">Pilih Konektor Google Sheets</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pilih konektor <strong>Google Sheets</strong> &gt; Cari nama file spreadsheet Anda atau masukkan URL spreadsheet <code>https://docs.google.com/...</code>. Pilih Sheet <strong>Presensi_Spiritual</strong>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                  3
                </span>
                <h4 className="font-bold text-slate-900 text-xs">Tambahkan Field Terkalkulasi (Calculated Field)</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Di panel kanan Resource &gt; Add Field:
                  <br />
                  <code>Total Uang Insentif = SUM(Insentif_Rupiah)</code>
                  <br />
                  <code>% Kehadiran = (COUNT(Hadir) / 22) * 100</code>
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                  4
                </span>
                <h4 className="font-bold text-slate-900 text-xs">Tambahkan Elemen Visualisasi</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  • <strong>Kartu Skor (Scorecard)</strong>: Total Uang Insentif & Total Presensi
                  <br />
                  • <strong>Diagram Batang (Bar Chart)</strong>: Insentif Per Departemen
                  <br />
                  • <strong>Kontrol Filter</strong>: Dropdown Nama Karyawan & Rentang Tanggal
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FORMULAS CHEAT SHEET */}
        {activeTab === 'formulas' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Rumus Penting Google Sheets untuk Dashboard</h3>

            <div className="space-y-3">
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 font-mono">
                <p className="text-emerald-800 font-bold text-xs">1. Rumus Insentif Baris (Pria/Wanita Normal: 10rb jika 5 amalan, Wanita Haid: 5rb jika 3 amalan)</p>
                <code className="text-[11px] text-slate-800 block mt-1 bg-white p-2 rounded border border-slate-200">
                  =IF(AND(D2="P", E2="Ya"), IF(AND(H2=TRUE, I2=TRUE, J2=TRUE), 5000, 0), IF(AND(F2=TRUE, G2=TRUE, H2=TRUE, I2=TRUE, J2=TRUE), 10000, 0))
                </code>
                <p className="text-[10px] text-slate-500 font-sans mt-1">
                  Mengecek kelengkapan amalan wajib. Jika ada 1 amalan wajib yang terlewat, insentif otomatis Rp 0 (gugur).
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 font-mono">
                <p className="text-emerald-800 font-bold text-xs">2. Rumus Total Presensi Hadir (COUNTIFS)</p>
                <code className="text-[11px] text-slate-800 block mt-1 bg-white p-2 rounded border border-slate-200">
                  =COUNTIFS(Presensi_Spiritual!B:B, A2, Presensi_Spiritual!I:I, "Hadir")
                </code>
                <p className="text-[10px] text-slate-500 font-sans mt-1">
                  Menghitung berapa hari karyawan dengan NIP A2 berstatus "Hadir".
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 font-mono">
                <p className="text-emerald-800 font-bold text-xs">3. Rumus Bonus Target Kehadiran (IF & Percentage)</p>
                <code className="text-[11px] text-slate-800 block mt-1 bg-white p-2 rounded border border-slate-200">
                  =IF((C2 / 22) &gt;= 0.85, 50000, 0)
                </code>
                <p className="text-[10px] text-slate-500 font-sans mt-1">
                  Memberikan tambahan bonus Rp 50.000 jika persentase kehadiran &gt;= 85%.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
