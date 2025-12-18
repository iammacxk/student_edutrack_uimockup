// app/components/BottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { 
  Home, CalendarDays, ScanLine, Bell, User, 
  Users, QrCode, Megaphone, 
  CalendarCheck, GraduationCap, CreditCard
} from "lucide-react";
import React from "react";

export default function BottomNav() {
  const { user } = useAuth();
  const { unreadCount } = useNotification();
  const pathname = usePathname();

  // ถ้าไม่มี user (ยังไม่ login) ไม่ต้องโชว์
  if (!user) return null;

  // ฟังก์ชันเช็คว่าหน้าไหน Active
  const isActive = (path: string) => pathname === path;

  // --- MENU SETS ---
  
  // 1. เมนูนักเรียน
  const studentMenu = [
    { href: "/dashboard", icon: <Home size={24} />, label: "ภาพรวม" },
    { href: "/schedule", icon: <CalendarDays size={24} />, label: "ตารางเรียน" },
    { href: "/scan", icon: <ScanLine size={28} />, label: "", isScan: true }, // ปุ่มใหญ่ตรงกลาง
    { href: "/notifications", icon: <Bell size={24} />, label: "แจ้งเตือน", badge: unreadCount },
    { href: "/account", icon: <User size={24} />, label: "บัญชี" },
  ];

  // 2. เมนูครู
  const teacherMenu = [
    { href: "/dashboard", icon: <Home size={24} />, label: "ภาพรวม" },
    { href: "/schedule", icon: <Users size={24} />, label: "นร.ประจำชั้น" }, // ใช้หน้า schedule เดิมแต่เปลี่ยน content เอาก็ได้ หรือสร้างใหม่
    { href: "/generate-qr", icon: <QrCode size={28} />, label: "", isScan: true }, // ปุ่มใหญ่ (Generate QR)
    { href: "/notifications", icon: <Megaphone size={24} />, label: "ประกาศ" },
    { href: "/account", icon: <User size={24} />, label: "บัญชี" },
  ];

  // 3. เมนูผู้ปกครอง
  const parentMenu = [
    { href: "/dashboard", icon: <Home size={24} />, label: "ภาพรวม" },
    { href: "/attendance", icon: <CalendarCheck size={24} />, label: "การมาเรียน" }, // ดูปฏิทิน/ลากิจ
    { href: "/academic", icon: <GraduationCap size={28} />, label: "", isScan: true }, // ปุ่มใหญ่ (วิชาการ) หรือจะใช้ icon ธรรมดาก็ได้
    { href: "/finance", icon: <CreditCard size={24} />, label: "ธุรกรรม" },
    { href: "/account", icon: <User size={24} />, label: "ติดต่อ/บัญชี" },
  ];

  // เลือกเมนูตาม Role
  let currentMenu = studentMenu;
  if (user.role === 'teacher') currentMenu = teacherMenu;
  if (user.role === 'parent') currentMenu = parentMenu;

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 px-6 py-4 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50 transition-colors duration-300">
      <div className="flex justify-between items-center relative">
        {currentMenu.map((item, index) => {
          if (item.isScan) {
            // ปุ่มใหญ่ตรงกลาง (Scan / Gen QR / Academic)
            return (
              <div key={index} className="relative -top-8">
                <Link href={item.href}>
                  <div className="bg-indigo-600 dark:bg-indigo-500 p-4 rounded-full shadow-lg shadow-indigo-300 dark:shadow-indigo-900 ring-4 ring-white dark:ring-zinc-900 cursor-pointer transform transition active:scale-95">
                    {React.cloneElement(item.icon as React.ReactElement, { color: "white" })}
                  </div>
                </Link>
              </div>
            );
          }

          return (
            <Link key={index} href={item.href}>
              <div className={`flex flex-col items-center gap-1 cursor-pointer ${isActive(item.href) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-zinc-500'}`}>
                <div className="relative">
                  {item.icon}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}