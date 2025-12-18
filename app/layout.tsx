// app/layout.tsx
import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "EduTrack - Student",
  description: "Student Tracking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      {/* 1. Body (พื้นหลัง Desktop): 
            - flex justify-center: จัดคอนเทนต์ให้อยู่กึ่งกลางแนวนอน
            - min-h-screen: สูงเต็มจอเสมอ
            - bg-gray-100 / dark:bg-zinc-900: สีพื้นหลังรอบนอก (ทำให้ต่างจากตัวแอป)
      */}
      <body className={`${kanit.className} antialiased min-h-screen flex justify-center bg-gray-100 dark:bg-zinc-900 transition-colors duration-300`}>
        
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider>

              {/* 2. Container (ตัวแอปมือถือ):
                    - w-full max-w-md: กว้างเต็มที่แต่ไม่เกินขนาดมือถือ (448px)
                    - min-h-screen: ตัวแอปสูงเต็มจอ
                    - bg-[#F8F9FA] / dark:bg-zinc-950: สีพื้นหลังของหน้าแอป
                    - shadow-2xl: เงาเพื่อให้ดูลอยจากพื้นหลัง Desktop
              */}
              <div className="w-full max-w-md min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 shadow-2xl relative overflow-x-hidden transition-colors duration-300">
                {children}
              </div>

            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}