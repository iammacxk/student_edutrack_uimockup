import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import BottomNav from "./components/BottomNav"; // ✅ 1. Import มาก่อน

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
      {/* Body จัดให้อยู่กึ่งกลางสำหรับ Desktop 
          และมีพื้นหลังสีเทาเข้ม/อ่อน ตัดกับตัวแอป 
      */}
      <body className={`${kanit.className} antialiased min-h-screen flex justify-center bg-gray-100 dark:bg-zinc-900 transition-colors duration-300`}>
        
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider>
              <div className="w-full max-w-md min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 shadow-2xl relative overflow-x-hidden transition-colors duration-300">
                
                {children}

                <BottomNav />
                
              </div>

            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}