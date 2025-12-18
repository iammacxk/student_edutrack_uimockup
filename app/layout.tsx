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
      {/* 1. พื้นหลังนอกสุด (Body) ให้เป็นสีมืด */}
      <body className={`${kanit.className} antialiased bg-gray-100 dark:bg-zinc-950 transition-colors duration-300`}>
        
        <NotificationProvider>
          <AuthProvider>
            <ThemeProvider>
            
              {/* 2. จุดที่ต้องแก้! เพิ่ม dark:bg-zinc-950 ให้กล่องมือถือ */}
              <div className="mx-auto max-w-md min-h-screen bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden relative transition-colors duration-300">
                {children}
              </div>

            </ThemeProvider>
          </AuthProvider>
        </NotificationProvider>

      </body>
    </html>
  );
}