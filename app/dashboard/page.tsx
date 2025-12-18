// app/dashboard/page.tsx
"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";

// Import Components ที่เราแยกไว้
// (ในโปรเจกต์จริง แนะนำให้แยกไฟล์ TeacherDashboard.tsx และ ParentDashboard.tsx ไปไว้ในโฟลเดอร์ components นะครับ)
// แต่ถ้าจะก๊อปวางในไฟล์เดียว ให้เอาโค้ดข้างบนมาต่อท้ายไฟล์นี้ หรือแปะรวมกันก็ได้ครับ

// สมมติว่าเรา import มาแล้ว หรือเขียนรวมไว้ในไฟล์เดียวกัน
import StudentDashboard from "../components/StudentDashboard"; // (เอาโค้ดเดิมของคุณไปทำเป็น Component)
import TeacherDashboard from "../components/TeacherDashboard"; // (เอาโค้ดครูข้างบนไปทำเป็น Component)
import ParentDashboard from "../components/ParentDashboard";   // (เอาโค้ดผู้ปกครองข้างบนไปทำเป็น Component)
import BottomNav from "../components/BottomNav"; // อย่าลืมใส่ BottomNav ตรงนี้แทน

export default function DashboardPage() {
  const { user } = useAuth();

  // ป้องกัน Error กรณีไม่มี user (ควร Redirect ไป login)
  if (!user) return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="relative min-h-screen bg-[#F8F9FA] dark:bg-zinc-950">
      
      {/* --- CONTENT SWITCHER --- */}
      {user.role === 'student' && <StudentDashboard />}
      {user.role === 'teacher' && <TeacherDashboard />}
      {user.role === 'parent' && <ParentDashboard />}

      {/* --- BOTTOM NAVIGATION --- */}
      {/* ใส่ BottomNav ไว้ตรงนี้ทีเดียว จบเลยครับ มันจะเปลี่ยนเมนูตาม Role ให้เอง */}
      <BottomNav />
      
    </div>
  );
}