// app/layout.tsx
import type { Metadata } from "next";
import { Kanit } from "next/font/google"; // Import Kanit
import "./globals.css";

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
        {/* Mobile Wrapper to simulate app on desktop */}
        <div className="mx-auto max-w-md min-h-screen bg-white shadow-2xl overflow-hidden relative">
          {children}
        </div>
      </body>
    </html>
  );
}