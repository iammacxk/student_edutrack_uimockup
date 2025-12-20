"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import BottomNav from "../components/BottomNav";
import { 
  Headset, Bell, User, Moon, Sun, LogOut, ChevronRight,
  Shield, Globe, HelpCircle, Lock, X, Save, 
  Smartphone, Mail, Hash, UserCircle, Binary,
  Briefcase, Baby, School
} from "lucide-react";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  // --- State สำหรับข้อมูลผู้ใช้ ---
  const [profile, setProfile] = useState({
    fullName: "",
    id: "",
    role: "",
    nickname: "",
    phone: "",
    email: "",
    classRoom: "",
    classNo: "",
    department: "",
    advisorClass: "",
    childName: "",
  });

  // --- Effect: โหลดข้อมูลตาม Role (จำลองการดึง API) ---
  useEffect(() => {
    if (!user) return;

    // ✅ แก้ไข: ใช้ setTimeout เพื่อจำลองการโหลดข้อมูลแบบ Async
    // ช่วยแก้ปัญหา "setState synchronously" และทำให้เหมือนการดึง API จริง
    const timer = setTimeout(() => {
        let newProfile = {
            fullName: user.name,
            id: user.id,
            role: user.role || "",
            nickname: "",
            phone: "",
            email: "",
            classRoom: "",
            classNo: "",
            department: "",
            advisorClass: "",
            childName: "",
        };

        if (user.role === 'student') {
            newProfile = {
                ...newProfile,
                nickname: "M Allnew",
                phone: "081-234-5678",
                email: "student@school.ac.th",
                classRoom: "ม.5/1",
                classNo: "9",
            };
        } else if (user.role === 'teacher') {
            newProfile = {
                ...newProfile,
                nickname: "Kru Sri",
                phone: "089-999-8888",
                email: "som_sri@school.ac.th",
                department: "กลุ่มสาระฯ วิทยาศาสตร์",
                advisorClass: "ม.5/1",
            };
        } else if (user.role === 'parent') {
            newProfile = {
                ...newProfile,
                nickname: "Mom",
                phone: "081-555-6666",
                email: "parent@gmail.com",
                childName: "นายเอ็ม (ม.5/1)"
            };
        }

        setProfile(newProfile);
    }, 100); // หน่วงเวลาเล็กน้อย (100ms)

    // Cleanup function
    return () => clearTimeout(timer);

  }, [user]);

  const [activeModal, setActiveModal] = useState<'none' | 'editProfile' | 'help' | 'privacy'>('none');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal('none');
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
  };

  // ถ้ายังโหลด User ไม่เสร็จ
  if (!user) return <div className="h-screen bg-white dark:bg-zinc-950"></div>;

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 transition-colors duration-300 pb-24 relative font-thonburi">
      
      {/* --- Header Profile --- */}
      <div className="bg-white dark:bg-zinc-900 px-6 pt-12 pb-8 rounded-b-3xl shadow-sm mb-6 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-3xl border-4 border-white dark:border-zinc-800 shadow-md">
            {profile.nickname ? profile.nickname[0] : (user.name ? user.name[0] : "U")}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{profile.fullName}</h1>
            
            {/* ✅ Dynamic Header Info ตาม Role */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                   ID: {profile.id}
                </p>
                
                {profile.role === 'student' && (
                    <>
                        <span className="text-gray-300 dark:text-zinc-700">|</span>
                        <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
                           ห้อง {profile.classRoom}
                        </p>
                        <span className="text-gray-300 dark:text-zinc-700">|</span>
                        <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
                           เลขที่ {profile.classNo}
                        </p>
                    </>
                )}

                {profile.role === 'teacher' && (
                    <>
                        <span className="text-gray-300 dark:text-zinc-700">|</span>
                        <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
                           {profile.department}
                        </p>
                    </>
                )}

                {profile.role === 'parent' && (
                    <>
                        <span className="text-gray-300 dark:text-zinc-700">|</span>
                        <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center gap-1">
                           <Baby size={14} /> ผปค. ของ {profile.childName}
                        </p>
                    </>
                )}
            </div>

            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              สถานะ: ยืนยันตัวตนแล้ว
            </div>
          </div>
        </div>
      </div>

      {/* --- Settings Menu --- */}
      <main className="px-6 space-y-6">
        {/* Section 1: App Settings */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 ml-2 uppercase tracking-wider">การตั้งค่าแอปพลิเคชัน</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
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

        {/* Section 2: Account & Security */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 ml-2 uppercase tracking-wider">บัญชีและความปลอดภัย</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
            <MenuItem 
              icon={<User size={20} />} 
              label="แก้ไขข้อมูลส่วนตัว" 
              onClick={() => setActiveModal('editProfile')}
            />
            <MenuItem icon={<Lock size={20} />} label="เปลี่ยนรหัสผ่าน" />
            <MenuItem icon={<Bell size={20} />} label="ตั้งค่าการแจ้งเตือน" />
          </div>
        </section>

        {/* Section 3: Others */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 ml-2 uppercase tracking-wider">ความช่วยเหลือ</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
            <MenuItem icon={<HelpCircle size={20} />} label="ศูนย์ช่วยเหลือ" onClick={() => setActiveModal('help')} />
            <MenuItem icon={<Shield size={20} />} label="นโยบายความเป็นส่วนตัว" onClick={() => setActiveModal('privacy')} />
          </div>
        </section>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition active:scale-95"
        >
          <LogOut size={20} />
          ออกจากระบบ
        </button>

        <p className="text-center text-xs text-gray-400 dark:text-zinc-600 pt-4 pb-8">
          EduTrack Version 1.0.0 (Build 2024.1)
        </p>
      </main>

      {/* --- MODALS --- */}

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
             <div className="space-y-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ข้อมูลพื้นฐาน (แก้ไขไม่ได้)</p>
                <ReadOnlyInput label="ชื่อ-นามสกุล" value={profile.fullName} icon={<UserCircle size={18} />} />
                <ReadOnlyInput label="รหัสประจำตัว" value={profile.id} icon={<Hash size={18} />} />
                
                {profile.role === 'student' && (
                    <div className="grid grid-cols-2 gap-4">
                        <ReadOnlyInput label="ชั้นเรียน" value={profile.classRoom} icon={<School size={18} />} />
                        <ReadOnlyInput label="เลขที่" value={profile.classNo} icon={<Binary size={18} />} />
                    </div>
                )}

                {profile.role === 'teacher' && (
                    <>
                        <ReadOnlyInput label="สังกัด" value={profile.department} icon={<Briefcase size={18} />} />
                        <ReadOnlyInput label="ที่ปรึกษาชั้น" value={profile.advisorClass} icon={<School size={18} />} />
                    </>
                )}

                {profile.role === 'parent' && (
                    <ReadOnlyInput label="ผู้ปกครองของ" value={profile.childName} icon={<Baby size={18} />} />
                )}
             </div>

             <div className="border-t border-gray-100 dark:border-zinc-800"></div>

             <div className="space-y-4">
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">ข้อมูลติดต่อ (แก้ไขได้)</p>
                <EditableInput 
                    label="ชื่อเล่น" 
                    value={profile.nickname} 
                    onChange={(val) => setProfile({...profile, nickname: val})} 
                    icon={<User size={18} />} 
                />
                <EditableInput 
                    label="เบอร์โทรศัพท์" 
                    value={profile.phone} 
                    onChange={(val) => setProfile({...profile, phone: val})} 
                    icon={<Smartphone size={18} />} 
                    type="tel"
                />
                <EditableInput 
                    label="อีเมล" 
                    value={profile.email} 
                    onChange={(val) => setProfile({...profile, email: val})} 
                    icon={<Mail size={18} />} 
                    type="email"
                />
             </div>

             <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition flex items-center justify-center gap-2 mt-8 shadow-lg shadow-indigo-200 dark:shadow-none">
                <Save size={20} /> บันทึกข้อมูล
             </button>
          </form>
        </div>
      )}

      {/* 2. Help Modal */}
      {activeModal === 'help' && (
        <InfoModal title="ศูนย์ช่วยเหลือ" onClose={() => setActiveModal('none')}>
           <div className="space-y-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                 <h3 className="font-bold text-indigo-700 dark:text-indigo-400 mb-3 flex items-center gap-2">
                    <Headset size={20} /> ติดต่อเจ้าหน้าที่
                 </h3>
                 <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                       <span>📞 ห้องวิชาการ (เกรด/ตารางเรียน)</span>
                       <a href="tel:021234567" className="font-semibold text-indigo-600">02-123-4567 ต่อ 101</a>
                    </div>
                    <div className="flex justify-between">
                       <span>💻 ฝ่าย IT (ลืมรหัส/แอปมีปัญหา)</span>
                       <a href="tel:021234567" className="font-semibold text-indigo-600">02-123-4567 ต่อ 202</a>
                    </div>
                    <div className="flex justify-between">
                       <span>💬 LINE Official</span>
                       <span className="font-semibold text-green-600">@EduTrackSupport</span>
                    </div>
                 </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">คำถามที่พบบ่อย (FAQ)</h3>
                {profile.role === 'student' && (
                    <>
                        <FaqItem question="สแกน QR Code ไม่ผ่านทำอย่างไร?" answer="1. ตรวจสอบสิทธิ์การเข้าถึงกล้อง 2. ขยับเข้าใกล้ QR Code 3. แจ้งครูผู้สอน" />
                        <FaqItem question="ตารางเรียนข้อมูลไม่ถูกต้อง?" answer="ติดต่อห้องวิชาการ อาคาร 1 เพื่อตรวจสอบการลงทะเบียนเรียน" />
                        <FaqItem question="ลืมรหัสผ่านเข้าระบบ?" answer="กดปุ่ม 'ลืมรหัสผ่าน' หน้า Login หรือติดต่อครูที่ปรึกษา" />
                    </>
                )}
                {profile.role === 'teacher' && (
                    <>
                        <FaqItem question="วิธีสร้าง QR Code เช็คชื่อ" answer="ไปที่เมนู 'เช็คชื่อ' > เลือกรายวิชา > ระบบจะสร้าง QR Code อัตโนมัติ" />
                        <FaqItem question="แก้ไขสถานะการมาเรียนย้อนหลัง" answer="ไปที่หน้า 'นร.ประจำชั้น' > เลือกรายชื่อ > ประวัติการเข้าเรียน > แก้ไข" />
                        <FaqItem question="ส่งประกาศหานักเรียน" answer="เมนู 'ประกาศ' > กดปุ่มสร้างประกาศใหม่ (+) > เลือกผู้รับ" />
                    </>
                )}
                {profile.role === 'parent' && (
                    <>
                        <FaqItem question="ไม่ได้รับการแจ้งเตือน" answer="ตรวจสอบการตั้งค่า Notification ในมือถือว่าอนุญาตแอป EduTrack หรือไม่" />
                        <FaqItem question="ต้องการลาป่วยให้บุตรหลาน" answer="เมนู 'การมาเรียน' > กดปุ่ม 'แจ้งลา' > เลือกประเภทและระบุเหตุผล" />
                        <FaqItem question="ช่องทางการชำระค่าเทอม" answer="เมนู 'ธุรกรรม' > เลือกรายการ > สแกน QR Payment ผ่านแอปธนาคาร" />
                    </>
                )}
              </div>
           </div>
        </InfoModal>
      )}

      {/* 3. Privacy Modal */}
      {activeModal === 'privacy' && (
        <InfoModal title="นโยบายความเป็นส่วนตัว" onClose={() => setActiveModal('none')}>
           <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 space-y-6">
              <p className="text-xs text-gray-400">แก้ไขล่าสุดเมื่อ: 1 มกราคม 2567</p>
              <section>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">1. ข้อมูลที่เราเก็บรวบรวม</h4>
                  <ul className="list-disc pl-5 space-y-1">
                      <li>ข้อมูลส่วนตัว: ชื่อ, เบอร์โทร, อีเมล</li>
                      <li>ข้อมูลการศึกษา: เกรด, ตารางเรียน</li>
                      <li>ข้อมูลตำแหน่ง (GPS): เฉพาะตอนเช็คชื่อ</li>
                  </ul>
              </section>
              {/* ... More sections ... */}
              <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl mt-4 text-xs text-center text-gray-500">
                หากมีข้อสงสัย ติดต่อ DPO: dpo@edutrack.ac.th
              </div>
           </div>
        </InfoModal>
      )}

      <BottomNav />
    </div>
  );
}

// --- Sub-Components ---

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

function EditableInput({ label, value, onChange, icon, type = "text" }: { label: string, value: string, onChange: (val: string) => void, icon: React.ReactNode, type?: string }) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {icon}
            </div>
            <input 
                type={type} 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white transition"
            />
            </div>
        </div>
    );
}

function InfoModal({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
        <div className="bg-white dark:bg-zinc-900 w-full h-[85%] sm:h-auto sm:max-h-[85%] rounded-t-3xl sm:rounded-3xl p-6 flex flex-col animate-slide-up shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
                    <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-10">
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
       <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{answer}</p>
    </div>
  );
}