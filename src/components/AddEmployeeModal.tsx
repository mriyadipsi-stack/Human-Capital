import React, { useState } from 'react';
import { X, UserPlus, User, Building2, Briefcase, CreditCard, Check, Sparkles } from 'lucide-react';
import { Employee } from '../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (newEmployee: Employee) => void;
  existingEmployees: Employee[];
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  existingEmployees,
}) => {
  // Generate next default NIP
  const nextNumber = existingEmployees.length + 1;
  const defaultNip = `EMP-2024-${nextNumber.toString().padStart(3, '0')}`;

  const [name, setName] = useState('');
  const [nip, setNip] = useState(defaultNip);
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [department, setDepartment] = useState('Human Capital');
  const [customDepartment, setCustomDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [targetAttendancePct, setTargetAttendancePct] = useState(85);
  const [bankName, setBankName] = useState('BSI (Bank Syariah Indonesia)');
  const [accountNumber, setAccountNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const defaultAvatarL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const defaultAvatarP = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalDept = department === 'LAINNYA' ? customDepartment.trim() || 'Umum' : department;
    const finalAvatar = avatarUrl.trim() || (gender === 'L' ? defaultAvatarL : defaultAvatarP);

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: name.trim(),
      nip: nip.trim() || defaultNip,
      gender,
      department: finalDept,
      position: position.trim() || 'Staf',
      targetAttendancePct: Number(targetAttendancePct) || 85,
      bankName: bankName.trim() || 'BSI',
      accountNumber: accountNumber.trim() || '7100123456',
      avatarUrl: finalAvatar,
    };

    onAddEmployee(newEmp);
    setSuccessMessage(true);

    setTimeout(() => {
      setSuccessMessage(false);
      setName('');
      setPosition('');
      setAccountNumber('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-indigo-900 text-white p-5 flex items-center justify-between border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-700 text-indigo-100 flex items-center justify-center border border-indigo-600 font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Tambah Karyawan Baru</h3>
              <p className="text-xs text-indigo-200">PT Keberkahan Tujuan Utama — Database Human Capital</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-1 rounded-lg transition hover:bg-indigo-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-2 font-semibold text-xs">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Karyawan baru berhasil ditambahkan ke sistem!</span>
            </div>
          )}

          {/* Nama & NIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Nama Lengkap Karyawan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Abdullah Said, S.T."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                NIP / Nomor Induk Pegawai
              </label>
              <input
                type="text"
                placeholder="EMP-2024-xxx"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* Gender & Departemen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setGender('L')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                    gender === 'L'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Laki-Laki (L)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('P')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                    gender === 'P'
                      ? 'bg-pink-50 border-pink-500 text-pink-900 ring-2 ring-pink-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  <span>Perempuan (P)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Departemen / Divisi
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Human Capital">Human Capital</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Keuangan & Akuntansi">Keuangan & Akuntansi</option>
                <option value="Pemasaran & Digital">Pemasaran & Digital</option>
                <option value="Operasional & Logistik">Operasional & Logistik</option>
                <option value="Layanan Pelanggan">Layanan Pelanggan</option>
                <option value="LAINNYA">+ Tambah Departemen Lain</option>
              </select>
              {department === 'LAINNYA' && (
                <input
                  type="text"
                  placeholder="Ketikkan nama departemen baru..."
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                  className="w-full p-2 mt-2 border border-slate-300 rounded-xl bg-white text-xs"
                />
              )}
            </div>
          </div>

          {/* Jabatan & Target Presensi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Jabatan / Posisi
              </label>
              <input
                type="text"
                placeholder="Contoh: Specialist HC, Staff IT"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Target Presensi Kehadiran (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={targetAttendancePct}
                onChange={(e) => setTargetAttendancePct(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* Data Bank & No Rekening */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Nama Bank Transfer</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Nomor Rekening</label>
              <input
                type="text"
                placeholder="Contoh: 7123456789"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* Avatar URL (Optional) */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">URL Pas Foto / Avatar (Opsional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
            />
          </div>

          {/* Info note */}
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-3 rounded-xl flex items-center gap-2 text-[11px]">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Karyawan baru otomatis terintegrasi ke dalam kalkulasi insentif & matriks presensi harian.</span>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Simpan Karyawan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
