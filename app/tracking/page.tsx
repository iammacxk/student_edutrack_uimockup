"use client";

import React, { useState } from "react";
import Link from "next/link";
import BottomNav from "../components/BottomNav";
import { 
  ChevronLeft, Search, MapPin, Phone, 
  AlertTriangle, User, Navigation, Home, X
} from "lucide-react";

// --- Mock Data: รายชื่อนักเรียน (โซน ต.แสนสุข จ.ชลบุรี) ---
const studentsData = [
  {
    id: "66001",
    name: "นายสมชาย มาสาย",
    nickname: "ชาย",
    class: "ม.5/1",
    absences: 6, // 🚨 เกิน 4 ครั้ง (กลุ่มเสี่ยง)
    status: "critical",
    address: "33/1 ถ.บางแสนสาย 1 ต.แสนสุข อ.เมือง จ.ชลบุรี (ใกล้หาดวอน)",
    location: { lat: 13.2810, lng: 100.9321 }, // หาดวอนนภา
    phone: "081-111-1111",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=somchai"
  },
  {
    id: "66002",
    name: "นางสาวใจดี เรียนเก่ง",
    nickname: "ใจ",
    class: "ม.5/1",
    absences: 0,
    status: "normal",
    address: "88 หมู่ 5 ถ.ลงหาดบางแสน ต.แสนสุข อ.เมือง จ.ชลบุรี",
    location: { lat: 13.2925, lng: 100.9189 }, // แถวมอบูรพา
    phone: "082-222-2222",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jaidee"
  },
  {
    id: "66003",
    name: "นายดื้อ ดึงดัน",
    nickname: "ดื้อ",
    class: "ม.5/1",
    absences: 8, // 🚨 เกิน 4 ครั้ง (กลุ่มเสี่ยง)
    status: "critical",
    address: "55/9 ซอย 1 ถ.สุขุมวิท ต.แสนสุข อ.เมือง จ.ชลบุรี (ตลาดหนองมน)",
    location: { lat: 13.2830, lng: 100.9450 }, // ตลาดหนองมน
    phone: "083-333-3333",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=due"
  },
  {
    id: "66004",
    name: "นายรักเรียน เพียรศึกษา",
    nickname: "รัก",
    class: "ม.5/1",
    absences: 2,
    status: "warning",
    address: "123 ถ.ข้าวหลาม ต.แสนสุข อ.เมือง จ.ชลบุรี",
    location: { lat: 13.2980, lng: 100.9305 }, // ถนนข้าวหลาม
    phone: "084-444-4444",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rak"
  },
  {
    id: "66005",
    name: "นางสาวสายเสมอ รอเธอ",
    nickname: "สาย",
    class: "ม.5/1",
    absences: 4, // ⚠️ เฝ้าระวัง
    status: "warning",
    address: "77/2 หมู่ 2 แหลมแท่น ต.แสนสุข อ.เมือง จ.ชลบุรี",
    location: { lat: 13.3055, lng: 100.9080 }, // แหลมแท่น
    phone: "085-555-5555",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sai"
  },
];

