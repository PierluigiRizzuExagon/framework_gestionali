"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  className?: string;
  variant?: "text" | "icon" | "both";
}

/**
 * Componente pulsante per effettuare il logout
 */
export function LogoutButton({
  className = "",
  variant = "text",
}: LogoutButtonProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center justify-center ${className}`}
      title="Logout"
    >
      {variant !== "icon" && <span>Logout</span>}

      {variant !== "text" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${variant === "both" ? "ml-2" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      )}
    </button>
  );
}
