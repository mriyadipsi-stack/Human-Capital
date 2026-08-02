import React from 'react';
import {
  Calendar,
  Sparkles,
  FileCode,
  Download,
  PlusCircle,
  UserPlus,
  Settings,
  Grid,
  TrendingUp,
  Users,
  Award,
} from 'lucide-react';

interface HeaderProps {
  currentPeriod: string; // "2026-08"
  onPeriodChange: (period: string) => void;
  activeTab: 'summary' | 'presence' | 'matrix' | 'analytics' | 'guide' | 'settings';
  setActiveTab: (tab: 'summary' | 'presence' | 'matrix' | 'analytics' | 'guide' | 'settings') => void;
  onOpenPresenceModal: () => void;
  onOpenAddEmployeeModal: () => void;
  onOpenAiModal: () => void;
  onExportCsv: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPeriod,
  onPeriodChange,
  activeTab,
  setActiveTab,
  onOpenPresenceModal,
  onOpenAddEmployeeModal,
  onOpenAiModal,
  onExportCsv,
}) => {
  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-xs">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-800">
                  Spiritual Company Monitoring
                </h1>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                  LIVE SYSTEM
                </span>
              </div>
              <p className="text-xs text-indigo-700 font-bold tracking-wide mt-0.5">
                Human Capital PT Keberkahan Tujuan Utama
              </p>
            </div>
          </div>

          {/* Controls: Period Picker & Main Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Period Selector */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500 mr-2" />
              <label htmlFor="period-select" className="text-slate-500 mr-2 font-medium">Periode:</label>
              <select
                id="period-select"
                value={currentPeriod}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="2026-08" className="bg-white text-slate-800">Agustus 2026</option>
                <option value="2026-07" className="bg-white text-slate-800">Juli 2026</option>
                <option value="2026-06" className="bg-white text-slate-800">Juni 2026</option>
                <option value="2026-05" className="bg-white text-slate-800">Mei 2026</option>
              </select>
            </div>

            {/* Input Presensi Button */}
            <button
              id="input-presensi-btn"
              onClick={onOpenPresenceModal}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Presensi</span>
            </button>

            {/* Tambah Karyawan Button */}
            <button
              id="add-employee-btn"
              onClick={onOpenAddEmployeeModal}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Tambah Karyawan</span>
            </button>

            {/* AI Motivation Button */}
            <button
              id="ai-motivation-btn"
              onClick={onOpenAiModal}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">AI Motivasi</span>
            </button>

            {/* Export CSV */}
            <button
              id="export-csv-btn"
              onClick={onExportCsv}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
              title="Export Data ke CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 border-t border-slate-200/80 text-xs no-scrollbar">
          <button
            id="nav-tab-summary"
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Rekap & Insentif Karyawan</span>
          </button>

          <button
            id="nav-tab-matrix"
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Matriks Presensi Harian</span>
          </button>

          <button
            id="nav-tab-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Analitik & Grafik</span>
          </button>

          <button
            id="nav-tab-guide"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-indigo-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Panduan GAS & Looker Studio</span>
          </button>

          <button
            id="nav-tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pengaturan Tarif Amalan</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
