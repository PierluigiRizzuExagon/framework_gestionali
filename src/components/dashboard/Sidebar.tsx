"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Home,
  Users,
  Shield,
  Bell,
  Settings,
  Menu as MenuIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { MenuWithChildren } from "@/lib/menu/types";
import { LogoutButton } from "@/components/auth/LogoutButton";

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <Home className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />,
  bell: <Bell className="w-5 h-5" />,
  settings: <Settings className="w-5 h-5" />,
};

// Hook personalizzato per gestire i menu
function useMenus() {
  const [menus, setMenus] = useState<MenuWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchMenus = useCallback(async () => {
    if (!session?.user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/menus");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Errore nel caricamento dei menu");
      }

      setMenus(data.data || []);
    } catch (err) {
      console.error("Errore nel caricamento dei menu:", err);
      setError(
        err instanceof Error ? err.message : "Errore nel caricamento dei menu"
      );
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      fetchMenus();
    }
  }, [session, fetchMenus]);

  return { menus, isLoading, error, refetch: fetchMenus };
}

// Hook personalizzato per gestire lo stato dei sottomenu
function useSubmenuState() {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  const toggleSubmenu = useCallback((menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  }, []);

  return { expandedMenus, toggleSubmenu };
}

export function Sidebar() {
  const { menus, isLoading, error } = useMenus();
  const { expandedMenus, toggleSubmenu } = useSubmenuState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = useCallback(
    (path: string) => {
      return pathname === path || pathname.startsWith(`${path}/`);
    },
    [pathname]
  );

  const renderMenuItems = useCallback(
    (items: MenuWithChildren[] = []) => {
      return items.map((menu) => {
        const hasChildren = menu.children && menu.children.length > 0;
        const isExpanded = expandedMenus[menu.id];
        const active = isActive(menu.path);

        return (
          <div key={menu.id}>
            {hasChildren ? (
              <div className="mb-1">
                <button
                  onClick={() => toggleSubmenu(menu.id)}
                  className={`flex items-center w-full px-4 py-2 text-left rounded-md ${
                    active ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">
                    {menu.icon && iconMap[menu.icon] ? (
                      iconMap[menu.icon]
                    ) : (
                      <div className="w-5 h-5" />
                    )}
                  </span>
                  <span className="flex-1">{menu.label}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {isExpanded && (
                  <div className="pl-10 mt-1 space-y-1">
                    {renderMenuItems(menu.children)}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={menu.path}
                className={`flex items-center px-4 py-2 mb-1 rounded-md ${
                  active ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">
                  {menu.icon && iconMap[menu.icon] ? (
                    iconMap[menu.icon]
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                </span>
                <span>{menu.label}</span>
              </Link>
            )}
          </div>
        );
      });
    },
    [expandedMenus, isActive, toggleSubmenu]
  );

  // Componente per il loader
  const Loader = () => (
    <div className="flex items-center justify-center h-32">
      <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
  );

  // Componente per l'errore
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="p-4 text-red-500">{message}</div>
  );

  // Componente per il profilo utente
  const UserProfile = () => (
    <div className="p-4 border-t">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
          {session?.user?.name?.[0] || "U"}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            {session?.user?.name || "Utente"}
          </p>
          <p className="text-xs text-gray-500">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded-md shadow-md md:hidden"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <h1 className="text-xl font-bold">Gestionale</h1>
          </div>
          <div className="flex flex-col flex-1 px-3">
            {isLoading ? (
              <Loader />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              renderMenuItems(menus)
            )}
          </div>
          <UserProfile />
          <div className="p-4 border-t border-gray-700">
            <LogoutButton className="w-full" />
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={toggleMobileMenu}
          ></div>
          <div className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-white">
            <div className="flex items-center justify-between h-16 px-6 border-b">
              <h1 className="text-xl font-bold">Gestionale</h1>
              <button
                onClick={toggleMobileMenu}
                className="p-2 -mr-2 rounded-md"
              >
                <span className="sr-only">Chiudi menu</span>
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 px-4 pt-4 pb-4 overflow-y-auto">
              {isLoading ? (
                <Loader />
              ) : error ? (
                <ErrorMessage message={error} />
              ) : (
                renderMenuItems(menus)
              )}
            </div>
            <UserProfile />
            <div className="p-4 border-t border-gray-700">
              <LogoutButton className="w-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
