// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/app/context/AuthContext";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://craftly-omega.vercel.app"),
  title: {
    default: "Craftly",
    template: "%s | Craftly",
  },
  description:
    "Craftly is a portfolio manager for creative professionals to publish projects and share one polished public profile.",
  keywords: [
    "portfolio",
    "creative portfolio",
    "web portfolio",
    "designer portfolio",
    "developer portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Craftly",
    description:
      "Build and share a professional creative portfolio with Craftly.",
    url: "https://craftly-omega.vercel.app",
    siteName: "Craftly",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Craftly",
    description:
      "Build and share a professional creative portfolio with Craftly.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
