export interface Employee {
  id: string;
  name: string;
  nip: string;
  gender: 'L' | 'P'; // 'L' = Laki-laki, 'P' = Perempuan
  department: string;
  position: string;
  avatarUrl?: string;
  targetAttendancePct: number; // e.g. 80%
  bankName: string;
  accountNumber: string;
}

export interface ActivityType {
  id: string;
  name: string;
  category: 'Shalat' | 'Al-Quran' | 'Infaq' | 'Sunnah' | 'Kajian';
  rewardAmount: number; // in IDR (Rupiah)
  pointValue: number;
  description: string;
  iconName: string;
  targetPerMonth: number;
}

export interface DailyActivityLog {
  activityId: string;
  completed: boolean;
  notes?: string;
  value?: number; // e.g. amount for Sedekah or number of pages for Tilawah
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  isHaid?: boolean; // Khusus karyawan perempuan saat masa haid / halangan
  activities: DailyActivityLog[];
  totalScore: number;
  totalReward: number; // in IDR
  timestamp: string;
  verifiedBy?: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Absen';
}

export interface PaymentSummary {
  employeeId: string;
  period: string; // e.g. "2026-08"
  totalDaysAttended: number;
  totalActivitiesCount: number;
  totalPoin: number;
  totalCalculatedReward: number; // Rupiah
  bonusTargetAchieved: number; // Extra bonus if target % achieved
  grandTotal: number;
  paymentStatus: 'Pending' | 'Approved' | 'Paid';
  paymentDate?: string;
}

export interface DepartmentStat {
  department: string;
  employeeCount: number;
  avgAttendanceRate: number;
  totalReward: number;
}
