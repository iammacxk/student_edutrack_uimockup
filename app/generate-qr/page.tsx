"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, Users, MapPin, 
  RefreshCw, AlertCircle, Clock, CheckCircle2
} from "lucide-react";

interface ClassSlot {
  id: number;
  time: string;
  subject: string;
  room: string;
  class: string;
  code: string;
  isMock?: boolean; // Flag สำหรับวิชา Mockup
}

export default function GenerateQRPage() {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<ClassSlot | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null); 
  const [classes, setClasses] = useState<ClassSlot[]>([]);

  useEffect(() => {
    // ✅ ใช้ setTimeout(..., 0) เพื่อแก้ Error: Calling setState synchronously
    const initData = setTimeout(() => {
      const now = new Date();
      setCurrentTime(now);

      // --- สร้างข้อมูลวิชา (Mock Data) ---
      const staticClasses: ClassSlot[] = [
        { id: 1, time: "08:30 - 09:20", subject: "ฟิสิกส์ 1", room: "LAB Phy", class: "ม.5/1", code: "ว30201" },
        { id: 2, time: "09:20 - 10:10", subject: "ฟิสิกส์ 1", room: "LAB Phy", class: "ม.5/1", code: "ว30201" },
        { id: 3, time: "11:00 - 11:50", subject: "วิทย์พื้นฐาน", room: "402", class: "ม.4/3", code: "ว30101" },
        { id: 4, time: "13:50 - 14:40", subject: "ฟิสิกส์ 2", room: "LAB Phy", class: "ม.6/1", code: "ว30205" },
      ];

      // --- 🌟 สร้างวิชา "กำลังสอน" อัตโนมัติ (Demo Mode) ---
      const currentHour = now.getHours();
      const nextHour = currentHour + 1;
      const formatTime = (h: number) => h.toString().padStart(2, '0');
      
      const mockTime = `${formatTime(currentHour)}:00 - ${formatTime(nextHour)}:00`;

      const demoClass: ClassSlot = {
        id: 999,
        time: mockTime,
        subject: "วิทยาการคำนวณ (Demo)",
        room: "Computer Lab",
        class: "ม.6/2",
        code: "ว30118",
        isMock: true
      };

      setClasses([...staticClasses, demoClass]);
    }, 0);

    // Update เวลาทุกนาที
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    return () => {
      clearTimeout(initData);
      clearInterval(timer);
    };
  }, []);

  // ✅ Wrap ด้วย useCallback เพื่อให้ useMemo ใช้งานได้โดยไม่ Re-render พร่ำเพรื่อ
  const getClassStatus = useCallback((timeRange: string) => {
    if (!currentTime) return "upcoming"; 

    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startStr, endStr] = timeRange.split(" - ");
    const [startH, startM] = startStr.split(":").map(Number);
    const [endH, endM] = endStr.split(":").map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) return "now";
    if (currentMinutes < startMinutes) return "upcoming";
    return "past";
  }, [currentTime]); // Dependency คือ currentTime

  // ✅ Sorting Logic: ใช้ getClassStatus ใน dependency
  const sortedClasses = useMemo(() => {
    return [...classes].sort((a, b) => {
      const statusA = getClassStatus(a.time);
      const statusB = getClassStatus(b.time);

      const getPriority = (status: string) => {
        if (status === 'now') return 0;
        if (status === 'upcoming') return 1;
        return 2;
      };

      const priorityA = getPriority(statusA);
      const priorityB = getPriority(statusB);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      const timeA = parseInt(a.time.split(":")[0]);
      const timeB = parseInt(b.time.split(":")[0]);
      return timeA - timeB;
    });
  }, [classes, getClassStatus]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white pb-24 transition-colors duration-300">
      
      {/* --- Header --- */}
      <header className="px-6 pt-12 pb-4 bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-10 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => selectedSlot ? setSelectedSlot(null) : router.back()} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">
            {selectedSlot ? "เช็คชื่อเข้าเรียน" : "เลือกวิชาที่สอน"}
          </h1>
        </div>
      </header>

      {/* --- Content --- */}
      <main className="p-6">
        {!selectedSlot ? (
          // STATE 1: ยังไม่เลือกวิชา
          <div className="space-y-4 animate-slide-up">
            <div className="flex justify-between items-end mb-2">
               <p className="text-sm text-gray-500 dark:text-gray-400">
                 รายวิชาของวันนี้ ({currentTime?.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'short' })})
               </p>
               {currentTime && (
                 <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                   <Clock size={12} /> {currentTime.toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})} น.
                 </span>
               )}
            </div>
            
            {sortedClasses.length === 0 ? (
                <div className="text-center py-10 text-gray-400 animate-pulse">กำลังโหลดตารางสอน...</div>
            ) : (
                sortedClasses.map((slot) => {
                  const status = getClassStatus(slot.time);
                  const isNow = status === "now";
                  const isPast = status === "past";

                  return (
                    <div 
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`relative p-5 rounded-3xl border transition-all duration-300 cursor-pointer active:scale-[0.98] group
                        ${isNow 
                          ? 'bg-white dark:bg-zinc-900 border-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/30 shadow-xl shadow-indigo-100/50 dark:shadow-none transform scale-[1.02] z-10' 
                          : isPast 
                            ? 'bg-gray-50 dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 opacity-60 hover:opacity-100 grayscale-[0.5]' 
                            : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm hover:border-indigo-300 dark:hover:border-zinc-600'
                        }
                      `}
                    >
                      {/* Active Indicator */}
                      {isNow && (
                        <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 animate-bounce-slow z-20">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          กำลังสอนตอนนี้
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1
                          ${isNow 
                            ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' 
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400'
                          }`}>
                          <Clock size={10} />
                          {slot.time}
                        </span>
                        {isPast && <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><CheckCircle2 size={10}/> จบคาบแล้ว</span>}
                        {!isPast && !isNow && <span className="text-[10px] font-bold text-gray-400">ยังไม่ถึงเวลา</span>}
                      </div>

                      <h3 className={`font-bold text-lg mb-1 ${isNow ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-800 dark:text-gray-200'}`}>
                        {slot.subject}
                      </h3>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs">
                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${isNow ? 'bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`}>
                          <Users size={14}/> {slot.class}
                        </span>
                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${isNow ? 'bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`}>
                          <MapPin size={14}/> {slot.room}
                        </span>
                      </div>

                      {isNow && (
                        <div className="mt-4 text-center border-t border-indigo-100 dark:border-indigo-900/50 pt-3">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 transition flex items-center justify-center gap-1">
                                แตะเพื่อเปิด QR Code <ChevronLeft className="rotate-180" size={12} />
                            </span>
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        ) : (
          // STATE 2: เลือกวิชาแล้ว (QR Generator)
          <div className="animate-fade-in">
             <QRGeneratorView slot={selectedSlot} />
          </div>
        )}
      </main>

    </div>
  );
}

function QRGeneratorView({ slot }: { slot: ClassSlot }) {
  const [qrToken, setQrToken] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    const generateToken = () => {
      const randomId = Math.random().toString(36).substring(7);
      const timestamp = Date.now();
      const newToken = `${slot.class}-${slot.code}-${timestamp}-${randomId}`;
      
      setQrToken(newToken);
      setTimeLeft(10);
      setSessionCount(prev => prev + 1);
    };

    generateToken();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateToken();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [slot]);

  return (
    <div className="flex flex-col items-center">
      {/* การ์ดแสดงข้อมูลวิชา */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{slot.subject}</h2>
        <div className="flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400 mt-1">
           <span className="flex items-center gap-1 text-sm"><Users size={16}/> {slot.class}</span>
           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
           <span className="flex items-center gap-1 text-sm"><MapPin size={16}/> {slot.room}</span>
        </div>
      </div>

      {/* กรอบ QR Code */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-indigo-100 dark:shadow-none dark:bg-zinc-800 flex flex-col items-center w-full max-w-xs relative overflow-hidden border border-gray-100 dark:border-zinc-700">
         
         <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 dark:bg-zinc-700">
            <div 
              className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            ></div>
         </div>

         <div className="mt-4 mb-4 relative p-2 border-2 border-dashed border-indigo-100 dark:border-zinc-600 rounded-xl">
            <QRCode 
              value={qrToken} 
              size={200} 
              level="M"
              className="rounded-lg"
            />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="bg-white dark:bg-zinc-800 p-1.5 rounded-full shadow-sm">
                 <RefreshCw size={24} className="text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
               </div>
            </div>
         </div>

         <div className="text-center">
           <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">เปลี่ยนรหัสอัตโนมัติใน</p>
           <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 font-variant-numeric">{timeLeft}</p>
         </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start gap-3 max-w-sm">
         <AlertCircle className="text-blue-600 dark:text-blue-400 shrink-0" size={20} />
         <div>
           <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300">ระบบป้องกันการทุจริต</h4>
           <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1 leading-relaxed">
             QR Code จะเปลี่ยนทุก 10 วินาที เพื่อป้องกันการถ่ายรูปส่งต่อ นักเรียนต้องสแกนจากหน้าจอนี้เท่านั้น
           </p>
         </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
         Session Active (ID: {sessionCount})
      </div>

    </div>
  );
}