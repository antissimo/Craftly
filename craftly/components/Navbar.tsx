"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../app/context/AuthContext";
import { usePathname } from "next/navigation";
import LoginModal from "./LoginModal";

type NavLink = {
  href: string;
  label: string;
};

const fallbackPublicLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/explore?page=1", label: "Explore" },
];

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const pathname = usePathname();

  const [publicLinks, setPublicLinks] = useState<NavLink[]>(fallbackPublicLinks);

  const privateLinks = [
    { href: "/my-portfolio", label: "My Portfolio" },
  ];

  const allLinks = [...publicLinks, ...(isLoggedIn ? privateLinks : [])];

  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;

    const loadNavLinks = async () => {
      try {
        const res = await fetch("/api/navigation-links", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        if (!active || !Array.isArray(data?.links)) return;

        const parsed = data.links.filter(
          (item: unknown): item is NavLink =>
            !!item &&
            typeof item === "object" &&
            "href" in item &&
            "label" in item &&
            typeof (item as { href: unknown }).href === "string" &&
            typeof (item as { label: unknown }).label === "string"
        );

        if (parsed.length > 0) {
          setPublicLinks(parsed);
        }
      } catch {
        // Keep fallback links if CMS fetch fails.
      }
    };

    loadNavLinks();

    return () => {
      active = false;
    };
  }, []);

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
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Craftly Logo"
              width={150}
              height={40}
              priority
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex gap-6 font-medium">
            {allLinks.map((link) => {
              const linkPath = link.href.split("?")[0];
              const isActive = pathname === linkPath;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${
                      isActive
                        ? "text-gray-400"
                        : "text-black hover:text-black/80"
                    } transition`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
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
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-full hover:bg-gray-50"
                >
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

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
                    <Link
                      href="/my-portfolio"
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      My Portfolio
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden p-2 rounded text-black hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 border-t pt-4 space-y-3">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-gray-700 font-medium"
              >
                {link.label}
              </Link>
            ))}

            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setLoginOpen(true);
                  setMobileOpen(false);
                }}
                className="w-full mt-3 px-4 py-2 bg-black text-white rounded-lg"
              >
                Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="w-full mt-3 px-4 py-2 border rounded-lg"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
