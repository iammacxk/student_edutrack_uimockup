// app/account/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotification } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";
import { 
  Home, CalendarDays, ScanLine, Bell, User, 
  Moon, Sun, LogOut, ChevronRight,
  Shield, Globe, HelpCircle, Lock,
  X, Save, Smartphone, Mail, Hash, UserCircle,
  Binary 
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { unreadCount } = useNotification();
  const { isDarkMode, toggleTheme } = useTheme();

  // --- State สำหรับข้อมูลผู้ใช้ (Editable) ---
  const [profile, setProfile] = useState({
    studentId: "66160123", // Read-only
    classNo: "9",          // เพิ่ม field เลขที่ (Read-only)
    fullName: "นายเอ็ม ออนิว", // Read-only
    classRoom: "ม.5/1", // Read-only
    nickname: "M Allnew", // Editable
    phone: "081-234-5678", // Editable
    email: "student@school.ac.th" // Editable
  });

  // --- State ควบคุม Modal ---
  const [activeModal, setActiveModal] = useState<'none' | 'editProfile' | 'help' | 'privacy'>('none');

  const handleLogout = () => {
    // จำลองการ Logout
    router.push("/");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // ในโปรเจกต์จริงจะส่ง API ตรงนี้
    setActiveModal('none');
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 transition-colors duration-300 pb-24 relative">
      
      {/* --- Header Profile --- */}
      <div className="bg-white dark:bg-zinc-900 px-6 pt-12 pb-8 rounded-b-3xl shadow-sm mb-6 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-3xl border-4 border-white dark:border-zinc-800 shadow-md">
            {profile.nickname ? profile.nickname[0] : "T"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{profile.fullName}</h1>
            
            {/* ✅ ปรับปรุง: แสดงเลขที่ใน Header ด้วย */}
            <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                   ID: {profile.studentId}
                </p>
                <span className="text-gray-300 dark:text-zinc-700">|</span>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
                   เลขที่: {profile.classNo}
                </p>
            </div>

            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              สถานะ: ปกติ
            </div>
          </div>
        </div>
      </div>

      {/* --- Settings Menu --- */}
      <main className="px-6 space-y-6">
         {/* ... (Code ส่วน Menu เหมือนเดิม) ... */}
         {/* เพื่อความกระชับ ผมละไว้ในฐานที่เข้าใจครับ */}
        
        {/* Section 1: การตั้งค่าแอป */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 ml-2 uppercase tracking-wider">การตั้งค่าแอปพลิเคชัน</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">โหมดมืด (Dark Mode)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleTheme} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <MenuItem icon={<Globe size={20} />} label="ภาษา (Language)" value="ไทย" />
          </div>
        </section>

        {/* Section 2: บัญชีและความปลอดภัย */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 ml-2 uppercase tracking-wider">บัญชีและความปลอดภัย</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
            {/* ปุ่มกดแก้ไขข้อมูลส่วนตัว */}
            <MenuItem 
              icon={<User size={20} />} 
              label="แก้ไขข้อมูลส่วนตัว" 
              onClick={() => setActiveModal('editProfile')}
            />
            <MenuItem icon={<Lock size={20} />} label="เปลี่ยนรหัสผ่าน" />
            <MenuItem icon={<Bell size={20} />} label="ตั้งค่าการแจ้งเตือน" />
          </div>
        </section>

        {/* Section 3: อื่นๆ */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 ml-2 uppercase tracking-wider">ความช่วยเหลือ</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
            <MenuItem 
              icon={<HelpCircle size={20} />} 
              label="ศูนย์ช่วยเหลือ" 
              onClick={() => setActiveModal('help')}
            />
            <MenuItem 
              icon={<Shield size={20} />} 
              label="นโยบายความเป็นส่วนตัว" 
              onClick={() => setActiveModal('privacy')}
            />
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

      {/* --- MODALS (POPUP) --- */}

      {/* 1. Edit Profile Modal */}
      {activeModal === 'editProfile' && (
        <div className="absolute inset-0 z-50 bg-[#F8F9FA] dark:bg-zinc-950 flex flex-col animate-slide-up overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-zinc-900 px-6 py-4 flex items-center justify-between shadow-sm z-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">แก้ไขข้อมูลส่วนตัว</h2>
            <button onClick={() => setActiveModal('none')} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-600 dark:text-gray-400">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
             {/* Read-only Section */}
             <div className="space-y-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ข้อมูลทางการศึกษา (แก้ไขไม่ได้)</p>
                <ReadOnlyInput label="ชื่อ-นามสกุล" value={profile.fullName} icon={<UserCircle size={18} />} />
                <ReadOnlyInput label="รหัสนักเรียน" value={profile.studentId} icon={<Hash size={18} />} />
                
                {/* ✅ ปรับปรุง: เพิ่มช่องเลขที่ */}
                <div className="grid grid-cols-2 gap-4">
                   <ReadOnlyInput label="ชั้นเรียน" value={profile.classRoom} icon={<Home size={18} />} />
                   <ReadOnlyInput label="เลขที่" value={profile.classNo} icon={<Binary size={18} />} />
                </div>
             </div>

             <div className="border-t border-gray-100 dark:border-zinc-800"></div>

             {/* Editable Section */}
             <div className="space-y-4">
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">ข้อมูลสำหรับติดต่อ (แก้ไขได้)</p>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ชื่อเล่น</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={profile.nickname}
                      onChange={(e) => setProfile({...profile, nickname: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">เบอร์โทรศัพท์</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="tel" 
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">อีเมล</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="email" 
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white transition"
                    />
                  </div>
                </div>
             </div>

             <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition flex items-center justify-center gap-2 mt-8 shadow-lg shadow-indigo-200 dark:shadow-none">
                <Save size={20} /> บันทึกข้อมูล
             </button>
          </form>
        </div>
      )}

      {/* ... (Modals อื่นๆ เหมือนเดิม) ... */}
       {/* 2. Help Modal */}
       {activeModal === 'help' && (
        <InfoModal title="ศูนย์ช่วยเหลือ" onClose={() => setActiveModal('none')}>
           {/* ...content... */}
           <div className="space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                 <h3 className="font-bold text-indigo-700 dark:text-indigo-400 mb-2">ติดต่อฝ่ายวิชาการ</h3>
                 <p className="text-sm text-gray-600 dark:text-gray-300">หากพบปัญหาเรื่องเกรด หรือตารางเรียน สามารถติดต่อได้ที่ห้องวิชาการ อาคาร 1 ชั้น 2</p>
                 <p className="text-sm font-medium mt-2 text-indigo-600 dark:text-indigo-400">โทร: 02-123-4567 ต่อ 101</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-white">คำถามที่พบบ่อย (FAQ)</h3>
                <FaqItem question="จะเช็คชื่อเข้าเรียนอย่างไร?" answer="เมื่อถึงห้องเรียน ให้เปิดแอปเลือกเมนู 'สแกน' และสแกน QR Code หน้าห้องเรียน" />
                <FaqItem question="ลืมรหัสผ่านต้องทำอย่างไร?" answer="กรุณาติดต่อครูที่ปรึกษา หรือเจ้าหน้าที่ห้อง Server เพื่อขอรีเซ็ตรหัสผ่านใหม่" />
                <FaqItem question="แจ้งเตือนไม่เด้ง?" answer="ตรวจสอบการตั้งค่าในมือถือว่าอนุญาตให้แอป EduTrack ส่งการแจ้งเตือนหรือไม่" />
              </div>
           </div>
        </InfoModal>
      )}

      {/* 3. Privacy Modal */}
      {activeModal === 'privacy' && (
        <InfoModal title="นโยบายความเป็นส่วนตัว" onClose={() => setActiveModal('none')}>
           {/* ...content... */}
           <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 space-y-4">
              <p>
                <strong>1. การเก็บรวบรวมข้อมูล:</strong> แอปพลิเคชัน EduTrack จะทำการเก็บรวบรวมข้อมูลส่วนบุคคลของนักเรียน ได้แก่ ชื่อ-นามสกุล, รหัสนักเรียน, รูปถ่าย, และประวัติการเข้าเรียน เพื่อใช้ในการบริหารจัดการการเรียนการสอนเท่านั้น
              </p>
              <p>
                <strong>2. การเข้าถึงตำแหน่ง (Location):</strong> แอปพลิเคชันจำเป็นต้องเข้าถึงตำแหน่ง GPS ของท่านเฉพาะตอนทำการ &ldquo;เช็คชื่อ&quot; เพื่อยืนยันว่านักเรียนอยู่ในบริเวณโรงเรียนจริง เราไม่มีการติดตามตำแหน่งนอกเวลาเรียน
              </p>
              <p>
                <strong>3. การเปิดเผยข้อมูล:</strong> ข้อมูลของท่านจะถูกเก็บเป็นความลับและเปิดเผยเฉพาะกับ ครูที่ปรึกษา, ครูผู้สอน และผู้ปกครองที่ลงทะเบียนไว้เท่านั้น
              </p>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl mt-6">
                <p className="text-xs text-center text-gray-400">
                  แก้ไขล่าสุดเมื่อ: 1 มกราคม 2567<br/>
                  © 2024 EduTrack School System
                </p>
              </div>
           </div>
        </InfoModal>
      )}

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-zinc-800 border-t border-gray-100 dark:border-zinc-700 px-6 py-4 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-40 transition-colors duration-300">
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
          <Link href="/account">
            <NavItem icon={<User size={24} />} label="บัญชี" active={true} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ... (Sub-Components เหมือนเดิม) ...
function MenuItem({ icon, label, value, onClick }: { icon: React.ReactNode, label: string, value?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition border-b border-gray-50 dark:border-zinc-800 last:border-0 group">
      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
        <div className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
           {icon}
        </div>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{value}</span>}
        <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
      </div>
    </button>
  );
}

function ReadOnlyInput({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="space-y-1 opacity-70">
      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
           {icon}
        </div>
        <input 
          type="text" 
          value={value}
          disabled
          className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-zinc-800 border-none rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
        />
      </div>
    </div>
  );
}

function InfoModal({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
        <div className="bg-white dark:bg-zinc-900 w-full h-[80%] sm:h-auto sm:max-h-[80%] rounded-t-3xl sm:rounded-3xl p-6 flex flex-col animate-slide-up shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
                    <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
                {children}
            </div>
        </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="border border-gray-100 dark:border-zinc-800 rounded-lg p-3">
        <h4 className="font-medium text-indigo-600 dark:text-indigo-400 text-sm mb-1">{question}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{answer}</p>
    </div>
  );
}

function NavItem({ icon, label, active = false, hasBadge = false }: { icon: React.ReactNode, label: string, active?: boolean, hasBadge?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 cursor-pointer ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-zinc-500'}`}>
      <div className="relative">
        {icon}
        {hasBadge && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}