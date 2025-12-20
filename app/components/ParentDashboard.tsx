"use client";

import React from "react";
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  BookOpen, 
} from "lucide-react";

// --- Mock Data: ข้อมูลจำลอง (ของจริงดึงจาก API นะเพื่อน) ---
const studentProfile = {
  name: "น้องเอ็ม ออนิว",
  classInfo: "ม.5/1 • เลขที่ 14",
  status: "verified", // verified, unverified
  imageUrl: "" // ใส่ URL รูปถ้ามี
};

const currentStatus = {
  title: "อยู่ในโรงเรียน",
  detail: "เช็คชื่อเมื่อ 07:45 น. (ประตู 1)",
  isSafe: true // true = สีเขียว, false = สีอื่น
};

const timelineData = [
  { time: "07:45", title: "ถึงโรงเรียน", subtitle: "สแกนบัตรที่ป้อมยาม", icon: <MapPin size={14}/>, active: true },
  { time: "08:30", title: "เข้าแถวเคารพธงชาติ", subtitle: "เช็คชื่อโดย ครูสมศรี", icon: <ShieldCheck size={14}/>, active: true },
  { time: "09:20", title: "วิชาชีววิทยา", subtitle: "กำลังเรียน...", icon: <BookOpen size={14}/>, isCurrent: true },
  { time: "12:00", title: "พักเที่ยง", subtitle: "-", icon: <Clock size={14}/>, last: true }
];

const homeworkData = [
  { subject: "คณิตศาสตร์", title: "แบบฝึกหัดท้ายบทที่ 4", deadline: "พรุ่งนี้" },
  { subject: "ภาษาอังกฤษ", title: "อัดคลิปแนะนำตัว", deadline: "ศุกร์นี้" }
];

export default function ParentDashboard() {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] dark:bg-zinc-950 transition-colors duration-300 pb-24 min-h-screen">
      
      {/* --- Header ผู้ปกครอง --- */}
      <header className="px-6 pt-8 pb-6 bg-white dark:bg-zinc-900 rounded-b-3xl shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-600 shadow-md flex items-center justify-center overflow-hidden">
             {/* รูปโปรไฟล์ หรือ Placeholder */}
             {studentProfile.imageUrl ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img src={studentProfile.imageUrl} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <span className="text-2xl">👦</span>
             )}
           </div>
           <div>
             <h1 className="text-xl font-bold text-gray-900 dark:text-white">{studentProfile.name}</h1>
             <p className="text-gray-500 dark:text-gray-400 text-xs">{studentProfile.classInfo}</p>
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
          <div className={`${currentStatus.isSafe ? 'bg-green-500 shadow-green-200' : 'bg-yellow-500 shadow-yellow-200'} rounded-3xl p-6 text-white shadow-lg dark:shadow-none relative overflow-hidden flex items-center justify-between transition-colors`}>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white opacity-20 rounded-full"></div>
            <div>
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <MapPin size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">สถานะปัจจุบัน</span>
              </div>
              <h2 className="text-2xl font-bold">{currentStatus.title}</h2>
              <p className="text-white/90 text-sm mt-1">{currentStatus.detail}</p>
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
             {timelineData.map((item, index) => (
               <TimelineItem 
                 key={index}
                 time={item.time} 
                 title={item.title} 
                 subtitle={item.subtitle} 
                 icon={item.icon} 
                 active={item.active}
                 isCurrent={item.isCurrent}
                 last={item.last}
               />
             ))}
          </div>
        </section>

        {/* 3. การบ้านที่ต้องส่ง (Homework) */}
        <section>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">การบ้านคงค้าง</h2>
             <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-1 rounded-full font-bold">
               {homeworkData.length} งาน
             </span>
          </div>
          <div className="space-y-3">
             {homeworkData.map((hw, index) => (
               <HomeworkItem key={index} subject={hw.subject} title={hw.title} deadline={hw.deadline} />
             ))}
          </div>
        </section>

      </main>
    </div>
  );
}

// --- Sub-Components & Types ---

// ✅ 1. Interface & Component สำหรับ TimelineItem
interface TimelineItemProps {
  time: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode; 
  active?: boolean;
  isCurrent?: boolean;
  last?: boolean;
}

function TimelineItem({ time, title, subtitle, icon, active, isCurrent, last }: TimelineItemProps) {
  return (
    <div className="flex gap-4 relative">
      {/* เส้นเชื่อม timeline (ถ้าไม่ใช่ตัวสุดท้าย) */}
      {!last && (
        <div className="absolute left-3.5 top-8 -bottom-2 w-0.5 bg-gray-100 dark:bg-zinc-800"></div>
      )}
      
      {/* Icon Circle */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 transition-colors
        ${isCurrent ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none ring-4 ring-indigo-100 dark:ring-indigo-900/30' : 
          active ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
          'bg-gray-100 text-gray-400 dark:bg-zinc-800'}`}>
        {icon}
      </div>

      {/* Content */}
      <div className={`pb-6 ${last ? 'pb-0' : ''}`}>
        <p className={`text-xs font-medium mb-0.5 ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
          {time}
        </p>
        <h4 className={`text-sm font-bold ${isCurrent ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>
          {title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

// ✅ 2. Interface & Component สำหรับ HomeworkItem
interface HomeworkItemProps {
  subject: string;
  title: string;
  deadline: string;
}

function HomeworkItem({ subject, title, deadline }: HomeworkItemProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 flex justify-between items-center hover:border-blue-200 transition-colors cursor-pointer group shadow-sm">
       <div>
          <span className="text-[10px] font-bold bg-gray-100 dark:bg-zinc-800 text-gray-500 px-2 py-0.5 rounded-md mb-1 inline-block group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
            {subject}
          </span>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</p>
       </div>
       <div className="text-right">
          <p className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded-lg">
            ส่ง: {deadline}
          </p>
       </div>
    </div>
  );
}