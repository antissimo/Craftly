import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "./context/AuthContext"; // import the provider
import type { ReactNode } from "react";

export const metadata = {
  title: "Craftly",
  description: "Portfolio manager for creative professionals",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900"> {/* make page white */}
        <AuthProvider> {/* wrap everything in AuthProvider */}
          <Navbar />
          <main className="px-8 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
