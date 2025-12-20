"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, X, ChevronDown } from 'lucide-react';

// --- Type Definitions ---
type AttendanceStatus = 'present' | 'late' | 'sick' | 'personal' | 'absent' | 'holiday' | 'weekend' | 'none';

interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  time: string;
  status: AttendanceStatus;
  location: string;
  note?: string;
}

// --- Helper Functions ---
const monthsTh = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const monthsShortTh = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

const daysTh = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

const getDayNameTh = (dateStr: string) => {
  const date = new Date(dateStr);
  const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  return days[date.getDay()];
};

// --- Mock Data: 3 Months (Oct, Nov, Dec 2025) ---
const mockDatabase: AttendanceRecord[] = [
  // --- December 2025 ---
  { date: '2025-12-20', time: '07:45', status: 'present', location: 'ประตู 1' },
  { date: '2025-12-19', time: '07:50', status: 'present', location: 'ประตู 2' },
  { date: '2025-12-18', time: '08:15', status: 'late', location: 'ประตู 1', note: 'รถติดอุบัติเหตุ' },
  { date: '2025-12-17', time: '-', status: 'sick', location: '-', note: 'ลาป่วย (ไข้หวัด)' },
  { date: '2025-12-16', time: '07:30', status: 'present', location: 'ประตู 1' },
  { date: '2025-12-13', time: '07:42', status: 'present', location: 'ประตู 3' },
  { date: '2025-12-12', time: '07:55', status: 'present', location: 'ประตู 2' },
  { date: '2025-12-11', time: '07:48', status: 'present', location: 'ประตู 1' },
  { date: '2025-12-10', time: '-', status: 'holiday', location: '-', note: 'วันรัฐธรรมนูญ' },
  { date: '2025-12-09', time: '08:05', status: 'late', location: 'ประตู 1', note: 'ตื่นสาย' },
  { date: '2025-12-06', time: '07:35', status: 'present', location: 'ประตู 1' },
  { date: '2025-12-05', time: '-', status: 'holiday', location: '-', note: 'วันพ่อแห่งชาติ' },
  { date: '2025-12-04', time: '07:50', status: 'present', location: 'ประตู 2' },
  { date: '2025-12-03', time: '-', status: 'personal', location: '-', note: 'ลากิจ (งานบวชพี่)' },
  { date: '2025-12-02', time: '07:40', status: 'present', location: 'ประตู 1' },

  // --- November 2025 ---
  { date: '2025-11-28', time: '07:40', status: 'present', location: 'ประตู 1' },
  { date: '2025-11-27', time: '07:45', status: 'present', location: 'ประตู 2' },
  { date: '2025-11-26', time: '07:50', status: 'present', location: 'ประตู 1' },
  { date: '2025-11-25', time: '07:35', status: 'present', location: 'ประตู 1' },
  { date: '2025-11-24', time: '08:10', status: 'late', location: 'ประตู 2', note: 'ฝนตกหนัก' },
  { date: '2025-11-21', time: '07:42', status: 'present', location: 'ประตู 3' },
  { date: '2025-11-20', time: '07:55', status: 'present', location: 'ประตู 2' },
  { date: '2025-11-19', time: '-', status: 'sick', location: '-', note: 'ปวดท้อง' },
  { date: '2025-11-18', time: '07:48', status: 'present', location: 'ประตู 1' },
  { date: '2025-11-17', time: '07:30', status: 'present', location: 'ประตู 1' },

  // --- October 2025 ---
  { date: '2025-10-31', time: '07:45', status: 'present', location: 'ประตู 1' },
  { date: '2025-10-30', time: '07:50', status: 'present', location: 'ประตู 2' },
  { date: '2025-10-29', time: '07:40', status: 'present', location: 'ประตู 1' },
  { date: '2025-10-28', time: '-', status: 'absent', location: '-', note: 'ขาดเรียน' },
  { date: '2025-10-27', time: '07:35', status: 'present', location: 'ประตู 1' },
  { date: '2025-10-23', time: '-', status: 'holiday', location: '-', note: 'วันปิยมหาราช' },
];

