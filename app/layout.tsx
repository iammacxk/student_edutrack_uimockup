// app/layout.tsx
import type { Metadata } from "next";
import { Kanit } from "next/font/google"; 
import "./globals.css";
// 1. Import Provider
import { NotificationProvider } from "./context/NotificationContext";

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
          <div className="mx-auto max-w-md min-h-screen bg-white shadow-2xl overflow-hidden relative">
            {children}
          </div>
        </NotificationProvider>
      </body>
    </html>
  );
}