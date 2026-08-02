import { ActivityType, Employee, AttendanceRecord } from '../types';

export const INITIAL_ACTIVITIES: ActivityType[] = [
  {
    id: 'act-subuh',
    name: 'Shalat Subuh Berjamaah di Masjid',
    category: 'Shalat',
    rewardAmount: 10000,
    pointValue: 10,
    description: 'Shalat subuh berjamaah di masjid (L: Rp 10.000 | P Normal: Rp 10.000 | P Haid: Rp 0)',
    iconName: 'Sun',
    targetPerMonth: 20,
  },
  {
    id: 'act-isya',
    name: 'Shalat Isya Berjamaah di Masjid',
    category: 'Shalat',
    rewardAmount: 10000,
    pointValue: 10,
    description: 'Shalat isya berjamaah di masjid (L: Rp 10.000 | P Normal: Rp 10.000 | P Haid: Rp 0)',
    iconName: 'Moon',
    targetPerMonth: 20,
  },
  {
    id: 'act-tilawah',
    name: 'Membaca Al-Qur\'an',
    category: 'Al-Quran',
    rewardAmount: 10000,
    pointValue: 10,
    description: 'Membaca Al-Qur\'an / Tadabbur (L/P Normal: Rp 10.000 | P Haid: Rp 5.000)',
    iconName: 'BookOpen',
    targetPerMonth: 20,
  },
  {
    id: 'act-dzikir-pagi',
    name: 'Dzikir Pagi',
    category: 'Sunnah',
    rewardAmount: 10000,
    pointValue: 10,
    description: 'Membaca Dzikir Pagi Al-Matsurat (L/P Normal: Rp 10.000 | P Haid: Rp 5.000)',
    iconName: 'Sparkles',
    targetPerMonth: 20,
  },
  {
    id: 'act-dzikir-petang',
    name: 'Dzikir Petang',
    category: 'Sunnah',
    rewardAmount: 10000,
    pointValue: 10,
    description: 'Membaca Dzikir Petang Al-Matsurat (L/P Normal: Rp 10.000 | P Haid: Rp 5.000)',
    iconName: 'Sparkles',
    targetPerMonth: 20,
  },
  {
    id: 'act-dhuha',
    name: 'Shalat Dhuha',
    category: 'Shalat',
    rewardAmount: 5000,
    pointValue: 5,
    description: 'Shalat Dhuha minimal 2-4 rakaat',
    iconName: 'Sunrise',
    targetPerMonth: 20,
  },
  {
    id: 'act-sedekah',
    name: 'Infaq / Sedekah Harian',
    category: 'Infaq',
    rewardAmount: 5000,
    pointValue: 5,
    description: 'Sedekah subuh atau kotak infaq perusahaan',
    iconName: 'HeartHandshake',
    targetPerMonth: 20,
  },
  {
    id: 'act-kajian',
    name: 'Mengikuti Mentoring / Kajian',
    category: 'Kajian',
    rewardAmount: 10000,
    pointValue: 10,
    description: 'Hadir dalam kajian pekanan perusahaan',
    iconName: 'Users',
    targetPerMonth: 4,
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    name: 'Ahmad Faisal, S.T.',
    nip: 'EMP-2024-001',
    gender: 'L',
    department: 'Software Engineering',
    position: 'Senior Developer',
    targetAttendancePct: 85,
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7123456789',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'emp-002',
    name: 'Siti Nurhaliza, M.M.',
    nip: 'EMP-2024-002',
    gender: 'P',
    department: 'Human Capital',
    position: 'HC Manager',
    targetAttendancePct: 90,
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7198765432',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'emp-003',
    name: 'Budi Santoso, S.E.',
    nip: 'EMP-2024-003',
    gender: 'L',
    department: 'Keuangan & Akuntansi',
    position: 'Financial Analyst',
    targetAttendancePct: 80,
    bankName: 'BCA Syariah',
    accountNumber: '5220011223',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'emp-004',
    name: 'Dewi Rahmawati, S.Kom.',
    nip: 'EMP-2024-004',
    gender: 'P',
    department: 'Pemasaran & Digital',
    position: 'Digital Marketer',
    targetAttendancePct: 85,
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7155667788',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'emp-005',
    name: 'Muhammad Rizky',
    nip: 'EMP-2024-005',
    gender: 'L',
    department: 'Operasional & Logistik',
    position: 'Operations Supervisor',
    targetAttendancePct: 75,
    bankName: 'Muamalat',
    accountNumber: '1010020304',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'emp-006',
    name: 'Khadijah Az-Zahra',
    nip: 'EMP-2024-006',
    gender: 'P',
    department: 'Software Engineering',
    position: 'UI/UX Designer',
    targetAttendancePct: 85,
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7188990011',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'emp-007',
    name: 'Rahmat Hidayatullah',
    nip: 'EMP-2024-007',
    gender: 'L',
    department: 'Layanan Pelanggan',
    position: 'Customer Support',
    targetAttendancePct: 80,
    bankName: 'BSI',
    accountNumber: '7144332211',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'emp-008',
    name: 'Nurul Hidayah, S.Pd.',
    nip: 'EMP-2024-008',
    gender: 'P',
    department: 'Human Capital',
    position: 'Talent Acquisition',
    targetAttendancePct: 85,
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7133221100',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
  }
];

