// app/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, GraduationCap, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  // State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- ตรวจสอบเงื่อนไข Login ---
    // User ต้องเป็น 'student' เท่านั้น
    // Password เป็นได้ทั้ง 'edutrack1111' หรือ 'admin'
    if (username === "student" && (password === "edutrack1111" || password === "admin")) {
      router.push("/dashboard");
    } else {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-6 text-white">
      
      {/* Logo & Branding */}
      <div className="flex flex-col items-center mb-8 animate-slide-up">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-4">
          <GraduationCap size={40} className="text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">EduTrack</h1>
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
                placeholder="Student ID"
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
      </div>
      
      <p className="mt-8 text-xs text-white/50">© 2024 EduTrack System. All rights reserved.</p>
    </div>
  );
}