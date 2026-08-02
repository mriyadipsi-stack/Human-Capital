import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  ComposedChart,
} from 'recharts';
import { Employee, PaymentSummary, AttendanceRecord, ActivityType } from '../types';
import { formatRupiah, getMonthlyProgressForEmployee } from '../utils/calculations';
import { TrendingUp, PieChart as PieIcon, BarChart3, Award, Users, CheckCircle } from 'lucide-react';

interface AnalyticsChartsProps {
  employees: Employee[];
  summaries: PaymentSummary[];
  records: AttendanceRecord[];
  activities: ActivityType[];
  currentPeriod: string;
}

const COLORS = ['#10b981', '#14b8a6', '#0284c7', '#8b5cf6', '#f59e0b', '#ec4899', '#6366f1'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  employees,
  summaries,
  records,
  activities,
  currentPeriod,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');

  // 1. Department Incentive Breakdown
  const deptMap: Record<string, number> = {};
  summaries.forEach((s) => {
    const emp = employees.find((e) => e.id === s.employeeId);
    if (emp) {
      deptMap[emp.department] = (deptMap[emp.department] || 0) + s.grandTotal;
    }
  });

  const deptChartData = Object.entries(deptMap).map(([dept, total]) => ({
    department: dept.length > 15 ? dept.substring(0, 15) + '...' : dept,
    fullDepartment: dept,
    totalRupiah: total,
  }));

  // 2. Activity Distribution (How many times each activity was logged)
  const activityCountMap: Record<string, number> = {};
  records
    .filter((r) => r.date.startsWith(currentPeriod))
    .forEach((r) => {
      r.activities.forEach((act) => {
        if (act.completed) {
          const actObj = activities.find((a) => a.id === act.activityId);
          const actName = actObj ? actObj.name : act.activityId;
          activityCountMap[actName] = (activityCountMap[actName] || 0) + 1;
        }
      });
    });

  const activityPieData = Object.entries(activityCountMap).map(([name, count]) => ({
    name: name.length > 20 ? name.substring(0, 20) + '...' : name,
    value: count,
  }));

  // 3. Daily Attendance Trend Line
  const dailyMap: Record<string, number> = {};
  records
    .filter((r) => r.date.startsWith(currentPeriod) && r.status === 'Hadir')
    .forEach((r) => {
      const dayNum = r.date.split('-')[2]; // "01", "02", etc.
      dailyMap[dayNum] = (dailyMap[dayNum] || 0) + 1;
    });

  const dailyTrendData = Array.from({ length: 15 }, (_, i) => {
    const dayStr = String(i + 1).padStart(2, '0');
    return {
      tanggal: `Tgl ${i + 1}`,
      jumlahHadir: dailyMap[dayStr] || 0,
    };
  });

  // Selected Employee Monthly Progress
  const selectedEmployee = employees.find((e) => e.id === selectedEmpId) || employees[0];
  const selectedEmpProgress = selectedEmployee ? getMonthlyProgressForEmployee(selectedEmployee, records) : [];

  return (
    <div className="space-y-6 mb-8">
      {/* SECTION: Tracking Progress Bulanan Tiap Karyawan */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Tracking Progress Bulanan Tiap Karyawan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau tren perkembangan insentif, tingkat kehadiran, dan pencapaian target tiap karyawan bulan ke bulan
            </p>
          </div>

          {/* Employee Selector */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedEmployee && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart: Selected Employee Multi-Month Trend */}
            <div className="lg:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Tren Insentif & Presensi: <span className="text-indigo-700">{selectedEmployee.name}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Perkembangan Mei 2026 - Agustus 2026</p>
                </div>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold border border-indigo-200">
                  Target: {selectedEmployee.targetAttendancePct}% Kehadiran
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={selectedEmpProgress} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    <Line yAxisId="right" type="monotone" dataKey="attendanceRatePct" name="Tingkat Presensi" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Side Table: Monthly Breakdown Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Ringkasan Pencapaian Bulanan</h4>
              <div className="space-y-2">
                {selectedEmpProgress.map((p) => (
                  <div
                    key={p.period}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-indigo-300 transition"
                  >
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{p.monthLabel}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {p.daysAttended}/{p.totalWorkingDays} hari ({p.attendanceRatePct}%)
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold font-mono text-emerald-700 text-xs">{formatRupiah(p.grandTotal)}</p>
                      {p.targetAchieved ? (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center justify-end gap-1 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Target
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 font-bold mt-0.5 block">
                          Belum Target
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top 2 Grid: Department Bar Chart + Activity Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Total Insentif per Departemen</span>
              </h3>
              <p className="text-xs text-slate-500">Distribusi pengeluaran insentif spiritual perusahaan</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} interval={0} />
                <YAxis
                  tickFormatter={(val) => `Rp ${(val / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(value: any) => [formatRupiah(Number(value)), 'Total Insentif']}
                  labelFormatter={(label, payload) => payload[0]?.payload?.fullDepartment || label}
                />
                <Bar dataKey="totalRupiah" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-teal-600" />
                <span>Komposisi Jenis Amalan Terbanyak</span>
              </h3>
              <p className="text-xs text-slate-500">Amalan yang paling sering dilaksanakan karyawan</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {activityPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val} Kali`, 'Total Dilakukan']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Attendance Trend Line Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Tren Kehadiran Presensi Harian (Agustus 2026)</span>
            </h3>
            <p className="text-xs text-slate-500">Jumlah karyawan yang melakukan presensi per tanggal</p>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="tanggal" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip formatter={(val: any) => [`${val} Karyawan`, 'Jumlah Hadir']} />
              <Line
                type="monotone"
                dataKey="jumlahHadir"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

