import React, { useState, useEffect } from 'react';
import { Check, X, Calendar, User, Save, Sparkles, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Employee, ActivityType, AttendanceRecord } from '../types';
import { formatRupiah } from '../utils/calculations';
import { calculateDailyIncentive } from '../data/initialData';

interface DailyPresenceFormProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  activities: ActivityType[];
  onSaveRecord: (record: AttendanceRecord) => void;
}

export const DailyPresenceForm: React.FC<DailyPresenceFormProps> = ({
  isOpen,
  onClose,
  employees,
  activities,
  onSaveRecord,
}) => {
  if (!isOpen) return null;

  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [dateStr, setDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isHaid, setIsHaid] = useState<boolean>(false);
  const [selectedActivities, setSelectedActivities] = useState<Record<string, boolean>>({
    'act-subuh': true,
    'act-isya': true,
    'act-tilawah': true,
    'act-dzikir-pagi': true,
    'act-dzikir-petang': true,
  });
  const [notes, setNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedEmp = employees.find((e) => e.id === selectedEmpId) || employees[0];

  // Reset isHaid if employee is Male
  useEffect(() => {
    if (selectedEmp?.gender === 'L') {
      setIsHaid(false);
    }
  }, [selectedEmpId, selectedEmp]);

  // Mandatory IDs list
  const normalMandatoryIds = ['act-subuh', 'act-isya', 'act-tilawah', 'act-dzikir-pagi', 'act-dzikir-petang'];
  const haidMandatoryIds = ['act-tilawah', 'act-dzikir-pagi', 'act-dzikir-petang'];

  const checkedIds = Object.entries(selectedActivities)
    .filter(([_, isChecked]) => isChecked)
    .map(([actId]) => actId);

  const isFemale = selectedEmp?.gender === 'P';
  const targetMandatoryIds = (isFemale && isHaid) ? haidMandatoryIds : normalMandatoryIds;

  const completedMandatoryCount = targetMandatoryIds.filter((id) => selectedActivities[id]).length;
  const isPackageComplete = completedMandatoryCount === targetMandatoryIds.length;

  const currentTotalReward = calculateDailyIncentive(
    checkedIds,
    selectedEmp ? selectedEmp.gender : 'L',
    isHaid
  );

  let currentTotalScore = 0;
  activities.forEach((act) => {
    if (selectedActivities[act.id]) {
      currentTotalScore += act.pointValue;
    }
  });

  const handleToggleActivity = (actId: string) => {
    setSelectedActivities((prev) => ({
      ...prev,
      [actId]: !prev[actId],
    }));
  };

  const handleSelectAll = () => {
    const allChecked: Record<string, boolean> = {};
    activities.forEach((a) => {
      if (isHaid && (a.id === 'act-subuh' || a.id === 'act-isya' || a.id === 'act-dhuha')) {
        allChecked[a.id] = false;
      } else {
        allChecked[a.id] = true;
      }
    });
    setSelectedActivities(allChecked);
  };

  const handleClearAll = () => {
    setSelectedActivities({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId || !dateStr) return;

    const activityLogs = Object.entries(selectedActivities)
      .filter(([_, isChecked]) => isChecked)
      .map(([actId]) => ({
        activityId: actId,
        completed: true,
        notes: notes || (isHaid ? 'Presensi saat Haid / Halangan' : undefined),
      }));

    const newRecord: AttendanceRecord = {
      id: `rec-${selectedEmpId}-${dateStr}-${Date.now()}`,
      employeeId: selectedEmpId,
      date: dateStr,
      isHaid: selectedEmp?.gender === 'P' ? isHaid : false,
      activities: activityLogs,
      totalScore: currentTotalScore,
      totalReward: currentTotalReward,
      timestamp: new Date().toISOString(),
      verifiedBy: 'HC PT Keberkahan Tujuan Utama',
      status: 'Hadir',
    };

    onSaveRecord(newRecord);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-indigo-900 text-white p-5 flex items-center justify-between border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-700 text-indigo-100 flex items-center justify-center border border-indigo-600 font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Input Presensi Amalan Spiritual</h3>
              <p className="text-xs text-indigo-200">PT Keberkahan Tujuan Utama — Kalkulasi Otomatis Sesuai Aturan Gender & Haid</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-1 rounded-lg transition hover:bg-indigo-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-2 font-semibold text-xs">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Presensi berhasil dicatat! Insentif otomatis diperbarui.</span>
            </div>
          )}

          {/* Employee & Date Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Select Employee */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Nama Karyawan
                </span>
                {selectedEmp && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedEmp.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                  }`}>
                    {selectedEmp.gender === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}
                  </span>
                )}
              </label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                required
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.gender === 'L' ? 'L' : 'P'}) - {emp.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Date */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Tanggal Presensi
              </label>
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                required
              />
            </div>
          </div>

          {/* Special Option for Female Employees: Haid / Halangan */}
          {selectedEmp?.gender === 'P' && (
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-3.5 flex items-start gap-3">
              <input
                type="checkbox"
                id="isHaidCheckbox"
                checked={isHaid}
                onChange={(e) => setIsHaid(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-pink-600 rounded border-pink-300 focus:ring-pink-500 cursor-pointer"
              />
              <label htmlFor="isHaidCheckbox" className="cursor-pointer">
                <div className="flex items-center gap-1.5 font-bold text-pink-900 text-xs">
                  <Heart className="w-3.5 h-3.5 text-pink-600 fill-pink-200" />
                  <span>Sedang Masa Haid / Halangan Syar'i</span>
                </div>
                <p className="text-[11px] text-pink-700 mt-0.5">
                  Ketentuan Khusus Haid: Shalat Subuh & Isya (Non-aktif). Wajib selesaikan 3 amalan (Al-Qur'an, Dzikir Pagi, Dzikir Petang) untuk mendapatkan insentif Rp 5.000. Jika ada 1 yang terlewat, insentif gugur (Rp 0).
                </p>
              </label>
            </div>
          )}

          {/* Activities Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-800 font-bold flex items-center gap-1 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Daftar Amalan Spiritual Hari Ini:
              </label>
              <div className="flex gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-indigo-700 font-semibold hover:underline cursor-pointer"
                >
                  Pilih Semua
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-slate-500 hover:underline cursor-pointer"
                >
                  Bersihkan
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {activities.map((act) => {
                const isChecked = !!selectedActivities[act.id];
                const isMandatory = targetMandatoryIds.includes(act.id);
                const isShalatDisabledDuringHaid = isHaid && (act.id === 'act-subuh' || act.id === 'act-isya' || act.id === 'act-dhuha');

                return (
                  <div
                    key={act.id}
                    onClick={() => {
                      if (!isShalatDisabledDuringHaid) {
                        handleToggleActivity(act.id);
                      }
                    }}
                    className={`p-3 rounded-xl border transition flex items-center justify-between ${
                      isShalatDisabledDuringHaid
                        ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                        : isChecked
                        ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 shadow-2xs cursor-pointer'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/60 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isChecked && !isShalatDisabledDuringHaid
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && !isShalatDisabledDuringHaid && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs">{act.name}</p>
                          {isMandatory && (
                            <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                              WAJIB
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {act.category} • {act.pointValue} Pts
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {isShalatDisabledDuringHaid ? (
                        <span className="text-pink-600">Off (Haid)</span>
                      ) : isChecked ? (
                        <span className="text-emerald-600 font-bold">Tercentang</span>
                      ) : (
                        <span className="text-slate-400">Belum</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Catatan Tambahan / Keterangan (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Juz 15 Halaman 280-290, Shalat di Masjid Al-Keberkahan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Calculated Live Total Banner & Status Alert */}
          <div className="space-y-2">
            {isPackageComplete ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Paket Amalan Spiritual Lengkap Terpenuhi!</p>
                  <p className="text-[11px] text-emerald-700">
                    {isHaid
                      ? 'Lengkap 3 amalan wajib masa haid. Hak insentif: Rp 5.000 / hari.'
                      : 'Lengkap 5 amalan wajib harian. Hak insentif: Rp 10.000 / hari.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3 rounded-xl flex items-center gap-2 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold">Ada Amalan Wajib Terlewat ({completedMandatoryCount}/{targetMandatoryIds.length} Tercentang)</p>
                  <p className="text-[11px] text-amber-800">
                    Aturan PT Keberkahan Tujuan Utama: Seluruh amalan wajib harian harus dilaksanakan lengkap. Jika ada 1 terlewat, insentif hari ini gugur (Rp 0).
                  </p>
                </div>
              </div>
            )}

            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-inner border border-slate-800">
              <div>
                <p className="text-[11px] text-indigo-300 uppercase tracking-wider font-semibold">
                  Insentif Hari Ini:
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className={`text-2xl font-extrabold font-mono ${
                    currentTotalReward > 0 ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {formatRupiah(currentTotalReward)}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">({currentTotalScore} Poin)</span>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-300">
                <p className="font-bold text-white">{selectedEmp?.name || '-'}</p>
                <p className="text-indigo-300 font-medium">
                  {selectedEmp?.gender === 'L' ? 'Pria (L)' : 'Wanita (P)'} {isHaid ? '• Masa Haid' : '• Normal'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Presensi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
