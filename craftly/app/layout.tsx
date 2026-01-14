// app/layout.tsx
import type { ReactNode } from "react";
import { AuthProvider } from "@/app/context/AuthContext";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Craftly",
  description: "Portfolio manager for creative professionals",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap your app in the client-side AuthProvider */}
        <AuthProvider>
                    <Navbar />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