// Helper function to calculate daily package reward based on Gender, Haid status, and Completed Activities
export function calculateDailyIncentive(
  completedActivityIds: string[],
  gender: 'L' | 'P',
  isHaid: boolean = false
): number {
  if (gender === 'P' && isHaid) {
    const hasQuran = completedActivityIds.includes('act-tilawah');
    const hasDzikirPagi = completedActivityIds.includes('act-dzikir-pagi');
    const hasDzikirPetang = completedActivityIds.includes('act-dzikir-petang');

    // Wajib 3 amalan saat Haid (Shalat Subuh & Isya Non-aktif)
    if (hasQuran && hasDzikirPagi && hasDzikirPetang) {
      return 5000;
    }
    return 0; // Jika terlewat salah satu -> Gugur / Rp 0
  }

  // Laki-laki / Perempuan Normal wajib 5 amalan
  const hasSubuh = completedActivityIds.includes('act-subuh');
  const hasIsya = completedActivityIds.includes('act-isya');
  const hasQuran = completedActivityIds.includes('act-tilawah');
  const hasDzikirPagi = completedActivityIds.includes('act-dzikir-pagi');
  const hasDzikirPetang = completedActivityIds.includes('act-dzikir-petang');

  if (hasSubuh && hasIsya && hasQuran && hasDzikirPagi && hasDzikirPetang) {
    return 10000;
  }
  return 0; // Jika terlewat salah satu -> Gugur / Rp 0
}

// Deprecated single activity reward helper, kept for backward compatibility
export function calculateActivityReward(
  activityId: string,
  gender: 'L' | 'P',
  isHaid: boolean = false,
  baseRewardAmount: number = 10000
): number {
  return calculateDailyIncentive([activityId], gender, isHaid);
}

// Generate sample records for multiple months (May, June, July, August 2026)
export function generateSampleRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const currentYear = 2026;

  const months = [
    { month: 5, daysCount: 20 },
    { month: 6, daysCount: 22 },
    { month: 7, daysCount: 22 },
    { month: 8, daysCount: 15 },
  ];

  months.forEach(({ month, daysCount }) => {
    INITIAL_EMPLOYEES.forEach((emp, empIdx) => {
      for (let day = 1; day <= daysCount; day++) {
        const dateStr = `${currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Slight organic variation in attendance
        const isAbsent = (day % 7 === 0) || (empIdx === 4 && day % 4 === 0) || (empIdx === 2 && month === 5 && day % 3 === 0);
        
        if (isAbsent) {
          records.push({
            id: `rec-${emp.id}-${dateStr}`,
            employeeId: emp.id,
            date: dateStr,
            activities: [],
            totalScore: 0,
            totalReward: 0,
            timestamp: `${dateStr}T08:00:00Z`,
            status: 'Absen',
          });
          continue;
        }

        // Sample Haid condition for female employees on days 5 to 9
        const isHaid = emp.gender === 'P' && (day >= 5 && day <= 9);

        const completedActivities = INITIAL_ACTIVITIES.filter((act) => {
          if (isHaid && (act.id === 'act-subuh' || act.id === 'act-isya' || act.id === 'act-dhuha')) {
            return false; // Skips shalat when in haid
          }
          if (act.id === 'act-subuh') return (empIdx + day + month) % 2 === 0 || empIdx === 0;
          if (act.id === 'act-isya') return (empIdx + day + month) % 2 === 1 || empIdx === 1;
          if (act.id === 'act-tilawah') return true;
          if (act.id === 'act-dzikir-pagi') return true;
          if (act.id === 'act-dzikir-petang') return true;
          if (act.id === 'act-dhuha') return day % 2 === 0;
          if (act.id === 'act-sedekah') return day % 3 !== 0;
          if (act.id === 'act-kajian') return day === 5 || day === 12; // Fridays
          return false;
        });

        const activityLogs = completedActivities.map(act => ({
          activityId: act.id,
          completed: true,
          notes: act.id === 'act-tilawah' ? (isHaid ? 'Membaca Terjemahan & Tafsir' : 'Surah Al-Kahfi / Juz 15') : undefined,
        }));

        const completedIds = completedActivities.map(a => a.id);
        const totalReward = calculateDailyIncentive(completedIds, emp.gender, isHaid);

        const totalScore = completedActivities.reduce((sum, act) => sum + act.pointValue, 0);

        records.push({
          id: `rec-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          date: dateStr,
          isHaid,
          activities: activityLogs,
          totalScore,
          totalReward,
          timestamp: `${dateStr}T07:30:00Z`,
          verifiedBy: 'Siti Nurhaliza (HC)',
          status: 'Hadir',
        });
      }
    });
  });

  return records;
}