export default function AttendancePage() {
  const today = new Date();
  
  // State for Main Page Navigation
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(11); // 0-11 (11 = December)
  
  // State to highlight a specific selected day in the main view
  const [highlightDay, setHighlightDay] = useState<number | null>(null);

  // State for Modal
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Filter data for current month
  const monthlyData = useMemo(() => {
    return mockDatabase.filter(item => {
      const d = new Date(item.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [month, year]);

  // Calendar Logic (For Main Page)
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun
    
    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [month, year]);

  // Stats Logic
  const stats = useMemo(() => {
    return {
      present: monthlyData.filter(d => d.status === 'present').length,
      late: monthlyData.filter(d => d.status === 'late').length,
      absent: monthlyData.filter(d => ['sick', 'personal', 'absent'].includes(d.status)).length
    };
  }, [monthlyData]);

  // Handlers for Main Page
  const handlePrevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); } 
    else { setMonth(month - 1); }
    setHighlightDay(null);
  };

  const handleNextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); } 
    else { setMonth(month + 1); }
    setHighlightDay(null);
  };

  const handleResetToToday = () => {
    const now = new Date();
    setMonth(now.getMonth());
    setYear(now.getFullYear());
    setHighlightDay(now.getDate());
  };

  const getStatusColor = (status: AttendanceStatus, isBg = false) => {
    switch (status) {
      case 'present': return isBg ? 'bg-green-500' : 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'late': return isBg ? 'bg-yellow-500' : 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'sick': 
      case 'personal':
      case 'absent': return isBg ? 'bg-red-500' : 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'holiday': return isBg ? 'bg-blue-400' : 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      default: return isBg ? 'bg-gray-200' : 'text-gray-400 bg-gray-100';
    }
  };

  const getStatusDot = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = mockDatabase.find(d => d.date === dateStr);
    if (record) return <div className={`w-1.5 h-1.5 rounded-full mt-1 ${getStatusColor(record.status, true)}`}></div>;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 pb-32 transition-colors duration-300 relative">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 px-6 pt-10 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-indigo-600" />
            ตารางการมาเรียน
          </h1>
          
          <button 
            onClick={handleResetToToday}
            className="group w-11 h-11 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 flex flex-col items-center justify-center transition active:scale-95 border-2 border-white dark:border-zinc-800"
            title="กลับไปวันนี้"
          >
            <span className="text-[9px] font-bold uppercase leading-none opacity-90 mt-0.5">{monthsShortTh[today.getMonth()]}</span>
            <span className="text-lg font-bold leading-none">{today.getDate()}</span>
          </button>
        </div>

        {/* Calendar Navigation & Picker Trigger */}
        <div className="flex items-center justify-between bg-white dark:bg-zinc-800 p-1.5 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition">
            <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          
          {/* Trigger Custom Modal */}
          <button 
            className="relative group cursor-pointer px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition flex flex-col items-center justify-center min-w-40"
            onClick={() => setIsDatePickerOpen(true)}
          >
             <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  {monthsTh[month]} {year + 543}
                </span>
                <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-1 rounded-md">
                   <ChevronDown size={14} />
                </div>
             </div>
             <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-1">
               แตะเพื่อเปลี่ยน
             </span>
          </button>
          
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition">
            <ChevronRight size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="px-6 py-6 space-y-8">
        {/* Calendar Grid */}
        <section className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800">
          <div className="grid grid-cols-7 mb-2">
            {daysTh.map((day, i) => (
              <div key={i} className={`text-center text-xs font-semibold py-2 ${i === 0 || i === 6 ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-2">
            {calendarDays.map((day, index) => {
              if (day === null) return <div key={index} className="h-10"></div>;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const record = mockDatabase.find(d => d.date === dateStr);
              const isSelected = highlightDay === day;
              const isTodayReal = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

              return (
                <div key={index} className="flex flex-col items-center justify-center h-10 relative group cursor-pointer" onClick={() => setHighlightDay(day)}>
                  <div className={`w-8 h-8 flex flex-col items-center justify-center rounded-full text-sm font-medium transition-all
                    ${isSelected ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200 dark:ring-indigo-900' : 
                      isTodayReal ? 'bg-indigo-100 text-indigo-600 font-bold' : 
                      'text-gray-700 dark:text-gray-300 group-hover:bg-gray-50 dark:group-hover:bg-zinc-800'}
                    ${!isSelected && !isTodayReal && (record?.status === 'absent' || record?.status === 'sick') ? 'text-red-600' : ''}
                  `}>
                    {day}
                  </div>
                  {getStatusDot(day)}
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <span className="text-xs text-gray-500">มาเรียน</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
               <span className="text-xs text-gray-500">สาย</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-red-500"></div>
               <span className="text-xs text-gray-500">ลา/ขาด</span>
             </div>
          </div>
        </section>

        {/* Stats Summary */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm text-center">
            <span className="block text-2xl font-bold text-green-600 dark:text-green-500">{stats.present}</span>
            <span className="text-xs text-gray-500">มาเรียน</span>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm text-center">
            <span className="block text-2xl font-bold text-yellow-500">{stats.late}</span>
            <span className="text-xs text-gray-500">มาสาย</span>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm text-center">
            <span className="block text-2xl font-bold text-red-500">{stats.absent}</span>
            <span className="text-xs text-gray-500">ลา/ขาด</span>
          </div>
        </section>

        {/* Detail List */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">รายละเอียดประจำเดือน</h3>
          <div className="space-y-3">
            {monthlyData.length > 0 ? (
              monthlyData.map((item, index) => {
                 const itemDate = new Date(item.date).getDate();
                 const isHighlighted = highlightDay === itemDate;
                 return (
                  <div key={index} className={`bg-white dark:bg-zinc-900 p-4 rounded-2xl border shadow-sm flex items-center justify-between transition-all duration-300
                    ${isHighlighted ? 'border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-900/30 scale-[1.02]' : 'border-gray-100 dark:border-zinc-800 hover:border-indigo-100'}
                  `}>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-10">
                        <span className={`text-lg font-bold leading-none ${isHighlighted ? 'text-indigo-600' : 'text-gray-800 dark:text-white'}`}>{itemDate}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{getDayNameTh(item.date).substring(0, 3)}</span>
                      </div>
                      <div className="h-8 w-px bg-gray-100 dark:bg-zinc-800"></div>
                      <div>
                        <div className="flex items-center gap-2">
                          {item.status !== 'holiday' && item.time !== '-' ? (
                              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.time} น.</span>
                          ) : (
                              <span className="text-sm font-medium text-gray-400">{item.note || 'วันหยุด'}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {item.status !== 'holiday' && item.status !== 'absent' && item.status !== 'sick' && item.status !== 'personal' ? (
                              <>
                                <MapPin size={10} className="text-gray-400"/>
                                <span className="text-xs text-gray-500">{item.location}</span>
                              </>
                          ) : null}
                          {['late', 'sick', 'personal', 'absent'].includes(item.status) && item.note && (
                              <span className="text-xs text-red-400 flex items-center gap-1">
                                • {item.note}
                              </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${getStatusColor(item.status)}`}>
                      {item.status === 'present' ? 'มาปกติ' : 
                      item.status === 'late' ? 'สาย' : 
                      item.status === 'holiday' ? 'วันหยุด' : 'ลา/ขาด'}
                    </div>
                  </div>
                 );
              })
            ) : (
              <div className="text-center py-10 text-gray-400">
                ไม่มีข้อมูลของเดือนนี้
              </div>
            )}
          </div>
        </section>
      </main>

      {/* --- 🌟 Custom Full Date Picker Modal (Z-Index สูงสุดเพื่อทับ BottomNav) --- */}
      {isDatePickerOpen && (
        <FullDatePickerModal 
          initialMonth={month} 
          initialYear={year}
          initialDay={highlightDay || new Date().getDate()}
          onClose={() => setIsDatePickerOpen(false)}
          onConfirm={(d, m, y) => {
            setMonth(m);
            setYear(y);
            setHighlightDay(d);
            setIsDatePickerOpen(false);
          }}
        />
      )}
    </div>
  );
}

