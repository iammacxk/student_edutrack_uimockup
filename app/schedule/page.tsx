"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import {
  MoreVertical,
  CalendarDays,
  Users,
  Phone,
  Search,
  Filter,
  MapPin,
  BookOpen,
  Coffee,
  Beaker,
  User,
} from "lucide-react";

// ----------------------------------------------------------------------
// MAIN PAGE: ตัวคัดแยก Role
// ----------------------------------------------------------------------
export default function SchedulePage() {
  const { user } = useAuth();

  // ป้องกัน Error กรณี Refresh แล้ว Auth ยังไม่โหลด
  if (!user) return <div className="h-screen bg-white dark:bg-zinc-950"></div>;

  return (
    <>
      {user.role === "teacher" ? (
        <TeacherScheduleView />
      ) : (
        <StudentScheduleView />
      )}
      <BottomNav />
    </>
  );
}

// ----------------------------------------------------------------------
// 👨‍🏫 TEACHER VIEW: ตารางสอน & นักเรียนประจำชั้น (Updated)
// ----------------------------------------------------------------------
function TeacherScheduleView() {
  const [activeTab, setActiveTab] = useState("schedule"); // 'schedule' | 'students'
  const [scheduleView, setScheduleView] = useState("today"); // 'today' | 'week'

  // 1. เพิ่ม State สำหรับเลือกวันในมุมมองสัปดาห์
  const [selectedDay, setSelectedDay] = useState("จันทร์");

  // 2. เพิ่ม State สำหรับ Search นักเรียน
  const [searchQuery, setSearchQuery] = useState("");

  // 3. Mock Data: ตารางสอนทั้งสัปดาห์ (Key คือวัน)
  interface TeacherScheduleSlot {
    time: string;
    subject: string;
    room: string;
    class: string;
    status: string;
  }

  const weeklySchedule: Record<string, TeacherScheduleSlot[]> = {
    "จันทร์": [
        { time: "08:30 - 10:10", subject: "ฟิสิกส์ 1 (คู่)", room: "LAB Phy", class: "ม.5/1", status: "upcoming" },
        { time: "10:10 - 11:00", subject: "ว่าง", room: "-", class: "-", status: "free" },
        { time: "13:00 - 13:50", subject: "กิจกรรมโฮมรูม", room: "501", class: "ม.5/1", status: "upcoming" },
    ],
    "อังคาร": [
        { time: "09:20 - 10:10", subject: "วิทยาศาสตร์โลก", room: "402", class: "ม.4/2", status: "upcoming" },
        { time: "11:00 - 11:50", subject: "ชุมนุมวิชาการ", room: "-", class: "Mixed", status: "upcoming" },
    ],
    "พุธ": [
        { time: "08:30 - 09:20", subject: "ฟิสิกส์ 1", room: "LAB Phy", class: "ม.5/1", status: "upcoming" },
        { time: "09:20 - 10:10", subject: "ฟิสิกส์ 1", room: "LAB Phy", class: "ม.5/1", status: "upcoming" },
        { time: "10:10 - 11:00", subject: "ว่าง", room: "-", class: "-", status: "free" },
        { time: "11:00 - 11:50", subject: "วิทยาศาสตร์พื้นฐาน", room: "402", class: "ม.4/3", status: "upcoming" },
        { time: "13:00 - 13:50", subject: "พักเที่ยง", room: "-", class: "-", status: "break" },
        { time: "13:50 - 14:40", subject: "ฟิสิกส์ 2", room: "LAB Phy", class: "ม.6/1", status: "upcoming" },
    ],
    "พฤหัส": [
        { time: "08:30 - 09:20", subject: "ลูกเสือ/เนตรนารี", room: "สนาม", class: "ม.5", status: "upcoming" },
    ],
    "ศุกร์": [
        { time: "13:00 - 14:40", subject: "โครงงานวิทย์", room: "LAB Chem", class: "ม.5/1", status: "upcoming" },
    ]
  };

  const daysOfWeek = ["จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์"];

  // Logic เลือกข้อมูลที่จะแสดง (ถ้าเลือก Today ให้ดึงวันพุธ, ถ้าเลือก Week ให้ดึงตาม selectedDay)
  const displayedSchedule = scheduleView === 'today' ? weeklySchedule["พุธ"] : weeklySchedule[selectedDay];

  // Mock Data: นักเรียน
  const students = [
    {
      no: 1,
      id: "6616001",
      name: "นายรักเรียน เพียรศึกษา",
      nickname: "กิต",
      status: "normal",
      risk: false,
    },
    {
      no: 2,
      id: "6616002",
      name: "นางสาวใจดี เรียนเก่ง",
      nickname: "ใจ",
      status: "normal",
      risk: false,
    },
    {
      no: 3,
      id: "6616003",
      name: "นายสมชาย มาสาย",
      nickname: "ชาย",
      status: "risk",
      risk: true,
      riskDetail: "ขาดเรียน 6 วัน",
    },
    {
      no: 4,
      id: "6616004",
      name: "นายดื้อ ดึงดัน",
      nickname: "ดื้อ",
      status: "risk",
      risk: true,
      riskDetail: "ขาดเรียน 8 วัน",
    },
    {
      no: 5,
      id: "6616005",
      name: "นางสาวสายเสมอ รอเธอ",
      nickname: "เกรด",
      status: "normal",
      risk: false,
    },
  ];

  // Logic กรองนักเรียนตาม searchQuery
  const filteredStudents = students.filter((std) => {
    const query = searchQuery.toLowerCase();
    return (
      std.name.includes(query) ||
      std.nickname.includes(query) ||
      std.no.toString().includes(query) ||
      std.id.includes(query)
    );
  });

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 transition-colors duration-300 pb-24 font-thonburi">
      {/* --- Header Teacher --- */}
      <header className="bg-white dark:bg-zinc-900 px-6 pt-12 pb-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeTab === "schedule" ? "ตารางสอน 📅" : "ประจำชั้น 👥"}
          </h1>
          <button className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition">
            <MoreVertical
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
          </button>
        </div>

        {/* Main Tab Switcher */}
        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl mb-2">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "schedule"
                ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <CalendarDays size={16} /> ตารางสอน
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "students"
                ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Users size={16} /> นักเรียน (5/1)
          </button>
        </div>
      </header>

      {/* --- Content Teacher --- */}
      <main className="px-6 py-4 flex-1 overflow-y-auto">
        {/* VIEW 1: ตารางสอน */}
        {activeTab === "schedule" && (
          <div className="space-y-4 animate-slide-up">
            {/* View Switcher (Today / Week) */}
            <div className="flex justify-center gap-4 mb-2">
              <button
                onClick={() => setScheduleView("today")}
                className={`text-xs font-medium px-4 py-1.5 rounded-full border transition ${
                  scheduleView === "today"
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                วันนี้
              </button>
              <button
                onClick={() => setScheduleView("week")}
                className={`text-xs font-medium px-4 py-1.5 rounded-full border transition ${
                  scheduleView === "week"
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                ทั้งสัปดาห์
              </button>
            </div>

            {/* ✅ Day Selector (เฉพาะตอนเลือก Weekly) */}
            {scheduleView === "week" && (
              <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-2 rounded-xl border border-gray-100 dark:border-zinc-800 mb-4 overflow-x-auto">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                      selectedDay === day
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}

            {/* Schedule List */}
            <div className="space-y-3">
              <p className="text-xs text-gray-400 font-medium mb-2 text-center">
                {scheduleView === "today"
                  ? "วันพุธที่ 14 กุมภาพันธ์"
                  : `ตารางสอนวัน${selectedDay}`}
              </p>

              {displayedSchedule && displayedSchedule.length > 0 ? (
                     displayedSchedule.map((slot, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 p-4 rounded-2xl border ${
                      slot.status === "free"
                        ? "bg-gray-50 dark:bg-zinc-900 border-dashed border-gray-200 dark:border-zinc-800"
                        : slot.status === "break"
                        ? "bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30"
                        : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center min-w-15 border-r border-gray-100 dark:border-zinc-800 pr-4">
                      <span className="text-xs text-gray-400">
                        {slot.time.split("-")[0]}
                      </span>
                      <span className="text-xs text-gray-300">-</span>
                      <span className="text-xs text-gray-400">
                        {slot.time.split("-")[1]}
                      </span>
                    </div>
                    <div className="flex-1">
                      {slot.status === "free" ? (
                        <p className="text-gray-400 italic text-sm">
                          ว่าง (เตรียมการสอน)
                        </p>
                      ) : slot.status === "break" ? (
                        <div className="flex items-center gap-2 text-orange-400">
                          <Coffee size={18} />{" "}
                          <span className="text-sm font-medium">พักเที่ยง</span>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-bold text-gray-800 dark:text-gray-200">
                            {slot.subject}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Users size={12} /> {slot.class}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> {slot.room}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <CalendarDays size={40} className="mb-2 opacity-30" />
                  <p className="text-sm">ไม่มีตารางสอนในวันนี้</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: นักเรียนประจำชั้น (Code เดิมที่คุณทำไว้แล้ว) */}
        {activeTab === "students" && (
          <div className="space-y-4 animate-slide-up">
            {/* ...ส่วน Search และ List นักเรียน (ตาม Code เดิม) ... */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อ หรือเลขที่..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg text-gray-500">
                <Filter size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((std) => (
                  <div
                    key={std.id}
                    className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md ${
                            std.risk ? "bg-red-500" : "bg-indigo-400"
                          }`}
                        >
                          {std.nickname[0]}
                        </div>

                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-zinc-700 shadow-sm">
                          <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                            {std.no}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">
                            {std.name}
                          </h4>
                          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                            เลขที่ {std.no}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">ID: {std.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {std.risk && (
                        <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] px-2 py-1 rounded-full font-bold">
                          {std.riskDetail}
                        </span>
                      )}
                      <button className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full hover:bg-green-100 transition">
                        <Phone size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400 text-sm">
                  ไม่พบข้อมูลที่ค้นหา
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// 👨‍🎓 STUDENT VIEW (Code เดิม)
// ----------------------------------------------------------------------
function StudentScheduleView() {
  // Mock Data เดิม
  type ClassSession = {
    id: string;
    time: string;
    subject: string;
    code: string;
    room: string;
    teacher: string;
    type: "class" | "break";
    status: "finished" | "current" | "upcoming";
    color: string;
  };
  const fullWeeklySchedule: Record<string, ClassSession[]> = {
    Wednesday: [
      {
        id: "w1",
        time: "08:30 - 09:20",
        subject: "เคมี 1",
        code: "ว30221",
        room: "LAB Chem",
        teacher: "อ.อุษา",
        type: "class",
        status: "finished",
        color: "bg-cyan-100 text-cyan-800",
      },
      {
        id: "w2",
        time: "09:20 - 10:10",
        subject: "เคมี 1",
        code: "ว30221",
        room: "LAB Chem",
        teacher: "อ.อุษา",
        type: "class",
        status: "finished",
        color: "bg-cyan-100 text-cyan-800",
      },
      {
        id: "w3",
        time: "10:10 - 11:00",
        subject: "ภาษาอังกฤษฟัง-พูด",
        code: "อ30201",
        room: "ENG Sound Lab",
        teacher: "Teacher Jessica",
        type: "class",
        status: "finished",
        color: "bg-purple-100 text-purple-800",
      },
      {
        id: "w4",
        time: "11:00 - 11:50",
        subject: "คณิตศาสตร์เพิ่มเติม",
        code: "ค30201",
        room: "911",
        teacher: "อ.ศักดิ์ดา",
        type: "class",
        status: "finished",
        color: "bg-red-100 text-red-800",
      },
      {
        id: "w5",
        time: "13:00 - 13:50",
        subject: "ศิลปะ (ทัศนศิลป์)",
        code: "ศ31101",
        room: "Art Room",
        teacher: "อ.ติสท์",
        type: "class",
        status: "current",
        color: "bg-fuchsia-100 text-fuchsia-800",
      },
      {
        id: "w6",
        time: "13:50 - 14:40",
        subject: "ลูกเสือ/รด.",
        code: "ก30903",
        room: "สนาม",
        teacher: "ครูฝึก",
        type: "class",
        status: "upcoming",
        color: "bg-green-700 text-white",
      },
      {
        id: "w7",
        time: "14:40 - 15:30",
        subject: "ศึกษาค้นคว้า",
        code: "I30201",
        room: "Library",
        teacher: "อ.บรรณารักษ์",
        type: "class",
        status: "upcoming",
        color: "bg-gray-100 text-gray-600",
      },
    ],
    // ... (สามารถใส่ data วันอื่นเพิ่มได้)
  };

  const [activeTab, setActiveTab] = useState<"today" | "weekly">("today");
  const daysOfWeek = ["จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์"];
  const [selectedDay, setSelectedDay] = useState<string>("พุธ");
  const currentSchedule = fullWeeklySchedule["Wednesday"]; // Mock ไว้ที่วันพุธ

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 transition-colors duration-300 pb-24 font-thonburi">
      {/* Header Student */}
      <header className="bg-white dark:bg-zinc-900 px-6 pt-12 pb-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            ตารางเรียน 📅
          </h1>
          <button className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-full hover:bg-gray-100 transition">
            <MoreVertical
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
          </button>
        </div>
        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("today")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "today"
                ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            วันนี้
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "weekly"
                ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            รายสัปดาห์
          </button>
        </div>
      </header>

      {/* Content Student */}
      <main className="px-6 py-6 flex-1 overflow-y-auto">
        {activeTab === "weekly" && (
          <div className="flex justify-between gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedDay === day
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-zinc-700"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        )}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {activeTab === "today"
                ? "วันพุธที่ 14 กุมภาพันธ์"
                : `ตารางเรียนวัน${selectedDay}`}
            </span>
            <div className="h-px bg-gray-200 dark:bg-zinc-800 flex-1"></div>
          </div>

          {currentSchedule.map((session, index) => {
            const showLunchBreak =
              index > 0 &&
              session.time.startsWith("13:00") &&
              currentSchedule[index - 1].time.endsWith("11:50");
            return (
              <React.Fragment key={session.id}>
                {showLunchBreak && (
                  <div className="flex items-center gap-4 py-2 opacity-50">
                    <Coffee size={16} className="text-gray-400" />
                    <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                    <span className="text-xs font-medium text-gray-400">
                      พักเที่ยง
                    </span>
                    <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                  </div>
                )}
                <div className="flex gap-4 relative">
                  {index !== currentSchedule.length - 1 && (
                    <div className="absolute left-4.75 top-10 -bottom-4 w-0.5 bg-gray-200 dark:bg-zinc-800 z-0"></div>
                  )}
                  <div className="flex flex-col items-center gap-1 z-10 min-w-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#F8F9FA] dark:border-zinc-950 ${
                        session.status === "current"
                          ? "bg-indigo-600 text-white"
                          : session.status === "finished"
                          ? "bg-gray-300 dark:bg-zinc-800 text-white"
                          : "bg-white dark:bg-zinc-900 border-indigo-100 text-indigo-600"
                      }`}
                    >
                      {session.subject.includes("เคมี") ||
                      session.subject.includes("ฟิสิกส์") ? (
                        <Beaker size={18} />
                      ) : (
                        <BookOpen size={16} />
                      )}
                    </div>
                  </div>
                  <div
                    className={`flex-1 p-4 rounded-2xl border transition-all ${
                      session.status === "current"
                        ? "bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-900 shadow-md"
                        : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-md ${session.color}`}
                      >
                        {session.code}
                      </span>
                      <span className="text-xs font-medium text-gray-400">
                        {session.time}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-1 dark:text-gray-200">
                      {session.subject}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {session.teacher}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {session.room}
                      </span>
                    </div>
                    {session.status === "current" && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          กำลังเรียนอยู่
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </main>
    </div>
  );
}
