// components/ParentDashboard.tsx
"use client";

import React from "react";
import { 
  ShieldCheck, MapPin, Clock, BookOpen, AlertCircle, ChevronRight 
} from "lucide-react";

export default function ParentDashboard() {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] dark:bg-zinc-950 transition-colors duration-300 pb-24 min-h-screen">
      
      {/* --- Header ผู้ปกครอง --- */}
      <header className="px-6 pt-12 pb-6 bg-white dark:bg-zinc-900 rounded-b-3xl shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-600 shadow-md">
             {/* ใส่รูปโปรไฟล์ลูก */}
           </div>
           <div>
             <h1 className="text-xl font-bold text-gray-900 dark:text-white">น้องทินภัทร</h1>
             <p className="text-gray-500 dark:text-gray-400 text-xs">ม.5/1 • เลขที่ 14</p>
             <div className="flex items-center gap-1 mt-1 text-green-600 dark:text-green-400 text-xs font-medium">
               <ShieldCheck size={12} />
               <span>บัญชีผู้ปกครองยืนยันแล้ว</span>
             </div>
           </div>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        
        {/* 1. สถานะปัจจุบัน (Safety Status) */}
        <section>
          <div className="bg-green-500 rounded-3xl p-6 text-white shadow-lg shadow-green-200 dark:shadow-none relative overflow-hidden flex items-center justify-between">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white opacity-20 rounded-full"></div>
            <div>
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <MapPin size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">สถานะปัจจุบัน</span>
              </div>
              <h2 className="text-2xl font-bold">อยู่ในโรงเรียน</h2>
              <p className="text-green-50 text-sm mt-1">เช็คชื่อเมื่อ 07:45 น. (ประตู 1)</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
               <ShieldCheck size={32} />
            </div>
          </div>
        </section>

        {/* 2. ไทม์ไลน์วันนี้ (Timeline) */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">กิจกรรมวันนี้</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800">
             
             {/* Item 1 */}
             <TimelineItem time="07:45" title="ถึงโรงเรียน" subtitle="สแกนบัตรที่ป้อมยาม" icon={<MapPin size={14}/>} active />
             {/* Item 2 */}
             <TimelineItem time="08:30" title="เข้าแถวเคารพธงชาติ" subtitle="เช็คชื่อโดย ครูสมศรี" icon={<ShieldCheck size={14}/>} active />
             {/* Item 3 */}
             <TimelineItem time="09:20" title="วิชาชีววิทยา" subtitle="กำลังเรียน..." icon={<BookOpen size={14}/>} isCurrent />
             {/* Item 4 */}
             <TimelineItem time="12:00" title="พักเที่ยง" subtitle="-" icon={<Clock size={14}/>} last />

          </div>
        </section>

        {/* 3. การบ้านที่ต้องส่ง (Homework) */}
        <section>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">การบ้านคงค้าง</h2>
             <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-1 rounded-full font-bold">2 งาน</span>
          </div>
          <div className="space-y-3">
             <HomeworkItem subject="คณิตศาสตร์" title="แบบฝึกหัดท้ายบทที่ 4" deadline="พรุ่งนี้" />
             <HomeworkItem subject="ภาษาอังกฤษ" title="อัดคลิปแนะนำตัว" deadline="ศุกร์นี้" />
          </div>
        </section>

      </main>
    </div>
  );
}

// --- Sub-Components ---
function TimelineItem({ time, title, subtitle, icon, active, isCurrent, last }: any) {
  return (
    <div className="flex gap-4 relative">
      {!last && <div className="absolute left-[15px] top-8 bottom-[-8px] w-0.5 bg-gray-100 dark:bg-zinc-800"></div>}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${isCurrent ? 'bg-indigo-600 text-white shadow-md' : active ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-gray-100 text-gray-400 dark:bg-zinc-800'}`}>
        {icon}
      </div>
      <div className="pb-6">
        <p className="text-xs text-gray-400 font-medium mb-0.5">{time}</p>
        <h4 className={`text-sm font-bold ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-800 dark:text-gray-200'}`}>{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function HomeworkItem({ subject, title, deadline }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 flex justify-between items-center">
       <div>
          <span className="text-[10px] font-bold bg-gray-100 dark:bg-zinc-800 text-gray-500 px-2 py-0.5 rounded-md mb-1 inline-block">{subject}</span>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</p>
       </div>
       <div className="text-right">
          <p className="text-xs text-red-500 font-medium">ส่ง: {deadline}</p>
          <ChevronRight size={16} className="text-gray-300 ml-auto mt-1" />
       </div>
    </div>
  );
}