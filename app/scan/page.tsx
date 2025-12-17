// app/scan/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  X, 
  RefreshCcw, 
  MapPin, 
  QrCode, 
  ScanLine, 
  Zap, 
  Image as ImageIcon,
  ShieldCheck
} from "lucide-react";

export default function ScanPage() {
  const [mode, setMode] = useState<'scan' | 'my-qr'>('scan');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- จัดการกล้อง (Camera Logic) ---
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (mode === 'scan') {
      const startCamera = async () => {
        try {
          // ขอสิทธิ์เข้าถึงกล้องหลัง (Environment)
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasPermission(true);
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setHasPermission(false);
        }
      };
      startCamera();
    }

    // Cleanup: ปิดกล้องเมื่อเปลี่ยนหน้าหรือเปลี่ยนโหมด
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode]);

  return (
    <div className="flex flex-col h-screen bg-black text-white relative overflow-hidden">
      
      {/* --- Header ปุ่มปิด/ย้อนกลับ --- */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 pt-12 pb-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/">
           <button className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition">
             <X size={24} className="text-white" />
           </button>
        </Link>
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
           {mode === 'scan' ? (
             <>
               <MapPin size={14} className="text-green-400" />
               <span className="text-xs font-medium">GPS : ตึก Burj Khalifa</span>
             </>
           ) : (
             <span className="text-xs font-medium">รหัสนักเรียน: 66160xxx</span>
           )}
        </div>
        <button className="p-2 text-white/80 hover:text-white">
          <Zap size={24} className={mode === 'scan' ? '' : 'opacity-0'} /> 
          {/* ปุ่มเปิดไฟแฟลช (Mock UI) */}
        </button>
      </div>

      {/* --- Mode 1: Scanner View --- */}
      {mode === 'scan' && (
        <div className="flex-1 relative flex flex-col items-center justify-center">
          
          {/* Camera Feed */}
          {hasPermission === false ? (
            <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <ScanLine size={48} className="mb-4 opacity-50" />
              <p>ไม่สามารถเข้าถึงกล้องได้</p>
              <p className="text-xs mt-2">กรุณาอนุญาตให้เข้าถึงกล้องในเบราว์เซอร์</p>
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Scanner Overlay UI */}
          <div className="relative z-10 w-64 h-64 border-2 border-white/50 rounded-3xl overflow-hidden shadow-[0_0_0_1000px_rgba(0,0,0,0.6)]">
             {/* เส้นสแกนวิ่งขึ้นลง */}
             <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-scan"></div>
             
             {/* Corner Markers */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
          </div>

          <p className="relative z-20 mt-8 text-white/90 text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
            สแกน QR Code หน้าห้องเรียนเพื่อเช็คชื่อ
          </p>

          <div className="absolute bottom-32 flex gap-8 z-20">
             <ActionButton icon={<ImageIcon size={24} />} label="รูปภาพ" />
             <ActionButton icon={<RefreshCcw size={24} />} label="สลับกล้อง" />
          </div>
        </div>
      )}

      {/* --- Mode 2: My QR Code (สำหรับเข้าโรงเรียน) --- */}
      {mode === 'my-qr' && (
        <div className="flex-1 bg-[#F8F9FA] relative text-gray-900 flex flex-col items-center pt-24 px-6 rounded-t-3xl mt-20 animate-slide-up">
           
           <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 w-full max-w-sm flex flex-col items-center relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-3xl mb-4 border-4 border-white shadow-sm mt-4">
                T
              </div>
              <h2 className="text-xl font-bold text-gray-800">นายทินภัทร บูรณะบัญญัติ</h2>
              <p className="text-gray-500 text-sm mb-6">มัธยมศึกษาปีที่ 5/1 • เลขที่ 14</p>

              {/* QR Code Placeholder (SVG) */}
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl mb-4">
                <MockQRCode />
              </div>

              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg mb-2">
                <ShieldCheck size={16} />
                <span className="text-xs font-semibold">ยืนยันตัวตนแล้ว</span>
              </div>
              <p className="text-xs text-gray-400 text-center">
                ใช้สำหรับสแกนเข้า-ออกโรงเรียน<br/>QR Code จะรีเฟรชอัตโนมัติใน 00:59
              </p>
           </div>
        </div>
      )}

      {/* --- Bottom Toggle Switcher --- */}
      <div className="absolute bottom-8 left-6 right-6 z-30">
        <div className="bg-black/60 backdrop-blur-xl p-1.5 rounded-full flex border border-white/10 shadow-lg">
          <button 
            onClick={() => setMode('scan')}
            className={`flex-1 py-3 rounded-full flex items-center justify-center gap-2 text-sm font-medium transition-all ${
              mode === 'scan' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <ScanLine size={18} />
            สแกนเช็คชื่อ
          </button>
          <button 
            onClick={() => setMode('my-qr')}
            className={`flex-1 py-3 rounded-full flex items-center justify-center gap-2 text-sm font-medium transition-all ${
              mode === 'my-qr' ? 'bg-indigo-600 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <QrCode size={18} />
            QR ของฉัน
          </button>
        </div>
      </div>

    </div>
  );
}

// --- Sub-Components ---

function ActionButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition">
      <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </button>
  );
}

// สร้าง QR Code จำลองด้วย SVG เพื่อไม่ต้องลง Library เพิ่ม
function MockQRCode() {
  return (
    <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M10 10H40V40H10V10ZM16 16H34V34H16V16Z" fill="#1F2937"/>
      <path d="M22 22H28V28H22V22Z" fill="#1F2937"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M60 10H90V40H60V10ZM66 16H84V34H66V16Z" fill="#1F2937"/>
      <path d="M72 22H78V28H72V22Z" fill="#1F2937"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M10 60H40V90H10V60ZM16 66H34V84H16V66Z" fill="#1F2937"/>
      <path d="M22 72H28V78H22V72Z" fill="#1F2937"/>
      <path d="M50 10H56V22H50V10Z" fill="#1F2937"/>
      <path d="M50 28H56V40H50V28Z" fill="#1F2937"/>
      <path d="M60 50H72V56H60V50Z" fill="#1F2937"/>
      <path d="M78 50H90V56H78V50Z" fill="#1F2937"/>
      <path d="M50 50H56V62H50V50Z" fill="#1F2937"/>
      <path d="M50 68H56V90H50V68Z" fill="#1F2937"/>
      <path d="M60 60H72V72H60V60Z" fill="#1F2937"/>
      <path d="M78 60H90V72H78V60Z" fill="#1F2937"/>
      <path d="M60 78H72V90H60V78Z" fill="#1F2937"/>
      <path d="M78 78H90V90H78V78Z" fill="#1F2937"/>
    </svg>
  );
}