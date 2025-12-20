"use client";

import React, { useState, useRef } from 'react';
import { 
  Phone, MessageCircle, Mail, Clock, 
  FileText, Send, Calendar as CalendarIcon,
  ChevronRight, ChevronLeft, ChevronDown, 
  CheckCircle2, Paperclip, X
} from 'lucide-react';

// --- Mock Data ---
const teacherInfo = {
  name: "ครูสมศรี ใจดีมาก",
  role: "ครูประจำชั้น ม.5/1",
  subject: "สอนวิชาภาษาไทย",
  phone: "081-234-5678",
  lineId: "somsri.kru",
  email: "somsri@school.ac.th",
  availableTime: "08:00 - 16:30 น. (จันทร์ - ศุกร์)"
};

const leaveHistory = [
  { id: 1, type: 'sick', title: 'ลาป่วย (ไข้หวัด)', date: '17 ธ.ค. 2568', status: 'approved' },
  { id: 2, type: 'business', title: 'ลากิจ (งานบวช)', date: '3 ธ.ค. 2568', status: 'approved' },
  { id: 3, type: 'sick', title: 'ลาป่วย (ปวดท้อง)', date: '19 พ.ย. 2568', status: 'pending' },
];

// Helper Functions for Date Picker
const monthsTh = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];
const daysTh = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'message' | 'leave'>('message');
  
  // Form States
  const [message, setMessage] = useState('');
  const [leaveType, setLeaveType] = useState('sick'); // sick, business
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  
  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- Modals State ---
  const [showLeaveSuccessModal, setShowLeaveSuccessModal] = useState(false);
  const [showMessageSuccessModal, setShowMessageSuccessModal] = useState(false); // ✅ New state for message popup

  // Date Picker State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // ✅ Handle Message Submit
  const handleSubmitMessage = () => {
    if (!message.trim()) return; // Don't send empty message
    setShowMessageSuccessModal(true); // Show popup
  };

  // ✅ Handle Leave Submit
  const handleSubmitLeave = () => {
    if (!leaveDate || !leaveReason) return;
    setShowLeaveSuccessModal(true); // Show popup
  };

  const handleConfirmDate = (d: number, m: number, y: number) => {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    setLeaveDate(dateStr);
    setIsDatePickerOpen(false);
  };

  const displayDate = leaveDate 
    ? (() => {
        const d = new Date(leaveDate);
        return `${d.getDate()} ${monthsTh[d.getMonth()]} ${d.getFullYear() + 543}`;
      })()
    : '';

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 pb-32 transition-colors duration-300 relative font-thonburi">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 px-6 pt-10 pb-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <MessageCircle className="w-7 h-7 text-indigo-600" />
          ติดต่อครูประจำชั้น
        </h1>
      </header>

      <main className="px-6 py-6 space-y-6">

        {/* 1. Teacher Profile Card */}
        <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-8 -mt-8"></div>
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 p-1 shadow-md border-2 border-white dark:border-zinc-700 flex items-center justify-center text-white text-3xl font-bold">
              {teacherInfo.name.charAt(3)}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{teacherInfo.name}</h2>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{teacherInfo.role}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{teacherInfo.subject}</p>
              
              <div className="items-center gap-1.5 mt-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800/50 p-2 rounded-lg inline-flex">
                <Clock size={12} className="text-indigo-500" />
                <span>สะดวก: {teacherInfo.availableTime}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <a href={`tel:${teacherInfo.phone}`} className="flex flex-col items-center justify-center gap-2 bg-green-50 dark:bg-green-900/10 p-3 rounded-2xl hover:bg-green-100 dark:hover:bg-green-900/20 transition group">
              <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-sm text-green-600 group-hover:scale-110 transition-transform">
                <Phone size={20} />
              </div>
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">โทรหาครู</span>
            </a>
            <button className="flex flex-col items-center justify-center gap-2 bg-green-50 dark:bg-green-900/10 p-3 rounded-2xl hover:bg-green-100 dark:hover:bg-green-900/20 transition group">
              <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-sm text-green-600 group-hover:scale-110 transition-transform">
                <MessageCircle size={20} />
              </div>
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">Line ครู</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/20 transition group">
              <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                <Mail size={20} />
              </div>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">อีเมล</span>
            </button>
          </div>
        </section>

        {/* 2. Action Tabs */}
        <section>
          <div className="flex bg-gray-100 dark:bg-zinc-800/50 p-1 rounded-xl mb-4">
            <button 
              onClick={() => setActiveTab('message')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'message' ? 'bg-white dark:bg-zinc-800 shadow-sm text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <MessageCircle size={16} />
              ส่งข้อความ
            </button>
            <button 
              onClick={() => setActiveTab('leave')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'leave' ? 'bg-white dark:bg-zinc-800 shadow-sm text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <FileText size={16} />
              แจ้งลาหยุด
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800">
            
            {/* --- Case 1: Send Message --- */}
            {activeTab === 'message' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="font-bold text-gray-800 dark:text-white">ฝากข้อความถึงครู</h3>
                <textarea 
                  className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-30"
                  placeholder="พิมพ์ข้อความที่ต้องการฝากถึงครู..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button 
                  onClick={handleSubmitMessage}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95 transition"
                >
                  <Send size={18} />
                  ส่งข้อความ
                </button>
              </div>
            )}

            {/* --- Case 2: Leave Request --- */}
            {activeTab === 'leave' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800 dark:text-white">แบบฟอร์มขอลาหยุด</h3>
                  <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md font-medium">*ส่งให้ครูอนุมัติ</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setLeaveType('sick')}
                    className={`cursor-pointer p-3 rounded-xl border-2 text-center transition-all ${leaveType === 'sick' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600' : 'border-gray-100 dark:border-zinc-800 text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="block text-xl mb-1">🤒</span>
                    <span className="text-sm font-bold">ลาป่วย</span>
                  </div>
                  <div 
                    onClick={() => setLeaveType('business')}
                    className={`cursor-pointer p-3 rounded-xl border-2 text-center transition-all ${leaveType === 'business' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-gray-100 dark:border-zinc-800 text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="block text-xl mb-1">📝</span>
                    <span className="text-sm font-bold">ลากิจ</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block ml-1">วันที่ลา</label>
                  <div 
                    className="relative cursor-pointer" 
                    onClick={() => setIsDatePickerOpen(true)}
                  >
                    <div className={`w-full bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl p-3 pl-10 text-sm ${displayDate ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                      {displayDate || 'เลือกวันที่ต้องการลา'}
                    </div>
                    <CalendarIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block ml-1">เหตุผลการลา</label>
                  <textarea 
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white h-24"
                    placeholder="เช่น เป็นไข้หวัด, ไปทำธุระต่างจังหวัด..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                  ></textarea>
                </div>

                <div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                  <button 
                    onClick={handleFileClick}
                    className={`w-full py-2.5 border border-dashed rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition
                      ${selectedFile 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' 
                        : 'border-gray-300 dark:border-zinc-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50'
                      }`}
                  >
                    <Paperclip size={16} />
                    {selectedFile ? `แนบไฟล์: ${selectedFile.name}` : 'แนบใบรับรองแพทย์ / รูปภาพ (ถ้ามี)'}
                  </button>
                  {selectedFile && (
                    <button onClick={() => setSelectedFile(null)} className="text-xs text-red-500 mt-1 ml-1 hover:underline">
                      ลบไฟล์
                    </button>
                  )}
                </div>

                <button 
                  onClick={handleSubmitLeave}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-200 dark:shadow-red-900/20 active:scale-95 transition mt-2"
                >
                  <Send size={18} />
                  ส่งใบลา
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 3. Leave History */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">ประวัติการลาล่าสุด</h3>
            <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
              ดูทั้งหมด <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {leaveHistory.map((item) => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'sick' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                    {item.type === 'sick' ? '🤒' : '📝'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                  </div>
                </div>
                <div>
                  {item.status === 'approved' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      <CheckCircle2 size={12} /> อนุมัติแล้ว
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                      <Clock size={12} /> รออนุมัติ
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Contact Footer */}
        <div className="pt-4 pb-8 text-center">
          <p className="text-xs text-gray-400 mb-2">หากมีข้อสงสัยเพิ่มเติม กรุณาติดต่อ</p>
          <button className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold inline-flex items-center gap-2 hover:bg-gray-300 transition">
            <Phone size={12} />
            02-123-4567 (ฝ่ายธุรการ)
          </button>
        </div>

      </main>

      {/* --- ✅ Modals --- */}
      
      {/* 1. Date Picker Modal */}
      {isDatePickerOpen && (
        <DatePickerModal 
          onClose={() => setIsDatePickerOpen(false)}
          onConfirm={handleConfirmDate}
        />
      )}

      {/* 2. Leave Request Success Modal */}
      {showLeaveSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 animate-in zoom-in spin-in-180 duration-500">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ส่งใบลาเรียบร้อย!</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              ระบบได้ส่งใบลาของคุณให้คุณครูแล้ว<br/>กรุณารอการอนุมัติ
            </p>
            <button 
              onClick={() => {
                setShowLeaveSuccessModal(false);
                setLeaveReason('');
                setLeaveDate('');
                setSelectedFile(null);
              }}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}

      {/* 3. ✅ New Message Success Modal */}
      {showMessageSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500 animate-in zoom-in duration-500">
              <Send size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ส่งข้อความสำเร็จ!</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              ข้อความของคุณถูกส่งถึงคุณครูเรียบร้อยแล้ว
            </p>
            <button 
              onClick={() => {
                setShowMessageSuccessModal(false);
                setMessage('');
              }}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// --- Sub-Component: Date Picker Modal (Same as before) ---
function DatePickerModal({ onClose, onConfirm }: { 
  onClose: () => void; 
  onConfirm: (d: number, m: number, y: number) => void;
}) {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [view, setView] = useState<'calendar' | 'month' | 'year'>('calendar');

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const years = [today.getFullYear(), today.getFullYear() + 1, today.getFullYear() + 2];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-indigo-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition">
            <X size={20} />
          </button>
          <div className="text-indigo-200 text-sm font-medium mb-1">เลือกวันที่ลา</div>
          
          <div className="flex items-end gap-2">
             <div className="flex flex-col mb-1.5 cursor-pointer hover:opacity-80 transition" onClick={() => setView('month')}>
                <span className="text-lg font-semibold leading-none">{monthsTh[selectedMonth]}</span>
                <span className="text-sm font-light leading-none opacity-80" onClick={(e) => { e.stopPropagation(); setView('year'); }}>{selectedYear + 543}</span>
             </div>
             <ChevronDown size={20} className="mb-2 opacity-50" />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 h-80 overflow-y-auto">
          
          {/* Calendar View */}
          {view === 'calendar' && (
            <div className="animate-in slide-in-from-right-4 duration-200">
               <div className="flex justify-between items-center mb-4 px-2">
                  <span className="font-bold text-gray-700 dark:text-gray-200">{monthsTh[selectedMonth]} {selectedYear + 543}</span>
                  <div className="flex gap-2">
                     <button className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full" onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}>
                        <ChevronLeft size={20} className="text-gray-500" />
                     </button>
                     <button className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full" onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)}>
                        <ChevronRight size={20} className="text-gray-500" />
                     </button>
                  </div>
               </div>
               <div className="grid grid-cols-7 mb-2 text-center">
                  {daysTh.map((d, i) => <div key={i} className="text-xs text-gray-400 font-medium">{d}</div>)}
               </div>
               <div className="grid grid-cols-7 gap-y-2">
                  {days.map((d, i) => {
                     if (!d) return <div key={i}></div>;
                     return (
                        <button 
                           key={i} 
                           onClick={() => onConfirm(d as number, selectedMonth, selectedYear)}
                           className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mx-auto transition-all text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600"
                        >
                           {d}
                        </button>
                     )
                  })}
               </div>
            </div>
          )}

          {/* Month Selector */}
          {view === 'month' && (
            <div className="grid grid-cols-3 gap-3 animate-in zoom-in-95 duration-200">
              {monthsTh.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedMonth(idx); setView('calendar'); }}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 border
                    ${selectedMonth === idx 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                      : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-transparent hover:border-indigo-200 dark:hover:border-zinc-700'
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {/* Year Selector */}
          {view === 'year' && (
            <div className="space-y-2 animate-in zoom-in-95 duration-200">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">เลือกปี</div>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => { setSelectedYear(y); setView('month'); }}
                  className={`w-full p-4 rounded-xl text-lg font-bold flex justify-between items-center transition-all duration-200
                    ${selectedYear === y 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
                      : 'hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <span>{y + 543}</span>
                  <span className="text-sm font-normal text-gray-400">{y}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}