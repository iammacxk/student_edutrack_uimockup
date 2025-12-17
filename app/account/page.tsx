// app/account/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotification } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext"; // เรียกใช้ Theme
import { 
  Home, CalendarDays, ScanLine, Bell, User, 
  Moon, Sun, LogOut, ChevronRight,
  Shield, Globe, HelpCircle, Lock
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { unreadCount } = useNotification();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    // ลบ Token หรือ Session (ถ้ามี)
    // แล้ว Redirect ไปหน้า Login
    router.push("/");
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8F9FA] dark:bg-zinc-900 transition-colors duration-300 pb-24">
      
      {/* --- Header Profile --- */}
      <div className="bg-white dark:bg-zinc-800 px-6 pt-12 pb-8 rounded-b-3xl shadow-sm mb-6 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-3xl border-4 border-white dark:border-zinc-700 shadow-md">
            T
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">นายทินภัทร บูรณะบัญญัติ</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">รหัสนักเรียน: 66160xxx</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              สถานะ: ปกติ
            </div>
          </div>
        </div>
      </div>

      {/* --- Settings Content --- */}
      <main className="px-6 space-y-6">
        
        {/* Section 1: การตั้งค่าแอป */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 ml-2 uppercase tracking-wider">การตั้งค่าแอปพลิเคชัน</h2>
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">โหมดมืด (Dark Mode)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleTheme} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-zinc-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <MenuItem icon={<Globe size={20} />} label="ภาษา (Language)" value="ไทย" />
          </div>
        </section>

        {/* Section 2: บัญชีและความปลอดภัย */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 ml-2 uppercase tracking-wider">บัญชีและความปลอดภัย</h2>
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
            <MenuItem icon={<User size={20} />} label="แก้ไขข้อมูลส่วนตัว" />
            <MenuItem icon={<Lock size={20} />} label="เปลี่ยนรหัสผ่าน" />
            <MenuItem icon={<Bell size={20} />} label="ตั้งค่าการแจ้งเตือน" />
          </div>
        </section>

        {/* Section 3: อื่นๆ */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 ml-2 uppercase tracking-wider">ความช่วยเหลือ</h2>
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
            <MenuItem icon={<HelpCircle size={20} />} label="ศูนย์ช่วยเหลือ" />
            <MenuItem icon={<Shield size={20} />} label="นโยบายความเป็นส่วนตัว" />
          </div>
        </section>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition active:scale-95"
        >
          <LogOut size={20} />
          ออกจากระบบ
        </button>

        <p className="text-center text-xs text-gray-400 dark:text-zinc-600 pt-4 pb-8">
          EduTrack Version 1.0.0 (Build 2024.1)
        </p>

      </main>

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-zinc-800 border-t border-gray-100 dark:border-zinc-700 px-6 py-4 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50 transition-colors duration-300">
        <div className="flex justify-between items-center relative">
          <Link href="/dashboard"><NavItem icon={<Home size={24} />} label="ภาพรวม" /></Link>
          <Link href="/schedule"><NavItem icon={<CalendarDays size={24} />} label="ตารางเรียน" /></Link>
          <div className="relative -top-8">
            <Link href="/scan">
              <div className="bg-indigo-600 dark:bg-indigo-500 p-4 rounded-full shadow-lg shadow-indigo-300 dark:shadow-indigo-900 ring-4 ring-white dark:ring-zinc-800 cursor-pointer transform transition active:scale-95">
                <ScanLine size={28} color="white" />
              </div>
            </Link>
          </div>
          <Link href="/notifications">
            <NavItem icon={<Bell size={24} />} label="แจ้งเตือน" hasBadge={unreadCount > 0} />
          </Link>
          
          {/* Active Page */}
          <Link href="/account">
            <NavItem icon={<User size={24} />} label="บัญชี" active={true} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function MenuItem({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition border-b border-gray-50 dark:border-zinc-700 last:border-0 group">
      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
        <div className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
           {icon}
        </div>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-gray-400 font-medium">{value}</span>}
        <ChevronRight size={16} className="text-gray-300" />
      </div>
    </button>
  );
}

// เปลี่ยน any เป็น React.ReactNode
function NavItem({ icon, label, active = false, hasBadge = false }: { icon: React.ReactNode, label: string, active?: boolean, hasBadge?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 cursor-pointer ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-zinc-500'}`}>
      <div className="relative">
        {icon}
        {hasBadge && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-800"></span>}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}