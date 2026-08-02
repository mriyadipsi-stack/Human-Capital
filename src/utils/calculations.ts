import { AttendanceRecord, ActivityType, Employee, PaymentSummary } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateEmployeePaymentSummary(
  employee: Employee,
  records: AttendanceRecord[],
  periodMonth: string, // e.g. "2026-08"
  workingDaysInMonth: number = 22
): PaymentSummary {
  const employeeRecords = records.filter(
    (r) => r.employeeId === employee.id && r.date.startsWith(periodMonth)
  );

  const attendedRecords = employeeRecords.filter((r) => r.status === 'Hadir');
  const totalDaysAttended = attendedRecords.length;

  let totalActivitiesCount = 0;
  let totalPoin = 0;
  let totalCalculatedReward = 0;

  attendedRecords.forEach((r) => {
    totalPoin += r.totalScore;
    totalCalculatedReward += r.totalReward;
    totalActivitiesCount += r.activities.filter((a) => a.completed).length;
  });

  const attendanceRatePct = (totalDaysAttended / workingDaysInMonth) * 100;
  
  // Bonus Rp 50.000 if attendance target achieved
  const bonusTargetAchieved = attendanceRatePct >= employee.targetAttendancePct ? 50000 : 0;
  const grandTotal = totalCalculatedReward + bonusTargetAchieved;

  return {
    employeeId: employee.id,
    period: periodMonth,
    totalDaysAttended,
    totalActivitiesCount,
    totalPoin,
    totalCalculatedReward,
    bonusTargetAchieved,
    grandTotal,
    paymentStatus: 'Approved',
  };
}

export interface MonthlyProgressSummary {
  period: string; // "2026-05", "2026-06", "2026-07", "2026-08"
  monthLabel: string; // "Mei 2026", "Juni 2026", "Juli 2026", "Agustus 2026"
  daysAttended: number;
  totalWorkingDays: number;
  attendanceRatePct: number;
  totalIncentive: number;
  totalPoints: number;
  targetAttendancePct: number;
  targetAchieved: boolean;
  bonusAchieved: number;
  grandTotal: number;
  totalActivitiesCount: number;
}

export function getMonthlyProgressForEmployee(
  employee: Employee,
  records: AttendanceRecord[]
): MonthlyProgressSummary[] {
  const periods = [
    { code: '2026-05', label: 'Mei 2026', workingDays: 20 },
    { code: '2026-06', label: 'Juni 2026', workingDays: 22 },
    { code: '2026-07', label: 'Juli 2026', workingDays: 22 },
    { code: '2026-08', label: 'Agustus 2026', workingDays: 15 },
  ];

  return periods.map((p) => {
    const summary = calculateEmployeePaymentSummary(employee, records, p.code, p.workingDays);
    const rate = Math.round((summary.totalDaysAttended / p.workingDays) * 100);

    return {
      period: p.code,
      monthLabel: p.label,
      daysAttended: summary.totalDaysAttended,
      totalWorkingDays: p.workingDays,
      attendanceRatePct: rate,
      totalIncentive: summary.totalCalculatedReward,
      totalPoints: summary.totalPoin,
      targetAttendancePct: employee.targetAttendancePct,
      targetAchieved: rate >= employee.targetAttendancePct,
      bonusAchieved: summary.bonusTargetAchieved,
      grandTotal: summary.grandTotal,
      totalActivitiesCount: summary.totalActivitiesCount,
    };
  });
}

