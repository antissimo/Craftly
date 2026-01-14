"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../app/context/AuthContext";
import { usePathname } from "next/navigation";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const pathname = usePathname();

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/explore?page=1", label: "Explore" },
    { href: "/featured", label: "Featured" },
    { href: "/search", label: "Search" },
    { href: "/resources", label: "Resources" },
  ];

  const privateLinks = [
    { href: "/my-portfolio", label: "My Portfolio" },
    { href: "/settings", label: "Settings" },
  ];

  const allLinks = [...publicLinks, ...(isLoggedIn ? privateLinks : [])];

  // modal state
  const [loginOpen, setLoginOpen] = useState(false);

  // user dropdown state
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
        {/* Left: logo only (150px) */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Craftly Logo"
              width={150}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* Center: links */}
        <ul className="flex gap-6 mx-auto font-medium">
          {allLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${
                    isActive ? "text-gray-400" : "text-black hover:text-black/80"
                  } transition`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: login button or user icon */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <button
              onClick={() => setLoginOpen(true)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition"
                aria-label="User menu"
              >
                {/* Simple user icon circle with initials fallback */}
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                  {user?.username
                    ? user.username
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "U"}
                </div>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded shadow-md z-50">
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>

                  <Link
                    href="/my-portfolio"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Portfolio
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Login modal */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
