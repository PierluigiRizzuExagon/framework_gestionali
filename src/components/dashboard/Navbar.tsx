"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { signOut } from "next-auth/react";

export function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({
      redirectTo: "/login",
    });
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center mr-4">
            <span className="self-center text-xl font-semibold whitespace-nowrap">
              Gestionale
            </span>
          </Link>
          <div className="hidden md:flex items-center">
            <ul className="flex space-x-8">
              <li>
                <Link
                  href="/dashboard"
                  className={`text-sm ${
                    pathname === "/dashboard"
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notification Bell - Assicuriamoci che sia visibile */}
          <div className="relative">
            <NotificationBell />
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-2 text-sm text-gray-700 focus:outline-none"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600">U</span>
              </div>
              <span className="hidden md:inline-block">Utente</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profilo
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Impostazioni
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
