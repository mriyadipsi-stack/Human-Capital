import React, { useState } from 'react';
import { X, Calendar, Award, CheckCircle, Wallet, User, Building2, CreditCard, TrendingUp, BarChart2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import { Employee, AttendanceRecord, ActivityType } from '../types';
import { formatRupiah, getMonthlyProgressForEmployee } from '../utils/calculations';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  records: AttendanceRecord[];
  activities: ActivityType[];
  onClose: () => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  records,
  activities,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'history'>('progress');

  if (!employee) return null;

  const empRecords = records.filter((r) => r.employeeId === employee.id && r.status === 'Hadir');
  const totalMoneyEarned = empRecords.reduce((sum, r) => sum + r.totalReward, 0);
  const totalPoints = empRecords.reduce((sum, r) => sum + r.totalScore, 0);

  // Get monthly progress history across all months
  const monthlyProgress = getMonthlyProgressForEmployee(employee, records);
  const totalIncentiveAllMonths = monthlyProgress.reduce((sum, p) => sum + p.grandTotal, 0);
  const avgAttendancePct = Math.round(
    monthlyProgress.reduce((sum, p) => sum + p.attendanceRatePct, 0) / (monthlyProgress.length || 1)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Banner */}
        <div className="bg-emerald-900 text-white p-5 relative border-b border-emerald-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1 rounded-lg transition hover:bg-emerald-800/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={employee.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
              alt={employee.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/60 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{employee.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  employee.gender === 'L' ? 'bg-blue-100 text-blue-900' : 'bg-pink-100 text-pink-900'
                }`}>
                  {employee.gender === 'L' ? 'Pria (L)' : 'Wanita (P)'}
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-mono mt-0.5">{employee.nip}</p>
              <div className="flex items-center gap-2 text-xs text-indigo-200 mt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> {employee.department}
                </span>
                <span>•</span>
                <span>{employee.position}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics across all months */}
          <div className="grid grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-emerald-800/60 text-xs">
            <div className="bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/80">
              <p className="text-[9px] text-emerald-300 uppercase">Total Insentif Akumulasi</p>
              <p className="text-sm font-extrabold text-amber-300 font-mono mt-0.5">
                {formatRupiah(totalIncentiveAllMonths)}
              </p>
            </div>

            <div className="bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/80">
              <p className="text-[9px] text-emerald-300 uppercase">Rata-rata Presensi</p>
              <p className="text-sm font-extrabold text-emerald-200 font-mono mt-0.5">
                {avgAttendancePct}%
              </p>
            </div>

            <div className="bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/80">
              <p className="text-[9px] text-emerald-300 uppercase">Target Kehadiran</p>
              <p className="text-sm font-extrabold text-white font-mono mt-0.5">
                {employee.targetAttendancePct}%
              </p>
            </div>

            <div className="bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/80">
              <p className="text-[9px] text-emerald-300 uppercase">Poin Spiritual</p>
              <p className="text-sm font-extrabold text-indigo-200 font-mono mt-0.5">
                {totalPoints} Pts
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-slate-100 p-2 border-b border-slate-200 text-xs font-semibold px-5">
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'progress'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tracking Progress Bulanan</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Riwayat Presensi Harian ({empRecords.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1">
          {activeTab === 'progress' ? (
            <div className="space-y-4">
              {/* Chart: Progress Insentif & Kehadiran per Bulan */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-emerald-600" />
                      <span>Grafik Perkembangan Insentif & Presensi per Bulan</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">Kinerja amalan spiritual tiap periode bulanan</p>
                  </div>
                </div>

                <div className="h-48 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyProgress} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="monthLabel" tick={{ fontSize: 10 }} />
                      <YAxis
                        yAxisId="left"
                        tickFormatter={(val) => `Rp ${(val / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                      <Tooltip
                        formatter={(val: any, name: any) => {
                          if (name === 'Grand Total Insentif') return [formatRupiah(Number(val)), name];
                          if (name === 'Tingkat Presensi') return [`${val}%`, name];
                          return [val, name];
                        }}
                      />
                      <Bar yAxisId="left" dataKey="grandTotal" name="Grand Total Insentif" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="attendanceRatePct" name="Tingkat Presensi" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Progress Table per Month */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2">
                  Rincian Tracking Progress per Bulan
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Periode Bulan</th>
                        <th className="p-2.5">Hari Hadir</th>
                        <th className="p-2.5">Tingkat Presensi</th>
                        <th className="p-2.5">Insentif Utama</th>
                        <th className="p-2.5">Bonus Target</th>
                        <th className="p-2.5">Grand Total</th>
                        <th className="p-2.5">Status Target</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {monthlyProgress.map((p) => (
                        <tr key={p.period} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{p.monthLabel}</td>
                          <td className="p-2.5 font-mono">{p.daysAttended} / {p.totalWorkingDays} hari</td>
                          <td className="p-2.5 font-bold font-mono text-indigo-700">{p.attendanceRatePct}%</td>
                          <td className="p-2.5 font-mono">{formatRupiah(p.totalIncentive)}</td>
                          <td className="p-2.5 font-mono text-emerald-600">
                            {p.bonusAchieved > 0 ? `+${formatRupiah(p.bonusAchieved)}` : '-'}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-emerald-700">{formatRupiah(p.grandTotal)}</td>
                          <td className="p-2.5">
                            {p.targetAchieved ? (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                                ✓ Target Achieved
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                                Belum Target
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bank Account Info */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-bold text-slate-800 text-xs">Rekening Pencairan Insentif</p>
                    <p className="text-[11px] text-slate-500">{employee.bankName} - <span className="font-mono font-bold text-slate-700">{employee.accountNumber}</span></p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                  Terverifikasi HC
                </span>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" /> Log Catatan Presensi Amalan Harian
              </h4>

              {empRecords.length === 0 ? (
                <p className="text-slate-400 py-4 text-center italic">Belum ada riwayat presensi tercatat.</p>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {empRecords.map((rec) => (
                    <div key={rec.id} className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 transition">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 font-mono text-xs">{rec.date}</span>
                          {rec.isHaid && (
                            <span className="bg-pink-100 text-pink-800 text-[10px] px-2 py-0.5 rounded font-bold border border-pink-200">
                              Masa Haid
                            </span>
                          )}
                        </div>
                        <span className="font-bold font-mono text-indigo-700 text-xs bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          +{formatRupiah(rec.totalReward)}
                        </span>
                      </div>

                      {/* Completed activities list */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {rec.activities.map((actLog) => {
                          const actObj = activities.find((a) => a.id === actLog.activityId);
                          return (
                            <span
                              key={actLog.activityId}
                              className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              {actObj ? actObj.name : actLog.activityId}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

