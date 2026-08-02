import React, { useState } from 'react';
import { Check, X, Calendar, Search, Filter, ShieldCheck, UserCheck } from 'lucide-react';
import { Employee, AttendanceRecord } from '../types';
import { formatRupiah } from '../utils/calculations';

interface PresenceGridProps {
  employees: Employee[];
  records: AttendanceRecord[];
  currentPeriod: string; // e.g. "2026-08"
}

export const PresenceGrid: React.FC<PresenceGridProps> = ({
  employees,
  records,
  currentPeriod,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calculate total days in current month (e.g. 31 days for August)
  const daysInMonth = 31; // 1 to 31 for August
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>Matriks Presensi Harian Karyawan</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Periode {currentPeriod}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visualisasi kalender presensi harian per tanggal untuk seluruh anggota tim
          </p>
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari karyawan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[900px]">
          <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 min-w-[180px] bg-slate-100 border-r border-slate-200 sticky left-0 z-20 shadow-xs">
                Karyawan & Dept
              </th>
              {daysArray.map((day) => (
                <th key={day} className="py-2 px-1.5 text-center min-w-[32px] border-r border-slate-200 text-[10px]">
                  {day}
                </th>
              ))}
              <th className="py-3 px-3 text-center min-w-[80px] bg-emerald-50 text-emerald-900 border-l border-emerald-200">
                Total Hadir
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredEmployees.map((emp) => {
              const empRecords = records.filter(
                (r) => r.employeeId === emp.id && r.date.startsWith(currentPeriod)
              );

              let totalHadirCount = 0;

              return (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                  {/* Sticky Employee Name Column */}
                  <td className="py-2.5 px-4 font-semibold bg-white border-r border-slate-200 sticky left-0 z-10 shadow-xs">
                    <p className="text-slate-900 font-bold truncate max-w-[160px]">{emp.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{emp.department}</p>
                  </td>

                  {/* Day Columns */}
                  {daysArray.map((day) => {
                    const dateStr = `${currentPeriod}-${String(day).padStart(2, '0')}`;
                    const rec = empRecords.find((r) => r.date === dateStr);
                    const isPresent = rec && rec.status === 'Hadir';

                    if (isPresent) totalHadirCount++;

                    return (
                      <td
                        key={day}
                        className={`py-2 px-1 text-center border-r border-slate-100 font-mono text-[10px] ${
                          isPresent ? 'bg-emerald-50/60' : ''
                        }`}
                        title={
                          rec
                            ? `${emp.name} (${dateStr}): ${rec.activities.length} amalan, ${formatRupiah(rec.totalReward)}`
                            : undefined
                        }
                      >
                        {isPresent ? (
                          <div className="w-5 h-5 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-slate-200">•</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Total Hadir */}
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-800 bg-emerald-50/50 border-l border-emerald-200 font-mono text-xs">
                    {totalHadirCount} Hari
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Legend */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
            <span>Hadir & Melaksanakan Amalan (Semua Karyawan)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300 font-mono">•</span>
            <span>Tidak Ada Log / Belum Presensi</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 font-medium">
          Arahkan kursor ke tanda центang hijau untuk melihat detail amalan & insentif per tanggal.
        </p>
      </div>
    </div>
  );
};
