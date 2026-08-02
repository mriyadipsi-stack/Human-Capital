import React, { useState } from 'react';
import { ActivityType } from '../types';
import { formatRupiah } from '../utils/calculations';
import { Settings, Plus, Trash2, Edit2, Check, Sparkles, DollarSign } from 'lucide-react';

interface ActivityConfigModalProps {
  activities: ActivityType[];
  onUpdateActivities: (activities: ActivityType[]) => void;
}

export const ActivityConfigModal: React.FC<ActivityConfigModalProps> = ({
  activities,
  onUpdateActivities,
}) => {
  const [activityList, setActivityList] = useState<ActivityType[]>(activities);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New Activity form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Shalat' | 'Al-Quran' | 'Infaq' | 'Sunnah' | 'Kajian'>('Shalat');
  const [newReward, setNewReward] = useState<number>(10000);
  const [newPoints, setNewPoints] = useState<number>(10);
  const [newTarget, setNewTarget] = useState<number>(20);

  const handleRewardChange = (id: string, newAmount: number) => {
    const updated = activityList.map((act) =>
      act.id === id ? { ...act, rewardAmount: Math.max(0, newAmount) } : act
    );
    setActivityList(updated);
    onUpdateActivities(updated);
  };

  const handlePointChange = (id: string, newPointsVal: number) => {
    const updated = activityList.map((act) =>
      act.id === id ? { ...act, pointValue: Math.max(0, newPointsVal) } : act
    );
    setActivityList(updated);
    onUpdateActivities(updated);
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newAct: ActivityType = {
      id: `act-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      rewardAmount: newReward,
      pointValue: newPoints,
      description: 'Amalan spiritual kustom perusahaan',
      iconName: 'Sparkles',
      targetPerMonth: newTarget,
    };

    const updated = [...activityList, newAct];
    setActivityList(updated);
    onUpdateActivities(updated);

    // Reset
    setNewName('');
    setNewReward(10000);
    setNewPoints(10);
  };

  const handleDelete = (id: string) => {
    if (activityList.length <= 1) return;
    const updated = activityList.filter((a) => a.id !== id);
    setActivityList(updated);
    onUpdateActivities(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-600" />
          <span>Pengaturan Program Spiritual & Tarif Insentif (Rupiah)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Ketentuan PT Keberkahan Tujuan Utama: L/P Normal wajib menyelesaikan 5 amalan (Shalat Subuh, Shalat Isya, Al-Qur'an, Dzikir Pagi, Dzikir Petang) untuk insentif Rp 10.000/hari. Saat Haid: Pria/Wanita menyelesaikan 3 amalan (Al-Qur'an, Dzikir Pagi, Dzikir Petang) untuk insentif Rp 5.000/hari. Jika ada 1 amalan wajib terlewat, insentif hari tersebut gugur (Rp 0).
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Existing Activities Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="p-3">Nama Amalan</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Bobot Poin</th>
                <th className="p-3">Tarif Insentif (Rupiah / Kali)</th>
                <th className="p-3 text-center">Target / Bulan</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {activityList.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{act.name}</td>
                  <td className="p-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-slate-200">
                      {act.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={act.pointValue}
                      onChange={(e) => handlePointChange(act.id, Number(e.target.value))}
                      className="w-20 p-1 border border-slate-300 rounded text-center font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      min={1}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-bold">Rp</span>
                      <input
                        type="number"
                        value={act.rewardAmount}
                        onChange={(e) => handleRewardChange(act.id, Number(e.target.value))}
                        className="w-28 p-1 border border-slate-300 rounded font-mono font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        step={1000}
                        min={0}
                      />
                    </div>
                  </td>
                  <td className="p-3 text-center font-mono">{act.targetPerMonth} kali</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(act.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                      title="Hapus Amalan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Activity Form */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Tambah Amalan Spiritual Baru</span>
          </h3>

          <form onSubmit={handleAddActivity} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Nama Amalan</label>
              <input
                type="text"
                placeholder="mis. Shalat Jum'at Awal Waktu"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Kategori</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Shalat">Shalat</option>
                <option value="Al-Quran">Al-Quran</option>
                <option value="Infaq">Infaq</option>
                <option value="Sunnah">Sunnah</option>
                <option value="Kajian">Kajian</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Tarif Insentif (Rp)</label>
              <input
                type="number"
                placeholder="10000"
                value={newReward}
                onChange={(e) => setNewReward(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                step={1000}
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Poin</label>
              <input
                type="number"
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
