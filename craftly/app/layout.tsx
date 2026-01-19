// app/layout.tsx
import type { ReactNode } from "react";
import { AuthProvider } from "@/app/context/AuthContext";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Craftly",
  description: "Portfolio manager for creative professionals",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <Navbar />
        {children}
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