export function generateGasScriptCode(): string {
  return `/**
 * GOOGLE APPS SCRIPT - DASHBOARD SPIRITUAL COMPANY MONITORING
 * Human Capital PT Keberkahan Tujuan Utama
 * Kode ini ditempatkan di Google Sheets -> Extensions -> Apps Script
 */

// Konfigurasi Nama Sheet
const SHEET_PRESENSI = "Presensi_Spiritual";
const SHEET_KARYAWAN = "Master_KARYAWAN";
const SHEET_REKAP = "Rekap_Insentif";

/**
 * 1. Fungsi Otomatis Hitung Insentif berdasarkan Jenis Kelamin & Status Haid
 */
function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  
  if (sheet.getName() === SHEET_PRESENSI && range.getRow() > 1) {
    hitungInsentifBaris(sheet, range.getRow());
  }
}

function hitungInsentifBaris(sheet, row) {
  // Kolom:
  // A: Tanggal | B: NIP | C: Nama | D: Gender (L/P) | E: Haid (Ya/Tidak) 
  // F: Subuh (y/n) | G: Isya (y/n) | H: Al-Quran (y/n) | I: Dzikir Pagi (y/n) | J: Dzikir Petang (y/n) | K: Total Rp
  
  const gender = sheet.getRange(row, 4).getValue(); // 'L' atau 'P'
  const isHaid = sheet.getRange(row, 5).getValue() === "Ya" || sheet.getRange(row, 5).getValue() === true;
  
  const isSubuh = sheet.getRange(row, 6).getValue() === true;
  const isIsya = sheet.getRange(row, 7).getValue() === true;
  const isQuran = sheet.getRange(row, 8).getValue() === true;
  const isDzikirPagi = sheet.getRange(row, 9).getValue() === true;
  const isDzikirPetang = sheet.getRange(row, 10).getValue() === true;
  
  let total = 0;
  
  if (gender === 'P' && isHaid) {
    // Wanita Haid: Wajib Al-Quran, Dzikir Pagi & Petang (3 amalan)
    // Jika KETIGA amalan ini DILAKSANAKAN SEMUA -> Rp 5.000, jika terlewat salah satu -> Rp 0
    if (isQuran && isDzikirPagi && isDzikirPetang) {
      total = 5000;
    } else {
      total = 0;
    }
  } else {
    // Laki-laki / Wanita Normal: Wajib Subuh, Isya, Al-Quran, Dzikir Pagi, Dzikir Petang (5 amalan)
    // Jika KELIMA amalan ini DILAKSANAKAN SEMUA -> Rp 10.000, jika terlewat salah satu -> Rp 0
    if (isSubuh && isIsya && isQuran && isDzikirPagi && isDzikirPetang) {
      total = 10000;
    } else {
      total = 0;
    }
  }
  
  sheet.getRange(row, 11).setValue(total);
}

/**
 * 2. API Webhook JSON untuk Dashboard & Looker Studio
 */
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetPresensi = ss.getSheetByName(SHEET_PRESENSI);
  const data = sheetPresensi.getDataRange().getValues();
  
  const headers = data[0];
  const rows = data.slice(1);
  
  const result = rows.map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 3. Kirim Email Rekapitulasi Insentif Bulanan (Human Capital PT Keberkahan Tujuan Utama)
 */
function kirimEmailRekapInsentif() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetRekap = ss.getSheetByName(SHEET_REKAP);
  const data = sheetRekap.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const nama = data[i][1];
    const email = data[i][2];
    const totalHadir = data[i][3];
    const totalInsentif = data[i][4];
    
    if (email && totalInsentif > 0) {
      const subject = "Rekap Insentif Spiritual Company - " + nama + " (PT Keberkahan Tujuan Utama)";
      const body = "Assalamu'alaikum Wr. Wb. " + nama + ",\\n\\n" +
        "Berikut rekapitulasi amalan & insentif Spiritual Company Anda bulan ini:\\n" +
        "- Total Kehadiran Amalan: " + totalHadir + " hari\\n" +
        "- Total Insentif Diterima: Rp " + totalInsentif.toLocaleString('id-ID') + "\\n\\n" +
        "Jazakumullah Khairan atas ketakwaan dan keistiqomahannya.\\n\\n" +
        "Salam,\\nHuman Capital PT Keberkahan Tujuan Utama";
        
      MailApp.sendEmail(email, subject, body);
    }
  }
}
`;
}
