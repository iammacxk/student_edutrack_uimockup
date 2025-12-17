// app/scan/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import QRCode from "react-qr-code"; 
import { 
  X, 
  MapPin, 
  QrCode, 
  ScanLine, 
  Zap, 
  ShieldCheck 
} from "lucide-react";

export default function ScanPage() {
  const [mode, setMode] = useState<'scan' | 'my-qr'>('scan');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- State สำหรับ QR Code ---
  const [timeLeft, setTimeLeft] = useState(10);
  const [qrData, setQrData] = useState<string>(""); 

  // --- Logic 1: กล้อง (Camera) ---
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (mode === 'scan') {
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasPermission(true);
          }
        } catch (err) {
          console.error("Error:", err);
          setHasPermission(false);
        }
      };
      startCamera();
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [mode]);

  // --- Logic 2: ระบบสร้าง QR และ Timer (แก้ Error ตรงนี้) ---
  useEffect(() => {
    // ถ้าไม่ได้อยู่โหมด My QR ให้จบการทำงาน
    if (mode !== 'my-qr') return;

    // ฟังก์ชันช่วยสร้าง Text สำหรับ QR
    const createQRString = () => {
      return JSON.stringify({
        id: "66160xxx",
        name: "Thinnaphat",
        timestamp: Date.now(),
        type: "auth_token"
      });
    };

    // --- จุดที่แก้ไข: ใช้ setTimeout เพื่อหลีกเลี่ยง Sync Update ---
    const initialSetup = setTimeout(() => {
       setQrData(createQRString());
       setTimeLeft(10);
    }, 0);

    // เริ่มนับถอยหลัง
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // หมดเวลา: สร้าง QR ใหม่ และรีเซ็ตเวลา
          setQrData(createQRString());
          return 10;
        }
        // ยังไม่หมดเวลา: ลดเวลาลง
        return prev - 1;
      });
    }, 1000);

    // Cleanup เมื่อเปลี่ยนโหมด
    return () => {
      clearTimeout(initialSetup); // เคลียร์ timeout ด้วย
      clearInterval(timer);
    };
  }, [mode]);

  return (
    <div className="flex flex-col h-screen bg-black text-white relative overflow-hidden">
      
      {/* --- Header --- */}
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
               <span className="text-xs font-medium">GPS: อาคาร 9 (แม่นยำ)</span>
             </>
           ) : (
             <span className="text-xs font-medium">รหัสนักเรียน: 66160xxx</span>
           )}
        </div>
        <button className="p-2 text-white/80 hover:text-white">
          <Zap size={24} className={mode === 'scan' ? '' : 'opacity-0'} /> 
        </button>
      </div>

      {/* --- Mode 1: Scanner --- */}
      {mode === 'scan' && (
        <div className="flex-1 relative flex flex-col items-center justify-center">
          {hasPermission === false ? (
            <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <ScanLine size={48} className="mb-4 opacity-50" />
              <p>ไม่สามารถเข้าถึงกล้องได้</p>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
          )}

          <div className="relative z-10 w-64 h-64 border-2 border-white/50 rounded-3xl overflow-hidden shadow-[0_0_0_1000px_rgba(0,0,0,0.6)]">
             <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-scan"></div>
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
          </div>
          <p className="relative z-20 mt-8 text-white/90 text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
            สแกน QR Code หน้าห้องเรียนเพื่อเช็คชื่อ
          </p>
        </div>
      )}

      {/* --- Mode 2: My QR Code (Real QR) --- */}
      {mode === 'my-qr' && (
        <div className="flex-1 bg-[#F8F9FA] relative text-gray-900 flex flex-col items-center pt-24 px-6 rounded-t-3xl mt-20 animate-slide-up">
           
           <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 w-full max-w-sm flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-3xl mb-4 border-4 border-white shadow-sm mt-4">T</div>
              <h2 className="text-xl font-bold text-gray-800">นายทินภัทร บูรณะบัญญัติ</h2>
              <p className="text-gray-500 text-sm mb-6">มัธยมศึกษาปีที่ 5/1 • เลขที่ 14</p>

              {/* Real QR Code Component */}
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl mb-4 bg-white">
                <div className="w-[180px] h-[180px] flex items-center justify-center">
                    {/* ตรวจสอบว่ามีข้อมูลก่อน render */}
                    {qrData && (
                      <QRCode 
                          value={qrData}
                          size={180}
                          fgColor="#1F2937"
                          bgColor="#FFFFFF"
                          level="H"
                          viewBox={`0 0 256 256`}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      />
                    )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg mb-2">
                <ShieldCheck size={16} />
                <span className="text-xs font-semibold">ยืนยันตัวตนแล้ว</span>
              </div>
              
              <p className="text-xs text-gray-400 text-center flex items-center gap-1">
                QR Code จะรีเฟรชอัตโนมัติใน <span className="text-indigo-600 font-bold w-4">{timeLeft}</span> วินาที
              </p>
           </div>
        </div>
      )}

      {/* --- Toggle Switcher --- */}
      <div className="absolute bottom-8 left-6 right-6 z-30">
        <div className="bg-black/60 backdrop-blur-xl p-1.5 rounded-full flex border border-white/10 shadow-lg">
          <button 
            onClick={() => setMode('scan')}
            className={`flex-1 py-3 rounded-full flex items-center justify-center gap-2 text-sm font-medium transition-all ${mode === 'scan' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white'}`}
          >
            <ScanLine size={18} /> สแกนเช็คชื่อ
          </button>
          <button 
            onClick={() => setMode('my-qr')}
            className={`flex-1 py-3 rounded-full flex items-center justify-center gap-2 text-sm font-medium transition-all ${mode === 'my-qr' ? 'bg-indigo-600 text-white shadow-md' : 'text-white/60 hover:text-white'}`}
          >
            <QrCode size={18} /> QR ของฉัน
          </button>
        </div>
      </div>

    </div>
  );
}