// components/StudentDashboard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useNotification } from "../context/NotificationContext"; 
import { 
  ScanLine, Home, CalendarDays, Bell, User, Clock, MapPin, ChevronRight, CheckCircle2
} from "lucide-react";

export default function StudentDashboard() {
  const { unreadCount } = useNotification();

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] dark:bg-zinc-950 transition-colors duration-300 pb-24 min-h-screen">
      
      {/* --- ส่วนหัว (Header) --- */}
      <header className="px-6 pt-12 pb-6 bg-white dark:bg-zinc-900 rounded-b-3xl shadow-sm sticky top-0 z-10 transition-colors duration-300">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">สวัสดีตอนเช้า 👋,</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">นายเอ็ม ออนิว</h1>
            <p className="text-gray-400 text-xs mt-1">รหัสนักเรียน: 66160xxx</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg border-2 border-white dark:border-zinc-700 shadow-sm">
            M
          </div>
        </div>
      </header>

      {/* --- เนื้อหาหลัก --- */}
      <main className="px-6 py-6 space-y-6 overflow-y-auto">
        {/* 1. สถิติการเรียน */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">สถิติการเรียนในเดือนนี้</h2>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="มาเรียน" value="28" color="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" />
            <StatCard label="ขาดเรียน" value="2" color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" />
            <StatCard label="ลา/สาย" value="1" color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />
          </div>
        </section>

        {/* 2. คาบเรียนถัดไป */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">คาบเรียนถัดไป</h2>
            <Link href="/schedule">
              <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center">
                ดูตารางเรียนเต็ม <ChevronRight size={14} />
              </button>
            </Link>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none mb-4 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white opacity-10 rounded-full"></div>
            <div className="flex justify-between items-start mb-6">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                13:00 - 14:00
              </span>
              <Clock className="w-5 h-5 text-indigo-100" />
            </div>
            <h3 className="text-2xl font-bold mb-1">ว31211 ฟิสิกส์เทคโนโลยี</h3>
            <p className="text-indigo-100 text-sm mb-4 opacity-90">9A01 • อ.เอ็มออนิว</p>
            <div className="flex items-center gap-2 bg-white/20 w-fit px-4 py-2 rounded-xl backdrop-blur-md">
              <MapPin size={16} />
              <span className="text-sm font-semibold">ห้อง LAB 01</span>
            </div>
          </div>

          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3">คาบเรียนหลังจากนั้น</h3>
          <div className="grid grid-cols-2 gap-3">
            <SubjectCard time="14:00 - 15:00" subject="สุขศึกษาฯ" room="ห้อง 4A02" />
            <SubjectCard time="15:00 - 16:00" subject="คณิตศาสตร์" room="ห้อง 911" />
          </div>
        </section>

        {/* 3. ประวัติล่าสุด */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">ประวัติล่าสุด</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4 transition-colors duration-300">
            <HistoryItem subject="เคมีวิทยา" status="เข้าสาย 15 นาที" time="45 นาทีที่แล้ว" isLate={true} />
            <div className="border-t border-gray-100 dark:border-zinc-800"></div>
            <HistoryItem subject="ชีววิทยา" status="ทันเวลา" time="1 ชั่วโมง 15 นาทีที่แล้ว" isLate={false} />
          </div>
        </section>
      </main>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 px-6 py-4 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50 transition-colors duration-300">
        <div className="flex justify-between items-center relative">
          <Link href="/dashboard"><NavItem icon={<Home size={24} />} label="ภาพรวม" active /></Link>
          <Link href="/schedule"><NavItem icon={<CalendarDays size={24} />} label="ตารางเรียน" /></Link>
          <div className="relative -top-8">
            <Link href="/scan">
              <div className="bg-indigo-600 dark:bg-indigo-500 p-4 rounded-full shadow-lg shadow-indigo-300 dark:shadow-indigo-900 ring-4 ring-white dark:ring-zinc-900 cursor-pointer transform transition active:scale-95">
                <ScanLine size={28} color="white" />
              </div>
            </Link>
          </div>
          <Link href="/notifications"><NavItem icon={<Bell size={24} />} label="แจ้งเตือน" hasBadge={unreadCount > 0} /></Link>
          <Link href="/account"><NavItem icon={<User size={24} />} label="บัญชี" /></Link>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components ---
function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-1 ${color}`}>
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-xs opacity-80 font-medium">{label}</span>
    </div>
  );
}

function SubjectCard({ time, subject, room }: { time: string, subject: string, room: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-full transition-colors duration-300">
      <div className="flex items-center gap-2 mb-2">
         <div className="w-1 h-8 bg-gray-200 dark:bg-zinc-700 rounded-full"></div>
         <div>
            <p className="text-xs text-gray-400">{time}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{subject}</p>
         </div>
      </div>
      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-lg w-fit">
        <MapPin size={12} />
        {room}
      </div>
    </div>
  );
}

function HistoryItem({ subject, status, time, isLate }: { subject: string, status: string, time: string, isLate: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`p-2 rounded-full mt-1 ${isLate ? 'bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-400'}`}>
        {isLate ? <Clock size={20} /> : <CheckCircle2 size={20} />}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-semibold text-gray-900 dark:text-gray-200">{subject}</h4>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <p className={`text-sm ${isLate ? 'text-orange-500 dark:text-orange-400' : 'text-green-600 dark:text-green-400'} font-medium`}>
          {status}
        </p>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, hasBadge = false }: { icon: React.ReactNode, label: string, active?: boolean, hasBadge?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-zinc-500'}`}>
      <div className="relative">
        {icon}
        {hasBadge && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}