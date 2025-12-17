// app/context/NotificationContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Types (ย้ายมาจากหน้าเดิม) ---
export type NotificationType = 'cancel_class' | 'school_holiday' | 'attendance_reminder' | 'entry_exit' | 'absence_risk';

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  fullDetail?: string;
  time: string;
  isRead: boolean;
}

// --- Mock Data (ข้อมูลชุดเดิม) ---
const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'absence_risk',
    title: "แจ้งเตือนความเสี่ยงขาดเรียน!",
    message: "คุณขาดเรียนวิชา 'คณิตศาสตร์เพิ่มเติม' สะสมครบ 3 ครั้งแล้ว กรุณาติดต่อครูที่ปรึกษา",
    fullDetail: "เรียน นายทินภัทร, ขณะนี้คุณมีสถิติขาดเรียนวิชา ค30201 คณิตศาสตร์เพิ่มเติม สะสมครบ 3 ครั้ง ซึ่งเข้าเกณฑ์เฝ้าระวังระดับ 1 (Warning) หากขาดเรียนอีก 1 ครั้ง จะหมดสิทธิ์สอบทันที ขอให้นักเรียนติดต่อครูผู้สอนเพื่อชี้แจงเหตุผลโดยด่วน",
    time: "10 นาทีที่แล้ว",
    isRead: false,
  },
  {
    id: 2,
    type: 'attendance_reminder',
    title: "ใกล้หมดเวลาเช็คชื่อ",
    message: "อย่าลืมสแกน QR Code เช็คชื่อหน้าเสาธงก่อนเวลา 08:00 น.",
    fullDetail: "ระบบตรวจพบว่าคุณอยู่ในบริเวณโรงเรียนแล้ว (GPS: อาคาร 9) แต่ยังไม่ได้ทำการสแกน QR Code เพื่อเช็คชื่อเข้าแถวหน้าเสาธง กรุณาดำเนินการภายในเวลา 08:00 น. เพื่อไม่ให้ระบบบันทึกสถานะเป็น 'มาสาย'",
    time: "30 นาทีที่แล้ว",
    isRead: false,
  },
  {
    id: 3,
    type: 'cancel_class',
    title: "แจ้งงดการเรียนการสอน",
    message: "วิชา ฟิสิกส์ (คาบ 5) วันนี้งดการเรียนการสอน ให้นักเรียนศึกษาค้นคว้าด้วยตนเอง",
    fullDetail: "แจ้งงดการเรียนการสอน วิชา ว30201 ฟิสิกส์ 1 คาบที่ 5 (เวลา 13:00-13:50 น.) วันนี้ เนื่องจากครูวิชัยติดภารกิจราชการด่วน ให้นักเรียนศึกษาค้นคว้าด้วยตนเองที่ห้องสมุด หรือทบทวนบทเรียนในห้องเรียนตามอัธยาศัย",
    time: "1 ชั่วโมงที่แล้ว",
    isRead: false,
  },
  {
    id: 4,
    type: 'entry_exit',
    title: "เช็คอินเข้าโรงเรียนสำเร็จ",
    message: "ระบบบันทึกเวลาเข้าเรียนของคุณเรียบร้อยแล้ว (07:45 น.)",
    fullDetail: "บันทึกเวลาเข้าโรงเรียนสำเร็จ เวลา 07:45 น. ผ่านจุดตรวจประตู 1 (หน้าโรงเรียน) สถานะ: มาทันเวลา ระบบได้ส่งการแจ้งเตือนไปยังแอปพลิเคชันผู้ปกครองเรียบร้อยแล้ว",
    time: "วันนี้ 07:45 น.",
    isRead: true,
  },
  {
    id: 5,
    type: 'school_holiday',
    title: "ประกาศหยุดเรียนกรณีพิเศษ",
    message: "โรงเรียนหยุดทำการในวันศุกร์ที่ 16 ก.พ. เพื่อเตรียมสถานที่สอบ O-NET",
    fullDetail: "ประกาศจากฝ่ายวิชาการ: โรงเรียนหยุดทำการเรียนการสอนในวันศุกร์ที่ 16 กุมภาพันธ์ 2567 เนื่องจากมีการใช้สถานที่ในการจัดสอบ O-NET ระดับชั้นมัธยมศึกษาปีที่ 3 ขอให้นักเรียนทบทวนบทเรียนอยู่ที่บ้าน และเปิดเรียนตามปกติในวันจันทร์ที่ 19 กุมภาพันธ์",
    time: "เมื่อวานนี้",
    isRead: true,
  },
];

// --- Context Definition ---
interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook สำหรับเรียกใช้ในหน้าต่างๆ
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}