"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase/client";

export type AuthUser = {
  id: string;
  email: string | null;
  username: string | null;
};

export type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check current session on mount and listen for changes
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      const supUser = data.session?.user;
      if (supUser) {
        setUser({
          id: supUser.id,
          email: supUser.email ?? null,
          username: supUser.user_metadata?.name ?? null,
        });
      }
      setIsLoading(false);
    });

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        const supUser = session?.user;
        setUser(
          supUser
            ? {
                id: supUser.id,
                email: supUser.email ?? null,
                username: supUser.user_metadata?.name ?? null,
              }
            : null
        );
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    const supUser = data.user;
    if (supUser) {
      setUser({
        id: supUser.id,
        email: supUser.email ?? null,
        username: supUser.user_metadata?.name ?? null,
      });
    }
  };


  // Signup (client-side Supabase only)
 const signup = async (username: string, email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { name: username } },
  });

  if (error) throw new Error(error.message);

  const supUser = data.user;
  if (!supUser) throw new Error("Signup failed: no user returned");

  // 1️⃣ Insert into your 'users' table in Supabase DB
  const { error: dbError } = await supabaseClient.from('users').insert([
    {
      id: supUser.id,      // link the auth ID
      email: supUser.email,
      name: username,
      created_at: new Date(),
    }
  ]);

  if (dbError) throw new Error("Failed to create user in DB: " + dbError.message);

  // 2️⃣ Set user in AuthContext
  setUser({
    id: supUser.id,
    email: supUser.email ?? null,
    username: supUser.user_metadata?.name ?? null,
  });

  // 3️⃣ Optional: auto-login immediately
  await supabaseClient.auth.signInWithPassword({ email, password });
};



  // Logout
  const logout = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isLoggedIn: !!user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
