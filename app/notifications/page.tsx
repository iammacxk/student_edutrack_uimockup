// app/notifications/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useNotification, NotificationItem, NotificationType } from "../context/NotificationContext";
import BottomNav from "../components/BottomNav"; // ✅ Import BottomNav
import { 
  ChevronLeft, CheckCheck, Bell, CalendarX, School, Clock, LogIn, AlertTriangle, X
} from "lucide-react";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'system' | 'urgent'>('all'); // เพิ่ม Filter

  // Logic กรองข้อมูล
  const filteredNotifications = notifications.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return item.type === 'absence_risk' || item.type === 'cancel_class';
    if (filter === 'system') return item.type === 'entry_exit' || item.type === 'school_holiday';
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
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getIconStyle(item.type)}`}>
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 pr-4">
                  <h3 className={`font-semibold text-sm mb-1 ${item.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-200'}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed line-clamp-2">
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
           <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
              <Bell size={48} className="mb-4 opacity-20" />
              <p>ไม่มีการแจ้งเตือน</p>
           </div>
        )}
      </main>

      {/* --- Popup Modal --- */}
      {selectedNotif && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={closeModal}></div>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl animate-slide-up">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>

            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${getIconStyle(selectedNotif.type)}`}>
               {getIcon(selectedNotif.type)}
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{selectedNotif.title}</h3>
            <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
              <Clock size={12} /> {selectedNotif.time}
            </p>
            
            <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-zinc-700 mb-6">
              {selectedNotif.fullDetail || selectedNotif.message}
            </div>

            <button onClick={closeModal} className="w-full py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-lg shadow-indigo-200 dark:shadow-none">
              รับทราบ
            </button>
          </div>
        </div>
      )}

      {/* ✅ ใช้ BottomNav Component แทนการ Hard code */}
      <BottomNav />

    </div>
  );
}

// --- Helper Functions ---

// 1. ปุ่ม Tab (เพิ่มใหม่)
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
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${isActive ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}>
            {count}
          </span>
        )}
      </button>
    );
  }

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

function getIconStyle(type: NotificationType) {
  switch (type) {
    case 'cancel_class': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    case 'school_holiday': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    case 'attendance_reminder': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'entry_exit': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    case 'absence_risk': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }
}