export default function TrackingPage() {
  const [filter, setFilter] = useState<'all' | 'critical'>('critical'); 
  const [searchTerm, setSearchTerm] = useState("");
  
  // State สำหรับ Modal แผนที่
  const [selectedStudent, setSelectedStudent] = useState<typeof studentsData[0] | null>(null);

  // Logic กรองข้อมูล
  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.includes(searchTerm) || student.nickname.includes(searchTerm);
    if (filter === 'critical') {
      return matchesSearch && student.absences > 4;
    }
    return matchesSearch;
  });

  const criticalCount = studentsData.filter(s => s.absences > 4).length;

  const handleOpenExternalMap = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 relative transition-colors duration-300 pb-24">
      
      {/* --- Header --- */}
      <div className="bg-white dark:bg-zinc-900 px-6 pt-12 pb-6 shadow-sm sticky top-0 z-20 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard">
            <button className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
              <ChevronLeft size={24} />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">ติดตามนักเรียน</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ หรือชื่อเล่น..." 
            className="w-full bg-gray-100 dark:bg-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
          <button 
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'all' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-800 dark:text-white' : 'text-gray-500'}`}
          >
            ทั้งหมด ({studentsData.length})
          </button>
          <button 
            onClick={() => setFilter('critical')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${filter === 'critical' ? 'bg-red-500 shadow-sm text-white shadow-red-200' : 'text-gray-500'}`}
          >
            <AlertTriangle size={16} />
            กลุ่มเสี่ยง ({criticalCount})
          </button>
        </div>
      </div>

      {/* --- Student List --- */}
      <main className="px-6 py-6 space-y-4 flex-1 overflow-y-auto">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div 
              key={student.id}
              // ✅ กดที่การ์ดแล้วเปิดแผนที่เลย
              onClick={() => setSelectedStudent(student)}
              className={`relative bg-white dark:bg-zinc-900 p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer active:scale-[0.98]
                ${student.absences > 4 
                  ? 'border-red-200 dark:border-red-900/50 shadow-red-100 dark:shadow-none' 
                  : 'border-gray-100 dark:border-zinc-800 shadow-sm'
                }
              `}
            >
              {/* Risk Badge */}
              {student.absences > 4 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-1 animate-pulse">
                  <Home size={12} /> ต้องเยี่ยมบ้าน
                </div>
              )}

              <div className="flex gap-4">
                {/* Avatar */}
                <div className="relative">
                  <img src={student.image} alt={student.name} className="w-14 h-14 rounded-full bg-gray-100 border-2 border-white shadow-sm" />
                  {student.absences > 4 && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-xs font-bold text-red-600">!</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">
                    {student.name} <span className="text-gray-400 font-normal text-sm">({student.nickname})</span>
                  </h3>
                  
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {student.id}
                    </span>
                    <span className={`font-bold ${student.absences > 4 ? 'text-red-500' : student.absences > 2 ? 'text-yellow-500' : 'text-green-500'}`}>
                      ขาดเรียน {student.absences} ครั้ง
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-2 flex items-start gap-1 line-clamp-1">
                    <MapPin size={12} className="shrink-0 mt-0.5" /> {student.address}
                  </p>
                </div>
              </div>

              {/* Action Buttons (Footer Card) */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <a 
                  href={`tel:${student.phone}`}
                  onClick={(e) => e.stopPropagation()} // กันไม่ให้เปิด Map Modal เมื่อกดปุ่มโทร
                  className="flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 transition"
                >
                  <Phone size={14} /> โทรหาผู้ปกครอง
                </a>
                <button 
                  // ปุ่มนี้กดแล้วจะเปิด Modal แผนที่เหมือนกัน
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl text-white text-xs font-bold transition shadow-sm
                    ${student.absences > 4 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-blue-500 hover:bg-blue-600'}
                  `}
                >
                  <MapPin size={14} /> ดูแผนที่บ้าน
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p>ไม่พบรายชื่อนักเรียน</p>
          </div>
        )}
      </main>

      {/* --- 🗺️ Map Modal (In-App Map) --- */}
      {selectedStudent && (
        // ✅ ใช้ z-[100] เพื่อให้ทับ BottomNav (ปกติ z-50)
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedStudent(null)}></div>
          
          <div className="bg-white dark:bg-zinc-900 w-full sm:max-w-md h-[85vh] sm:h-auto sm:rounded-3xl rounded-t-3xl overflow-hidden relative z-10 shadow-2xl animate-slide-up flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">แผนที่บ้านนักเรียน</h3>
                <p className="text-xs text-gray-500">{selectedStudent.name}</p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-gray-200 transition"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Map Area (Embed Google Maps) */}
            <div className="flex-1 bg-gray-100 relative w-full h-full min-h-[300px]">
              {/* iframe Google Maps Embed API */}
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${selectedStudent.location.lat},${selectedStudent.location.lng}&hl=th&z=15&output=embed`}
              ></iframe>
              
              {/* Overlay Address Box */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur p-4 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800">
                 <div className="flex gap-3 mb-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full h-fit text-indigo-600 dark:text-indigo-400">
                       <MapPin size={20} />
                    </div>
                    <div>
                       <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">ที่อยู่ตามทะเบียนบ้าน</p>
                       <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">{selectedStudent.address}</p>
                    </div>
                 </div>
                 
                 <button 
                   onClick={() => handleOpenExternalMap(selectedStudent.location.lat, selectedStudent.location.lng)}
                   className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition active:scale-95"
                 >
                   <Navigation size={18} /> นำทางด้วย Google Maps
                 </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}