"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = !!user;

  // Fake login: you can replace this with real API call
  const login = async (email: string, _password: string) => {
    // simulate a short delay (optional)
    await new Promise((r) => setTimeout(r, 300));
    // set a fake user (you could derive name from email)
    const name = email.split("@")[0].replace(/[.\-_]/g, " ");
    setUser({ name: name.charAt(0).toUpperCase() + name.slice(1), email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
