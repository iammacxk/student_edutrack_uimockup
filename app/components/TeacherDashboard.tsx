"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  QrCode,
  ChevronRight,
  ClipboardList,
  UserCheck,
  UserX,
  MapPin, // ✅ เพิ่มไอคอนสำหรับลิงก์ Tracking
} from "lucide-react";

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] dark:bg-zinc-950 transition-colors duration-300 pb-24 min-h-screen">
      {/* --- Header ครู --- */}
      <header className="px-6 pt-12 pb-6 bg-white dark:bg-zinc-900 rounded-b-3xl shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              สวัสดีครับอาจารย์ 🙏,
            </p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              ครูสมศรี ดีใจ
            </h1>
            <p className="text-gray-400 text-xs mt-1">ที่ปรึกษา: ม.5/1</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg border-2 border-white dark:border-zinc-700 shadow-sm">
            T
          </div>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* 1. สถิติห้องที่ปรึกษา (วันนี้) */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              เช็คชื่อ ม.5/1 (วันนี้)
            </h2>
            <span className="text-xs text-gray-400">อัปเดต 08:15 น.</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              label="มาเรียน"
              value="38"
              icon={<UserCheck size={18} />}
              color="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            />
            <StatCard
              label="ขาดเรียน"
              value="2"
              icon={<UserX size={18} />}
              color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            />
            <StatCard
              label="ลาป่วย"
              value="0"
              icon={<ClipboardList size={18} />}
              color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />
          </div>
        </section>

        {/* 2. คาบสอนถัดไป (Active Action) */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              การสอนถัดไป
            </h2>
            <Link href="/schedule">
              <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1">
                ดูตารางสอน <ChevronRight size={14} />
              </button>
            </Link>
          </div>
          <div className="bg-indigo-600 dark:bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                15:00 - 16:00
              </span>
              <Users className="w-5 h-5 text-indigo-100" />
            </div>
            <h3 className="text-xl font-bold mb-1">ว30102 วิทยาการคำนวณ</h3>
            <p className="text-indigo-100 text-sm mb-6 opacity-90">
              ม.5/1 • ห้อง Computer Lab
            </p>

            <Link
              href="/generate-qr"
              className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition"
            >
              <QrCode size={20} /> เปิด QR เช็คชื่อ
            </Link>
          </div>
        </section>

        {/* 3. แจ้งเตือนกลุ่มเสี่ยง (แก้ไขแล้ว) */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              ต้องติดตามด่วน ⚠️
            </h2>
            {/* ✅ ลิงก์ไปหน้า Tracking */}
            <Link
              href="/tracking"
              className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              ดูทั้งหมด <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-3">
            {/* Student Card 1 */}
            <Link href="/tracking" className="block">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-red-100 dark:border-red-900/30 flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98]">
                {/* ✅ รูปโปรไฟล์จริง (Avatar) */}
                <div className="relative">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=somchai" 
                    alt="สมชาย" 
                    className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white text-[10px] text-white font-bold">
                    !
                  </span>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    นายสมชาย มาสาย
                  </h4>
                  <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                    ขาดเรียนติดต่อกัน 3 วัน
                  </p>
                </div>
                
                <button className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg font-bold hover:bg-red-100 transition">
                  โทรตาม
                </button>
              </div>
            </Link>

            {/* Student Card 2 (ตัวอย่างเพิ่มอีกคน) */}
            <Link href="/tracking" className="block">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-orange-100 dark:border-orange-900/30 flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98]">
                <div className="relative">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=due" 
                    alt="ดื้อ" 
                    className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm"
                  />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    นายดื้อ ดึงดัน
                  </h4>
                  <p className="text-xs text-orange-500 mt-0.5">
                    มาสายเกิน 5 ครั้ง/เดือน
                  </p>
                </div>
                
                <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
                  <ChevronRight size={16} />
                </button>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode; 
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl p-3 flex flex-col items-center justify-center gap-1 ${color}`}
    >
      {icon}
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-[10px] opacity-80 font-medium">{label}</span>
    </div>
  );
}