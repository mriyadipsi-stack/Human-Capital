import React, { useState } from 'react';
import { Header } from './components/Header';
import { OverviewCards } from './components/OverviewCards';
import { EmployeeTable } from './components/EmployeeTable';
import { DailyPresenceForm } from './components/DailyPresenceForm';
import { PresenceGrid } from './components/PresenceGrid';
import { ActivityConfigModal } from './components/ActivityConfigModal';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { GasLookerGuide } from './components/GasLookerGuide';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { AiMotivationModal } from './components/AiMotivationModal';
import { AddEmployeeModal } from './components/AddEmployeeModal';

import { INITIAL_EMPLOYEES, INITIAL_ACTIVITIES, generateSampleRecords } from './data/initialData';
import { Employee, ActivityType, AttendanceRecord, PaymentSummary } from './types';
import { calculateEmployeePaymentSummary, formatRupiah } from './utils/calculations';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [activities, setActivities] = useState<ActivityType[]>(INITIAL_ACTIVITIES);
  const [records, setRecords] = useState<AttendanceRecord[]>(generateSampleRecords());
  const [currentPeriod, setCurrentPeriod] = useState<string>('2026-08');

  // Navigation tab: 'summary' | 'presence' | 'matrix' | 'analytics' | 'guide' | 'settings'
  const [activeTab, setActiveTab] = useState<'summary' | 'presence' | 'matrix' | 'analytics' | 'guide' | 'settings'>('summary');

  // Modals state
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<Employee | null>(null);

  // Compute payment summaries for current period
  const summaries: PaymentSummary[] = employees.map((emp) =>
    calculateEmployeePaymentSummary(emp, records, currentPeriod)
  );

  // Handlers
  const handleTogglePaymentStatus = (employeeId: string) => {
    // In live app, this toggles status in summaries or local store
    setRecords((prev) => [...prev]); // trigger re-render
  };

  const handleSaveRecord = (newRecord: AttendanceRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [...prev, newEmp]);
  };

  const handleUpdateActivities = (newActivities: ActivityType[]) => {
    setActivities(newActivities);
  };

  const handleExportCsv = () => {
    const headers = ['NIP', 'Nama Karyawan', 'Departemen', 'Jabatan', 'Hari Hadir', 'Poin Spiritual', 'Insentif Pokok (Rp)', 'Bonus Target (Rp)', 'Grand Total (Rp)', 'Status Bayar'];
    const rows = summaries.map((s) => {
      const emp = employees.find((e) => e.id === s.employeeId);
      return [
        emp?.nip || '',
        `"${emp?.name || ''}"`,
        `"${emp?.department || ''}"`,
        `"${emp?.position || ''}"`,
        s.totalDaysAttended,
        s.totalPoin,
        s.totalCalculatedReward,
        s.bonusTargetAchieved,
        s.grandTotal,
        s.paymentStatus,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rekap_Insentif_Spiritual_${currentPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased selection:bg-emerald-500 selection:text-white pb-12">
      {/* App Top Header */}
      <Header
        currentPeriod={currentPeriod}
        onPeriodChange={setCurrentPeriod}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPresenceModal={() => setIsPresenceModalOpen(true)}
        onOpenAddEmployeeModal={() => setIsAddEmployeeModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onExportCsv={handleExportCsv}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top KPI Cards */}
        <OverviewCards
          totalEmployees={employees.length}
          summaries={summaries}
          employees={employees}
        />

        {/* Tab View: Summary & Employee Table */}
        {activeTab === 'summary' && (
          <EmployeeTable
            employees={employees}
            summaries={summaries}
            records={records}
            activities={activities}
            onTogglePaymentStatus={handleTogglePaymentStatus}
            onOpenIndividualDetail={(emp) => setSelectedEmployeeForDetail(emp)}
            onOpenAddEmployeeModal={() => setIsAddEmployeeModalOpen(true)}
          />
        )}

        {/* Tab View: Presence Matrix */}
        {activeTab === 'matrix' && (
          <PresenceGrid
            employees={employees}
            records={records}
            currentPeriod={currentPeriod}
          />
        )}

        {/* Tab View: Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsCharts
            employees={employees}
            summaries={summaries}
            records={records}
            activities={activities}
            currentPeriod={currentPeriod}
          />
        )}

        {/* Tab View: GAS & Looker Studio Guide */}
        {activeTab === 'guide' && <GasLookerGuide />}

        {/* Tab View: Activity Config & Incentive Rates */}
        {activeTab === 'settings' && (
          <ActivityConfigModal
            activities={activities}
            onUpdateActivities={handleUpdateActivities}
          />
        )}
      </main>

      {/* Modal: Input Daily Presence */}
      <DailyPresenceForm
        isOpen={isPresenceModalOpen}
        onClose={() => setIsPresenceModalOpen(false)}
        employees={employees}
        activities={activities}
        onSaveRecord={handleSaveRecord}
      />

      {/* Modal: Employee Individual Detail */}
      <EmployeeDetailModal
        employee={selectedEmployeeForDetail}
        records={records}
        activities={activities}
        onClose={() => setSelectedEmployeeForDetail(null)}
      />

      {/* Modal: AI Motivation */}
      <AiMotivationModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Modal: Tambah Karyawan Baru */}
      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        onAddEmployee={handleAddEmployee}
        existingEmployees={employees}
      />
    </div>
  );
}
