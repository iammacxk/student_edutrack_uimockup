"use client";

import React, { JSX, useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { useNotification, NotificationItem, NotificationType } from "../context/NotificationContext";
import BottomNav from "../components/BottomNav"; 
import { 
  ChevronLeft, CheckCheck, Bell, CalendarX, School, Clock, 
  LogIn, AlertTriangle, X, Wallet
} from "lucide-react";

// --- 1. Define Bank Interface ---
interface Bank {
  name: string;
  src: string;
}

// --- 2. Typed Bank Configuration ---
const BANKS: Bank[] = [
  { 
    name: "ธ.กสิกรไทย", 
    src: "/kasikorn.png" 
  },
  { 
    name: "ธ.ไทยพาณิชย์", 
    src: "/scb.png" 
  },
  { 
    name: "ธ.กรุงเทพ", 
    src: "/krungthep.png" 
  },
  { 
    name: "ธ.กรุงไทย", 
    src: "/krungthai.png" 
  },
  { 
    name: "ธ.กรุงศรีฯ", 
    src: "/krungsri.png" 
  },
];

// --- 🛠️ PromptPay Payload Generator ---
function generatePromptPayPayload(mobileNumber: string, amount: number) {
  const target = mobileNumber.replace(/^0/, '66');
  const amountStr = amount.toFixed(2);
  const f_00 = '000201';
  const f_01 = '010212';
  const aid = '0016A000000677010111';
  const mobileTag = `01${String('00' + target).length.toString().padStart(2, '0')}00${target}`;
  const f_29_content = aid + mobileTag;
  const f_29 = `29${f_29_content.length}${f_29_content}`;
  const f_53 = '5303764';
  const f_54 = `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`;
  const f_58 = '5802TH';
  const rawData = f_00 + f_01 + f_29 + f_53 + f_54 + f_58 + '6304';
  let crc = 0xFFFF;
  for (let i = 0; i < rawData.length; i++) {
    let x = ((crc >> 8) ^ rawData.charCodeAt(i)) & 0xFF;
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
  }
  const crcStr = crc.toString(16).toUpperCase().padStart(4, '0');
  return rawData + crcStr;
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'system' | 'urgent'>('all');

  // Logic กรองข้อมูล
  const filteredNotifications = notifications.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return item.type === 'absence_risk' || item.type === 'cancel_class' || item.type === 'payment';
    if (filter === 'system') return item.type === 'entry_exit' || item.type === 'school_holiday' || item.type === 'grade_alert';
    return true;
  });

  const handleItemClick = (item: NotificationItem) => {
    setSelectedNotif(item);
    if (!item.isRead) {
      markAsRead(item.id);
    }
  };

  const closeModal = () => {
    setSelectedNotif(null);
  };

  const qrPayload = selectedNotif?.type === 'payment' 
    ? generatePromptPayPayload("0953935451", selectedNotif.paymentAmount || 0) 
    : "";

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 relative transition-colors duration-300 pb-24">
      
      {/* --- Header --- */}
      <div className="bg-white dark:bg-zinc-900 px-6 pt-12 pb-4 shadow-sm sticky top-0 z-20 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <Link href="/dashboard">
            <button className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
              <ChevronLeft size={24} />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 text-center pr-8">การแจ้งเตือน</h1>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
            <TabButton label="ทั้งหมด" isActive={filter === 'all'} onClick={() => setFilter('all')} count={unreadCount} />
            <TabButton label="เรื่องด่วน" isActive={filter === 'urgent'} onClick={() => setFilter('urgent')} />
            <TabButton label="ระบบ" isActive={filter === 'system'} onClick={() => setFilter('system')} />
        </div>

        <div className="flex justify-between items-end">
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            แสดง {filteredNotifications.length} รายการ
          </p>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 hover:underline"
            >
              <CheckCheck size={14} /> อ่านทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* --- Notification List --- */}
      <main className="px-4 py-4 space-y-3 flex-1 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${
                item.isRead 
                  ? 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm opacity-80' 
                  : 'bg-white dark:bg-zinc-900 border-indigo-100 dark:border-indigo-900 shadow-md ring-1 ring-indigo-50 dark:ring-indigo-900/30'
              }`}
            >
              {!item.isRead && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              )}

              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getIconStyle(item.type)}`}>
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 pr-4">
                  <h3 className={`font-semibold text-sm mb-1 ${item.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-200'}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {item.message}
                  </p>
                  
                  {item.type === 'payment' && (
                     <span className="inline-block mt-2 text-[10px] font-bold bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400 px-2 py-0.5 rounded-md border border-pink-100 dark:border-pink-900/30">
                       ฿{(item.paymentAmount || 0).toLocaleString()}
                     </span>
                   )}

                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    {item.time}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
              <Bell size={48} className="mb-4 opacity-20" />
              <p>ไม่มีการแจ้งเตือน</p>
           </div>
        )}
      </main>

      {/* --- Popup Modal --- */}
      {selectedNotif && (
        <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={closeModal}></div>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl overflow-hidden relative z-10 shadow-2xl animate-slide-up flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className={`p-6 relative text-white shrink-0 ${getModalHeaderStyle(selectedNotif.type)}`}>
                <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-black/10 rounded-full hover:bg-black/20 transition">
                    <X size={20} className="text-white" />
                </button>
                <div className="flex flex-col items-center text-center mt-2">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md mb-3 shadow-inner border border-white/30">
                       {/* ✅ แก้ Error โดยระบุ Type ของ Props ให้ชัดเจนแทน any */}
                       {React.cloneElement(getIcon(selectedNotif.type) as React.ReactElement<{ size?: number | string; color?: string }>, { size: 32, color: 'white' })}
                    </div>
                    <h2 className="text-lg font-bold px-4">{selectedNotif.title}</h2>
                    <p className="text-xs opacity-90 mt-1 flex items-center gap-1 font-medium">
                        <Clock size={12} /> {selectedNotif.time}
                    </p>
                </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
                {selectedNotif.type === 'payment' ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">ยอดชำระทั้งหมด</p>
                            <h3 className="text-3xl font-bold text-[#003D7A] dark:text-blue-400">
                                ฿{(selectedNotif.paymentAmount || 0).toLocaleString()}
                            </h3>
                            {selectedNotif.dueDate && (
                                <p className="text-xs text-red-500 mt-2 bg-red-50 dark:bg-red-900/20 py-1 px-3 rounded-full inline-block font-medium">
                                    กำหนดชำระ: {selectedNotif.dueDate}
                                </p>
                            )}
                        </div>

                        <div className="border-t border-gray-100 dark:border-zinc-800"></div>

                        {/* PromptPay QR */}
                        <div className="bg-[#1a3c6d] dark:bg-zinc-800 rounded-2xl p-5 flex flex-col items-center shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-400 to-indigo-500"></div>
                            <div className="relative h-8 w-32 mb-4">
                                <Image 
                                  src="/prompt-pay-logo.png" 
                                  alt="PromptPay" 
                                  fill
                                  className="object-contain brightness-0 invert opacity-90"
                                />
                            </div>
                            
                            <div className="bg-white p-3 rounded-xl shadow-sm mb-3">
                                <Image 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrPayload)}`}
                                    alt="Payment QR" 
                                    width={160}
                                    height={160}
                                    className="mix-blend-multiply dark:mix-blend-normal"
                                />
                            </div>
                            <p className="text-[10px] text-blue-100 text-center font-light">สแกนเพื่อชำระเงิน</p>
                            <p className="text-[10px] text-white mt-1 font-medium">095-393-5451 (โรงเรียนมัธยมสาธิต)</p>
                        </div>

                        {/* Supported Banks Logos */}
                        <div className="space-y-4 pt-2">
                            <div className="relative flex py-1 items-center">
                                <div className="grow border-t border-gray-200 dark:border-zinc-700"></div>
                                <span className="shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wide font-medium">
                                    รองรับธนาคาร
                                </span>
                                <div className="grow border-t border-gray-200 dark:border-zinc-700"></div>
                            </div>
                            
                            <div className="flex justify-center items-center gap-3 flex-wrap">
                                {BANKS.map((bank: Bank, index: number) => (
                                    <div key={index} className="group relative">
                                        <div className="w-11 h-11 bg-white border border-gray-100 dark:border-zinc-700 rounded-full p-2 shadow-sm hover:scale-110 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center overflow-hidden">
                                            <div className="relative w-full h-full">
                                                <Image 
                                                    src={bank.src} 
                                                    alt={bank.name} 
                                                    fill
                                                    className="object-contain" 
                                                />
                                            </div>
                                        </div>
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                                            {bank.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* --- Normal Notification UI --- */
                    <>
                        <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl text-sm text-gray-800 dark:text-gray-200 leading-relaxed border border-gray-100 dark:border-zinc-700 mb-6 font-medium">
                            {selectedNotif.fullDetail || selectedNotif.message}
                        </div>
                        <button onClick={closeModal} className="w-full py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
                            ปิดหน้าต่าง
                        </button>
                    </>
                )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />

    </div>
  );
}

// --- Helper Functions ---

function TabButton({ label, isActive, onClick, count }: { label: string, isActive: boolean, onClick: () => void, count?: number }) {
    return (
      <button 
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
          isActive 
          ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-md' 
          : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400'
        }`}
      >
        {label}
        {count !== undefined && count > 0 && (
          <span className={`min-w-4 h-4 px-1 rounded-full flex items-center justify-center text-[9px] ${isActive ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}>
            {count}
          </span>
        )}
      </button>
    );
}

function getModalHeaderStyle(type: NotificationType) {
  switch (type) {
    case 'cancel_class': return 'bg-orange-500';
    case 'school_holiday': return 'bg-blue-500';
    case 'attendance_reminder': return 'bg-yellow-500'; 
    case 'entry_exit': return 'bg-green-600';
    case 'absence_risk': return 'bg-red-600';
    case 'payment': return 'bg-[#003d6b]';
    default: return 'bg-gray-700';
  }
}

function getIcon(type: NotificationType): JSX.Element {
  switch (type) {
    case 'cancel_class': return <CalendarX size={24} />;
    case 'school_holiday': return <School size={24} />;
    case 'attendance_reminder': return <Clock size={24} />;
    case 'entry_exit': return <LogIn size={24} />;
    case 'absence_risk': return <AlertTriangle size={24} />;
    case 'payment': return <Wallet size={24} />; 
    default: return <Bell size={24} />;
  }
}

function getIconStyle(type: NotificationType) {
  switch (type) {
    case 'cancel_class': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    case 'school_holiday': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    case 'attendance_reminder': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'entry_exit': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    case 'absence_risk': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    case 'payment': return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400';
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }
}