// app/layout.tsx
import type { Metadata } from "next";
import { Kanit } from "next/font/google"; 
import "./globals.css";
// 1. Import Provider
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";

const kanit = Kanit({ 
  subsets: ["thai", "latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit"
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
      <body className={`${kanit.className} antialiased bg-gray-100`}>
        {/* 2. Wrap children with NotificationProvider */}
        <NotificationProvider>
          <ThemeProvider>
            <div className="mx-auto max-w-md min-h-screen bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden relative transition-colors duration-300">
              {children}
            </div>
          </ThemeProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}