// app/schedule/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
// 1. Import Hook จาก Context
import { useNotification } from "../context/NotificationContext"; 
import { 
  Home, 
  CalendarDays, 
  Bell, 
  User, 
  ScanLine, 
  Clock, 
  MapPin, 
  MoreVertical,
  BookOpen,
  Coffee,
  Beaker
} from "lucide-react";

// --- Types ---
type ClassSession = {
  id: string;
  time: string;
  subject: string;
  code: string;
  room: string;
  teacher: string;
  type: 'class' | 'break';
  status: 'finished' | 'current' | 'upcoming';
  color: string;
};

// --- Mock Data: ตารางเรียนสายวิทย์-คณิต (M.5) ---
const fullWeeklySchedule: Record<string, ClassSession[]> = {
  "Monday": [
    { id: 'm1', time: '08:30 - 09:20', subject: 'ชีววิทยา 1', code: 'ว30241', room: 'LAB Bio', teacher: 'อ.สมศรี', type: 'class', status: 'upcoming', color: 'bg-teal-100 text-teal-800' },
    { id: 'm2', time: '09:20 - 10:10', subject: 'ชีววิทยา 1', code: 'ว30241', room: 'LAB Bio', teacher: 'อ.สมศรี', type: 'class', status: 'upcoming', color: 'bg-teal-100 text-teal-800' },
    { id: 'm3', time: '10:10 - 11:00', subject: 'คณิตศาสตร์เพิ่มเติม', code: 'ค30201', room: '911', teacher: 'อ.ศักดิ์ดา', type: 'class', status: 'upcoming', color: 'bg-red-100 text-red-800' },
    { id: 'm4', time: '11:00 - 11:50', subject: 'ภาษาอังกฤษหลัก', code: 'อ30101', room: 'Sound Lab', teacher: 'T.Andrew', type: 'class', status: 'upcoming', color: 'bg-purple-100 text-purple-800' },
    { id: 'm5', time: '13:00 - 13:50', subject: 'ภาษาไทย', code: 'ท30101', room: '4A02', teacher: 'อ.กานดา', type: 'class', status: 'upcoming', color: 'bg-orange-100 text-orange-800' },
    { id: 'm6', time: '13:50 - 14:40', subject: 'สังคมศึกษา', code: 'ส30101', room: '322', teacher: 'อ.ปราณี', type: 'class', status: 'upcoming', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'm7', time: '14:40 - 15:30', subject: 'กิจกรรมแนะแนว', code: 'ก30901', room: 'ห้องโถง', teacher: 'อ.ที่ปรึกษา', type: 'class', status: 'upcoming', color: 'bg-gray-200 text-gray-700' },
  ],
  "Tuesday": [
    { id: 't1', time: '08:30 - 09:20', subject: 'ฟิสิกส์ 1', code: 'ว30201', room: 'LAB Phy', teacher: 'อ.วิชัย', type: 'class', status: 'upcoming', color: 'bg-blue-100 text-blue-800' },
    { id: 't2', time: '09:20 - 10:10', subject: 'ฟิสิกส์ 1', code: 'ว30201', room: 'LAB Phy', teacher: 'อ.วิชัย', type: 'class', status: 'upcoming', color: 'bg-blue-100 text-blue-800' },
    { id: 't3', time: '10:10 - 11:00', subject: 'คณิตศาสตร์พื้นฐาน', code: 'ค31101', room: '912', teacher: 'อ.สมชาย', type: 'class', status: 'upcoming', color: 'bg-red-50 text-red-700' },
    { id: 't4', time: '11:00 - 11:50', subject: 'วิทยาการคำนวณ', code: 'ว30103', room: 'Com Lab 1', teacher: 'อ.Tech', type: 'class', status: 'upcoming', color: 'bg-indigo-100 text-indigo-800' },
    { id: 't5', time: '13:00 - 13:50', subject: 'ประวัติศาสตร์', code: 'ส30103', room: '324', teacher: 'อ.มั่นคง', type: 'class', status: 'upcoming', color: 'bg-amber-100 text-amber-800' },
    { id: 't6', time: '13:50 - 14:40', subject: 'สุขศึกษา', code: 'พ30101', room: '4A05', teacher: 'อ.รักดี', type: 'class', status: 'upcoming', color: 'bg-green-100 text-green-800' },
    { id: 't7', time: '14:40 - 15:30', subject: 'กิจกรรมชุมนุม', code: 'ก30902', room: '-', teacher: '-', type: 'class', status: 'upcoming', color: 'bg-pink-100 text-pink-800' },
  ],
  "Wednesday": [
    { id: 'w1', time: '08:30 - 09:20', subject: 'เคมี 1', code: 'ว30221', room: 'LAB Chem', teacher: 'อ.อุษา', type: 'class', status: 'finished', color: 'bg-cyan-100 text-cyan-800' },
    { id: 'w2', time: '09:20 - 10:10', subject: 'เคมี 1', code: 'ว30221', room: 'LAB Chem', teacher: 'อ.อุษา', type: 'class', status: 'finished', color: 'bg-cyan-100 text-cyan-800' },
    { id: 'w3', time: '10:10 - 11:00', subject: 'ภาษาอังกฤษฟัง-พูด', code: 'อ30201', room: 'Sound Lab', teacher: 'T.Jessica', type: 'class', status: 'finished', color: 'bg-purple-100 text-purple-800' },
    { id: 'w4', time: '11:00 - 11:50', subject: 'คณิตศาสตร์เพิ่มเติม', code: 'ค30201', room: '911', teacher: 'อ.ศักดิ์ดา', type: 'class', status: 'finished', color: 'bg-red-100 text-red-800' },
    { id: 'w5', time: '13:00 - 13:50', subject: 'ศิลปะ (ทัศนศิลป์)', code: 'ศ31101', room: 'Art Room', teacher: 'อ.ติสท์', type: 'class', status: 'current', color: 'bg-fuchsia-100 text-fuchsia-800' },
    { id: 'w6', time: '13:50 - 14:40', subject: 'ลูกเสือ/รด.', code: 'ก30903', room: 'สนาม', teacher: 'ครูฝึก', type: 'class', status: 'upcoming', color: 'bg-green-700 text-white' },
    { id: 'w7', time: '14:40 - 15:30', subject: 'ศึกษาค้นคว้า', code: 'I30201', room: 'Library', teacher: 'อ.บรรณารักษ์', type: 'class', status: 'upcoming', color: 'bg-gray-100 text-gray-600' },
  ],
  "Thursday": [
    { id: 'th1', time: '08:30 - 09:20', subject: 'คณิตศาสตร์เพิ่มเติม', code: 'ค30201', room: '911', teacher: 'อ.ศักดิ์ดา', type: 'class', status: 'upcoming', color: 'bg-red-100 text-red-800' },
    { id: 'th2', time: '09:20 - 10:10', subject: 'คณิตศาสตร์พื้นฐาน', code: 'ค31101', room: '912', teacher: 'อ.สมชาย', type: 'class', status: 'upcoming', color: 'bg-red-50 text-red-700' },
    { id: 'th3', time: '10:10 - 11:00', subject: 'ชีววิทยา 1', code: 'ว30241', room: 'LAB Bio', teacher: 'อ.สมศรี', type: 'class', status: 'upcoming', color: 'bg-teal-100 text-teal-800' },
    { id: 'th4', time: '11:00 - 11:50', subject: 'ภาษาอังกฤษอ่าน-เขียน', code: 'อ30202', room: '4A01', teacher: 'อ.สุดา', type: 'class', status: 'upcoming', color: 'bg-purple-50 text-purple-700' },
    { id: 'th5', time: '13:00 - 13:50', subject: 'โลกและดาราศาสตร์', code: 'ว30104', room: 'Dome', teacher: 'อ.ดารา', type: 'class', status: 'upcoming', color: 'bg-slate-100 text-slate-800' },
    { id: 'th6', time: '13:50 - 14:40', subject: 'ภาษาไทย', code: 'ท30101', room: '4A02', teacher: 'อ.กานดา', type: 'class', status: 'upcoming', color: 'bg-orange-100 text-orange-800' },
    { id: 'th7', time: '14:40 - 15:30', subject: 'การงานอาชีพ', code: 'ง30101', room: 'Workshop', teacher: 'อ.ขยัน', type: 'class', status: 'upcoming', color: 'bg-lime-100 text-lime-800' },
  ],
  "Friday": [
    { id: 'f1', time: '08:30 - 09:20', subject: 'ฟิสิกส์ 1', code: 'ว30201', room: 'LAB Phy', teacher: 'อ.วิชัย', type: 'class', status: 'upcoming', color: 'bg-blue-100 text-blue-800' },
    { id: 'f2', time: '09:20 - 10:10', subject: 'เคมี 1', code: 'ว30221', room: 'LAB Chem', teacher: 'อ.อุษา', type: 'class', status: 'upcoming', color: 'bg-cyan-100 text-cyan-800' },
    { id: 'f3', time: '10:10 - 11:00', subject: 'สังคมศึกษา', code: 'ส30101', room: '322', teacher: 'อ.ปราณี', type: 'class', status: 'upcoming', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'f4', time: '11:00 - 11:50', subject: 'คณิตศาสตร์เพิ่มเติม', code: 'ค30201', room: '911', teacher: 'อ.ศักดิ์ดา', type: 'class', status: 'upcoming', color: 'bg-red-100 text-red-800' },
    { id: 'f5', time: '13:00 - 13:50', subject: 'พลศึกษา', code: 'พ30102', room: 'Gym', teacher: 'อ.แข็งแรง', type: 'class', status: 'upcoming', color: 'bg-green-100 text-green-800' },
    { id: 'f6', time: '13:50 - 14:40', subject: 'ภาษาอังกฤษหลัก', code: 'อ30101', room: 'Sound Lab', teacher: 'T.Andrew', type: 'class', status: 'upcoming', color: 'bg-purple-100 text-purple-800' },
    { id: 'f7', time: '14:40 - 15:30', subject: 'สาธารณะประโยชน์', code: '-', room: '-', teacher: 'ครูที่ปรึกษา', type: 'class', status: 'upcoming', color: 'bg-gray-200 text-gray-600' },
  ],
};

