// app/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

// กำหนดประเภทของ Role
export type UserRole = 'student' | 'teacher' | 'parent' | null;

interface UserProfile {
  name: string;
  id: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem("eduTrackUser");
        if (savedUser) {
          // Parse ข้อมูล ถ้าสำเร็จให้ Set User
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        localStorage.removeItem("eduTrackUser");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (role: UserRole) => {
    let userData: UserProfile | null = null;

    // Mockup ข้อมูลของแต่ละคน
    if (role === 'student') {
      userData = { name: "นายทินภัทร (นักเรียน)", id: "66160xxx", role: 'student' };
    } else if (role === 'teacher') {
      userData = { name: "ครูสมศรี (ครูที่ปรึกษา)", id: "T-001", role: 'teacher' };
    } else if (role === 'parent') {
      userData = { name: "ผู้ปกครอง (คุณแม่)", id: "P-001", role: 'parent' };
    }

    if (userData) {
      setUser(userData);
      localStorage.setItem("eduTrackUser", JSON.stringify(userData));
      router.push("/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eduTrackUser");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}