// --- Sub-Component: Full Date Picker Modal (Day/Month/Year) ---
function FullDatePickerModal({ initialMonth, initialYear, initialDay, onClose, onConfirm }: { 
  initialMonth: number; 
  initialYear: number;
  initialDay: number;
  onClose: () => void; 
  onConfirm: (d: number, m: number, y: number) => void;
}) {
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [view, setView] = useState<'calendar' | 'month' | 'year'>('calendar');

  // Generate Year Range
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + 1) - i);

  // Modal Calendar Logic
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();
  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);


  return (
    // ✅ z-[100] เพื่อให้ทับ BottomNav (ปกติ z-50)
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-indigo-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition">
            <X size={20} />
          </button>
          <div className="text-indigo-200 text-sm font-medium mb-1">เลือกวันที่</div>
          
          {/* Toggle Views */}
          <div className="flex items-end gap-2">
             <div 
               className="text-4xl font-bold cursor-pointer hover:opacity-80 transition"
               onClick={() => setView('calendar')}
             >
               {selectedDay}
             </div>
             <div className="flex flex-col mb-1.5 cursor-pointer hover:opacity-80 transition" onClick={() => setView('month')}>
                <span className="text-lg font-semibold leading-none">{monthsTh[selectedMonth]}</span>
                <span className="text-sm font-light leading-none opacity-80" onClick={(e) => { e.stopPropagation(); setView('year'); }}>{selectedYear + 543}</span>
             </div>
             <ChevronDown size={20} className="mb-2 opacity-50" />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 h-85 overflow-y-auto">
          
          {/* View 1: Calendar Grid (Select Day) */}
          {view === 'calendar' && (
            <div className="animate-in slide-in-from-right-4 duration-200">
               <div className="flex justify-between items-center mb-4 px-2">
                  <span className="font-bold text-gray-700 dark:text-gray-200">{monthsTh[selectedMonth]} {selectedYear + 543}</span>
                  <div className="flex gap-2">
                     <button className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full" onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}>
                        <ChevronLeft size={20} className="text-gray-500" />
                     </button>
                     <button className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full" onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)}>
                        <ChevronRight size={20} className="text-gray-500" />
                     </button>
                  </div>
               </div>
               <div className="grid grid-cols-7 mb-2 text-center">
                  {daysTh.map((d, i) => <div key={i} className="text-xs text-gray-400 font-medium">{d}</div>)}
               </div>
               <div className="grid grid-cols-7 gap-y-2">
                  {days.map((d, i) => {
                     if (!d) return <div key={i}></div>;
                     const isSel = d === selectedDay;
                     return (
                        <button 
                           key={i} 
                           onClick={() => setSelectedDay(d)}
                           className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mx-auto transition-all
                              ${isSel ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'}
                           `}
                        >
                           {d}
                        </button>
                     )
                  })}
               </div>
            </div>
          )}

          {/* View 2: Month Selector */}
          {view === 'month' && (
            <div className="grid grid-cols-3 gap-3 animate-in zoom-in-95 duration-200">
              {monthsTh.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedMonth(idx); setView('calendar'); }}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 border
                    ${selectedMonth === idx 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                      : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-transparent hover:border-indigo-200 dark:hover:border-zinc-700'
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {/* View 3: Year Selector */}
          {view === 'year' && (
            <div className="space-y-2 animate-in zoom-in-95 duration-200">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">เลือกปี</div>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => { setSelectedYear(y); setView('month'); }}
                  className={`w-full p-4 rounded-xl text-lg font-bold flex justify-between items-center transition-all duration-200
                    ${selectedYear === y 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
                      : 'hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <span>{y + 543}</span>
                  <span className="text-sm font-normal text-gray-400">{y}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3 bg-gray-50 dark:bg-zinc-900/50">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-zinc-800 transition"
          >
            ยกเลิก
          </button>
          <button 
            onClick={() => onConfirm(selectedDay, selectedMonth, selectedYear)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 transition-all active:scale-95"
          >
            ตกลง
          </button>
        </div>

      </div>
    </div>
  );
}