const daysOfWeek = ["จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์"];

export default function SchedulePage() {
  // 2. เรียกใช้ข้อมูล unreadCount จาก Context
  const { unreadCount } = useNotification(); 

  const [activeTab, setActiveTab] = useState<'today' | 'weekly'>('today');
  const [selectedDay, setSelectedDay] = useState<string>("พุธ");

  const currentSchedule = activeTab === 'today' 
    ? fullWeeklySchedule["Wednesday"] 
    : (fullWeeklySchedule[mapDayToKey(selectedDay)] || []);

  function mapDayToKey(day: string) {
    const map: Record<string, string> = {
      "จันทร์": "Monday",
      "อังคาร": "Tuesday",
      "พุธ": "Wednesday",
      "พฤหัส": "Thursday",
      "ศุกร์": "Friday"
    };
    return map[day] || "Monday";
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8F9FA] pb-24">
      
      {/* --- Header --- */}
      <header className="bg-white px-6 pt-12 pb-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">ตารางเรียน 📅</h1>
          <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
             <MoreVertical size={20} className="text-gray-500"/>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'today' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            วันนี้
          </button>
          <button 
             onClick={() => setActiveTab('weekly')}
             className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'weekly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            รายสัปดาห์
          </button>
        </div>
      </header>

      {/* --- Content Area --- */}
      <main className="px-6 py-6 flex-1 overflow-y-auto">
        
        {/* Weekly Day Selector */}
        {activeTab === 'weekly' && (
          <div className="flex justify-between gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedDay === day 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        )}

        {/* Timeline View */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-500 text-sm font-medium">
              {activeTab === 'today' ? 'วันพุธที่ 14 กุมภาพันธ์' : `ตารางเรียนวัน${selectedDay}`}
            </span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {currentSchedule.length > 0 ? (
            currentSchedule.map((session, index) => {
              const showLunchBreak = index > 0 && 
                session.time.startsWith('13:00') && 
                currentSchedule[index-1].time.endsWith('11:50');

              return (
                <React.Fragment key={session.id}>
                  {showLunchBreak && (
                    <div className="flex items-center gap-4 py-2 opacity-50">
                       <div className="w-[40px] flex justify-center">
                          <Coffee size={16} className="text-gray-400"/>
                       </div>
                       <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                       <span className="text-xs font-medium text-gray-400">พักเที่ยง (12:00 - 13:00)</span>
                       <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                    </div>
                  )}

                  <div className="flex gap-4 relative">
                    {index !== currentSchedule.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-[-16px] w-[2px] bg-gray-200 z-0"></div>
                    )}

                    <div className="flex flex-col items-center gap-1 z-10 min-w-[40px]">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#F8F9FA] ${
                        session.status === 'current' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 
                        session.status === 'finished' ? 'bg-gray-300 text-white' : 'bg-white border-indigo-100 text-indigo-600'
                      }`}>
                         {session.subject.includes('เคมี') || session.subject.includes('ฟิสิกส์') || session.subject.includes('ชีว') 
                            ? <Beaker size={18} /> 
                            : session.status === 'finished' ? <BookOpen size={16} /> : <Clock size={18} />
                         }
                      </div>
                    </div>

                    <div className={`flex-1 p-4 rounded-2xl border transition-all ${
                      session.status === 'current' 
                      ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-100' 
                      : session.status === 'finished'
                        ? 'bg-gray-50 border-gray-100 opacity-70 grayscale-[0.5]'
                        : 'bg-white border-gray-100 shadow-sm'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${session.color}`}>
                          {session.code}
                        </span>
                        <span className="text-xs font-medium text-gray-400">{session.time}</span>
                      </div>
                      
                      <h3 className={`font-bold text-lg mb-1 truncate ${session.status === 'finished' ? 'text-gray-600' : 'text-gray-800'}`}>
                        {session.subject}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          {session.teacher}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {session.room}
                        </div>
                      </div>

                      {session.status === 'current' && (
                         <div className="mt-3 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-medium text-green-600">กำลังเรียนอยู่</span>
                         </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
             <div className="flex flex-col items-center justify-center py-12 text-gray-400">
               <CalendarDays size={48} className="mb-4 opacity-50" />
               <p>ไม่มีตารางเรียนในวันนี้</p>
            </div>
          )}

          {currentSchedule.length > 0 && (
             <div className="flex items-center justify-center gap-2 py-4 opacity-50 mt-4">
                 <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                 <span className="text-xs text-gray-400">เลิกเรียน</span>
             </div>
          )}

        </div>
      </main>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-6 py-4 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50">
        <div className="flex justify-between items-center relative">
          <Link href="/dashboard">
             <NavItem icon={<Home size={24} />} label="ภาพรวม" />
          </Link>
          
          <Link href="/schedule">
            <NavItem icon={<CalendarDays size={24} />} label="ตารางเรียน" active />
          </Link>
          
          <div className="relative -top-8">
            <Link href="/scan">
              <div className="bg-indigo-600 p-4 rounded-full shadow-lg shadow-indigo-300 ring-4 ring-white cursor-pointer transform transition active:scale-95">
                <ScanLine size={28} color="white" />
              </div>
            </Link>
          </div>
          <Link href="/notifications">
            <NavItem icon={<Bell size={24} />} label="แจ้งเตือน" hasBadge={unreadCount > 0} />
          </Link>
          <Link href="/account">
             <NavItem icon={<User size={24} />} label="บัญชี" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ใช้ React.ReactNode เหมือนไฟล์อื่นๆ
function NavItem({ icon, label, active = false, hasBadge = false }: { icon: React.ReactNode, label: string, active?: boolean, hasBadge?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 cursor-pointer ${active ? 'text-indigo-600' : 'text-gray-400'}`}>
      <div className="relative">
        {icon}
        {hasBadge && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}