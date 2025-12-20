"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push(ROUTES.AUTH.LOGIN);
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Circle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold hover:bg-primary-600 transition-colors shadow-lg"
      >
        GU
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-secondary-800/90 backdrop-blur-md rounded-lg shadow-xl border border-secondary-200/80 dark:border-secondary-700/80 overflow-hidden z-50">
          <div className="py-1">
            <Link
              href={ROUTES.DASHBOARD.PROFILE}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-white/60 dark:hover:bg-secondary-700/60 transition-colors"
            >
              Manage profile
            </Link>
            <div className="border-t border-secondary-200/80 dark:border-secondary-700/80 my-1"></div>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-white/60 dark:hover:bg-secondary-700/60 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

