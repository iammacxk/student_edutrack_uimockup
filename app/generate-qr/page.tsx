"use client";

import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, Users, MapPin, 
  RefreshCw, AlertCircle 
} from "lucide-react";

interface ClassSlot {
  id: number;
  time: string;
  subject: string;
  room: string;
  class: string;
  code: string;
}

export default function GenerateQRPage() {
  const router = useRouter();
  
  const [selectedSlot, setSelectedSlot] = useState<ClassSlot | null>(null);

  // Mock Data: รายวิชาที่ครูสอนในวันนี้
  const todayClasses: ClassSlot[] = [
    { id: 1, time: "08:30 - 09:20", subject: "ฟิสิกส์ 1", room: "LAB Phy", class: "ม.5/1", code: "ว30201" },
    { id: 2, time: "09:20 - 10:10", subject: "ฟิสิกส์ 1", room: "LAB Phy", class: "ม.5/1", code: "ว30201" },
    { id: 3, time: "11:00 - 11:50", subject: "วิทย์พื้นฐาน", room: "402", class: "ม.4/3", code: "ว30101" },
    { id: 4, time: "13:50 - 14:40", subject: "ฟิสิกส์ 2", room: "LAB Phy", class: "ม.6/1", code: "ว30205" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white pb-24">
      
      {/* --- Header --- */}
      <header className="px-6 pt-12 pb-4 bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-10">
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">เลือกรายวิชาเพื่อสร้าง QR Code สำหรับเช็คชื่อ</p>
            
            {todayClasses.map((slot) => (
              <div 
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition active:scale-95 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-1 rounded-md">
                    {slot.time}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-indigo-500 transition">
                    แตะเพื่อเลือก
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{slot.subject}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Users size={14}/> {slot.class}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {slot.room}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // STATE 2: เลือกวิชาแล้ว
          <div className="animate-fade-in">
             <QRGeneratorView slot={selectedSlot} />
          </div>
        )}
      </main>

    </div>
  );
}

// --- Sub-Component ---

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