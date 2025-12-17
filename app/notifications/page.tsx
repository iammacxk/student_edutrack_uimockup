// app/notifications/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
// เพิ่ม NotificationType ใน import
import { useNotification, NotificationItem, NotificationType } from "../context/NotificationContext"; 
import { 
  ChevronLeft, CheckCheck, Bell, CalendarX, School, Clock, LogIn, AlertTriangle, X,
  Home, CalendarDays, ScanLine, User
} from "lucide-react";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);

  const handleItemClick = (item: NotificationItem) => {
    setSelectedNotif(item);
    if (!item.isRead) {
      markAsRead(item.id);
    }
  };

  const closeModal = () => {
    setSelectedNotif(null);
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8F9FA] relative">
      
      {/* --- Header --- */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between mb-2">
          <Link href="/">
            <button className="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition">
              <ChevronLeft size={24} />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex-1 text-center pr-8">การแจ้งเตือน</h1>
        </div>
        
        <div className="flex justify-between items-end">
          <p className="text-gray-500 text-sm">
            คุณมี <span className={unreadCount > 0 ? "text-red-500 font-bold" : "text-gray-500"}>{unreadCount}</span> ข้อความที่ยังไม่อ่าน
          </p>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:underline"
            >
              <CheckCheck size={14} /> อ่านทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* --- Notification List --- */}
      <main className="px-4 py-4 space-y-3 overflow-y-auto pb-32">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${
                item.isRead 
                  ? 'bg-white border-gray-100 shadow-sm opacity-80' 
                  : 'bg-white border-indigo-100 shadow-md ring-1 ring-indigo-50'
              }`}
            >
              {!item.isRead && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              )}

              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getIconStyle(item.type)}`}>
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 pr-4">
                  <h3 className={`font-semibold text-sm mb-1 ${item.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {item.message}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    {item.time}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Bell size={48} className="mb-4 opacity-20" />
              <p>ไม่มีการแจ้งเตือน</p>
           </div>
        )}
      </main>

      {/* --- Popup Modal --- */}
      {selectedNotif && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={closeModal}></div>
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl animate-slide-up">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
              <X size={20} className="text-gray-600" />
            </button>

            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${getIconStyle(selectedNotif.type)}`}>
               {getIcon(selectedNotif.type)}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedNotif.title}</h3>
            <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
              <Clock size={12} /> {selectedNotif.time}
            </p>
            
            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed border border-gray-100 mb-6">
              {selectedNotif.fullDetail || selectedNotif.message}
            </div>

            <button onClick={closeModal} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
              รับทราบ
            </button>
          </div>
        </div>
      )}

      {/* --- Bottom Navigation --- */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-6 py-4 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-40">
        <div className="flex justify-between items-center relative">
          <Link href="/"><NavItem icon={<Home size={24} />} label="ภาพรวม" /></Link>
          <Link href="/schedule"><NavItem icon={<CalendarDays size={24} />} label="ตารางเรียน" /></Link>
          <div className="relative -top-8">
            <Link href="/scan">
              <div className="bg-indigo-600 p-4 rounded-full shadow-lg shadow-indigo-300 ring-4 ring-white cursor-pointer transform transition active:scale-95">
                <ScanLine size={28} color="white" />
              </div>
            </Link>
          </div>
          <Link href="/notifications">
            <NavItem icon={<Bell size={24} />} label="แจ้งเตือน" active={true} hasBadge={unreadCount > 0} />
          </Link>
          <NavItem icon={<User size={24} />} label="บัญชี" />
        </div>
      </div>

    </div>
  );
}

// --- Helper Functions (แก้ไข Type ตรงนี้ครับ) ---

// เปลี่ยน any เป็น NotificationType
function getIcon(type: NotificationType) {
  switch (type) {
    case 'cancel_class': return <CalendarX size={24} />;
    case 'school_holiday': return <School size={24} />;
    case 'attendance_reminder': return <Clock size={24} />;
    case 'entry_exit': return <LogIn size={24} />;
    case 'absence_risk': return <AlertTriangle size={24} />;
    default: return <Bell size={24} />;
  }
}

// เปลี่ยน any เป็น NotificationType
function getIconStyle(type: NotificationType) {
  switch (type) {
    case 'cancel_class': return 'bg-orange-100 text-orange-600';
    case 'school_holiday': return 'bg-blue-100 text-blue-600';
    case 'attendance_reminder': return 'bg-yellow-100 text-yellow-700';
    case 'entry_exit': return 'bg-green-100 text-green-600';
    case 'absence_risk': return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-600';
  }
}

// เปลี่ยน icon: any เป็น icon: React.ReactNode
function NavItem({ icon, label, active = false, hasBadge = false }: { icon: React.ReactNode, label: string, active?: boolean, hasBadge?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 cursor-pointer ${active ? 'text-indigo-600' : 'text-gray-400'}`}>
      <div className="relative">
        {icon}
        {hasBadge && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}