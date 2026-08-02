import React from 'react';
import { Wallet, Users, CheckCircle2, Trophy, ArrowUpRight } from 'lucide-react';
import { formatRupiah } from '../utils/calculations';
import { Employee, PaymentSummary } from '../types';

interface OverviewCardsProps {
  totalEmployees: number;
  summaries: PaymentSummary[];
  employees: Employee[];
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  totalEmployees,
  summaries,
  employees,
}) => {
  const totalIncentiveRupiah = summaries.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalPresensiCount = summaries.reduce((sum, s) => sum + s.totalDaysAttended, 0);
  
  const avgPresensi = totalEmployees > 0 ? (totalPresensiCount / (totalEmployees * 22)) * 100 : 0;

  // Find top employee
  const topSummary = [...summaries].sort((a, b) => b.grandTotal - a.grandTotal)[0];
  const topEmp = employees.find((e) => e.id === topSummary?.employeeId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Insentif Rupiah */}
      <div id="stat-card-total-insentif" className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Insentif Terkumpul
            </p>
            <h3 className="text-2xl font-extrabold text-indigo-700 mt-1 font-mono">
              {formatRupiah(totalIncentiveRupiah)}
            </h3>
            <div className="flex items-center text-xs text-indigo-600 mt-2 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>Sesuai performa amalan</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600" />
      </div>

      {/* Total Presensi */}
      <div id="stat-card-total-presensi" className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Log Presensi
            </p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
              {totalPresensiCount} <span className="text-sm font-normal text-slate-500">hari</span>
            </h3>
            <div className="flex items-center text-xs text-emerald-600 mt-2 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              <span>Rata-rata {avgPresensi.toFixed(1)}% Kehadiran</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
      </div>

      {/* Total Karyawan */}
      <div id="stat-card-total-karyawan" className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Peserta Karyawan
            </p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
              {totalEmployees} <span className="text-sm font-normal text-slate-500">orang</span>
            </h3>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Tersebar di 5 Departemen
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-400" />
      </div>

      {/* Top Employee */}
      <div id="stat-card-top-employee" className="bg-white rounded-xl p-5 border border-amber-200 shadow-2xs relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> Karyawan Ter-Istiqomah
            </p>
            <h3 className="text-base font-bold text-slate-800 mt-1 truncate max-w-[160px]">
              {topEmp ? topEmp.name : '-'}
            </h3>
            <p className="text-xs text-amber-800 font-bold mt-1 font-mono">
              {topSummary ? formatRupiah(topSummary.grandTotal) : 'Rp 0'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200">
            <Trophy className="w-6 h-6" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
      </div>
    </div>
  );
};
