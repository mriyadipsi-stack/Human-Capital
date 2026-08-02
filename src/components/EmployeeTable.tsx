import React, { useState } from 'react';
import { Search, Filter, CheckCircle, Clock, ChevronRight, Download, Award, UserCheck, Eye, UserPlus } from 'lucide-react';
import { Employee, PaymentSummary, AttendanceRecord, ActivityType } from '../types';
import { formatRupiah } from '../utils/calculations';

interface EmployeeTableProps {
  employees: Employee[];
  summaries: PaymentSummary[];
  records: AttendanceRecord[];
  activities: ActivityType[];
  onTogglePaymentStatus: (employeeId: string) => void;
  onOpenIndividualDetail: (employee: Employee) => void;
  onOpenAddEmployeeModal?: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  summaries,
  records,
  activities,
  onTogglePaymentStatus,
  onOpenIndividualDetail,
  onOpenAddEmployeeModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/80">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>Rekapitulasi Insentif & Presensi Karyawan</span>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
              {filteredEmployees.length} Orang
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kalkulasi otomatis insentif amalan (L/P Normal: Rp 10.000 | P Haid: Rp 5.000 Al-Qur'an/Dzikir)
          </p>
        </div>

        {/* Rule Info Pill */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-900 px-3 py-1.5 rounded-lg">
          <span className="font-bold text-indigo-700">Aturan Skema Insentif:</span>
          <span>L/P Normal: Selesaikan 5 amalan (Subuh, Isya, Qur'an, Dzikir Pagi & Petang) = Rp 10.000/hari | P Haid: Selesaikan 3 amalan = Rp 5.000/hari (Terlewat 1 = Gugur/Rp 0)</span>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama / NIP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-1.5 px-3 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Departemen</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {onOpenAddEmployeeModal && (
            <button
              onClick={onOpenAddEmployeeModal}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Tambah Karyawan</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Karyawan</th>
              <th className="py-3 px-4">Departemen & Jabatan</th>
              <th className="py-3 px-4 text-center">Kehadiran (Hari)</th>
              <th className="py-3 px-4 text-center">Poin Spiritual</th>
              <th className="py-3 px-4 text-right">Insentif Pokok</th>
              <th className="py-3 px-4 text-right">Bonus Target</th>
              <th className="py-3 px-4 text-right">Total Diterima (Rp)</th>
              <th className="py-3 px-4 text-center">Status Bayar</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-slate-400">
                  Tidak ada data karyawan yang sesuai filter.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => {
                const summary = summaries.find((s) => s.employeeId === emp.id) || {
                  employeeId: emp.id,
                  period: '2026-08',
                  totalDaysAttended: 0,
                  totalActivitiesCount: 0,
                  totalPoin: 0,
                  totalCalculatedReward: 0,
                  bonusTargetAchieved: 0,
                  grandTotal: 0,
                  paymentStatus: 'Approved',
                };

                const isTargetAchieved = summary.bonusTargetAchieved > 0;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                    {/* Karyawan Profile */}
                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                          alt={emp.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-slate-900 font-bold text-xs">{emp.name}</p>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              emp.gender === 'L'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-pink-50 text-pink-700 border border-pink-200'
                            }`}>
                              {emp.gender === 'L' ? 'Pria' : 'Wanita'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">{emp.nip}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department & Position */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{emp.department}</p>
                      <p className="text-[11px] text-slate-500">{emp.position}</p>
                    </td>

                    {/* Total Days */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-slate-800 text-xs">
                        {summary.totalDaysAttended} <span className="text-[10px] font-normal text-slate-400">/ 22 hari</span>
                      </span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 mx-auto mt-1 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (summary.totalDaysAttended / 22) * 100)}%` }}
                        />
                      </div>
                    </td>

                    {/* Poin Spiritual */}
                    <td className="py-3.5 px-4 text-center font-semibold text-indigo-700">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200/60 font-mono font-bold">
                        {summary.totalPoin} Pts
                      </span>
                    </td>

                    {/* Insentif Pokok */}
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700">
                      {formatRupiah(summary.totalCalculatedReward)}
                    </td>

                    {/* Bonus Target */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs">
                      {isTargetAchieved ? (
                        <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          +{formatRupiah(summary.bonusTargetAchieved)}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Grand Total Diterima */}
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-indigo-700 text-sm">
                      {formatRupiah(summary.grandTotal)}
                    </td>

                    {/* Status Bayar */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onTogglePaymentStatus(emp.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition ${
                          summary.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Klik untuk mengubah status pembayaran"
                      >
                        {summary.paymentStatus === 'Paid' ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Sudah Cair</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Detail Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onOpenIndividualDetail(emp)}
                        className="inline-flex items-center gap-1 text-xs text-indigo-700 font-semibold hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200/80 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail Log</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
