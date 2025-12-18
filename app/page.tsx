// app/page.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "./context/AuthContext"; // เรียกใช้ AuthContext
import { Lock, User, GraduationCap, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth(); // ดึงฟังก์ชัน login มาใช้
  
  // State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- ตรวจสอบเงื่อนไข Login แยกตาม Role ---
    if (username === "student" && password === "student") {
      login('student');
    } 
    else if (username === "teacher" && password === "teacher") {
      login('teacher');
    } 
    else if (username === "parent" && password === "parent") {
      login('parent');
    } 
    else {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-6 text-white">
      
      {/* Logo & Branding */}
      <div className="flex flex-col items-center mb-8 animate-slide-up">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-4">
          <GraduationCap size={40} className="text-indigo-600" />
        </div>
        {/* เปลี่ยนชื่อแอพตามที่ขอครับ */}
        <h1 className="text-3xl font-bold tracking-tight text-center">Student Tracking System</h1>
        <p className="text-indigo-100 mt-2 text-sm">ระบบติดตามดูแลผู้เรียนอัจฉริยะ</p>
      </div>

      {/* Login Form Card */}
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-gray-800 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">เข้าสู่ระบบ</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">ชื่อผู้ใช้งาน</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">รหัสผ่าน</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                required
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg text-center font-medium animate-pulse">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 mt-4"
          >
            เข้าสู่ระบบ <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-xs text-gray-400 hover:text-indigo-600 transition">ลืมรหัสผ่าน?</a>
        </div>

        {/* Hint Box: สำหรับช่วยจำตอนทดสอบระบบ (ลบออกได้เมื่อใช้งานจริง) */}
        <div className="mt-6 p-3 bg-gray-50 rounded-xl border border-gray-100 text-[10px] text-gray-500 text-center">
            <p className="font-semibold mb-1">🔑 บัญชีทดสอบแต่ละหน้าที่ (Demo Users in each roles)</p>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <span className="block font-bold text-indigo-600">student</span>
                    student
                </div>
                <div>
                    <span className="block font-bold text-indigo-600">teacher</span>
                    teacher
                </div>
                <div>
                    <span className="block font-bold text-indigo-600">parent</span>
                    parent
                </div>
            </div>
            <p className="mt-1 text-gray-400">(Password เหมือน Username)</p>
        </div>

      </div>
      
      <p className="mt-8 text-xs text-white/50">© 2025 Student Tracking System. All rights reserved.</p>
    </div>
  );
}