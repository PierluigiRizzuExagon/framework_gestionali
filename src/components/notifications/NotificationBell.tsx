"use client";

import { useState, useEffect } from "react";
import { countUnreadNotifications } from "@/lib/notifications/actions";
import { NotificationType } from "@/lib/db/schema/notifications";
import { NotificationsPopover } from "./NotificationsPopover";

export function NotificationBell() {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Carica il conteggio delle notifiche non lette
  const loadUnreadCounts = async () => {
    const notificationsResult = await countUnreadNotifications(
      NotificationType.NOTIFICATION
    );
    const messagesResult = await countUnreadNotifications(
      NotificationType.MESSAGE
    );

    if (
      notificationsResult.success &&
      notificationsResult.count !== undefined
    ) {
      setUnreadNotifications(notificationsResult.count);
    }

    if (messagesResult.success && messagesResult.count !== undefined) {
      setUnreadMessages(messagesResult.count);
    }
  };

  // Carica il conteggio all'avvio e ogni 30 secondi
  useEffect(() => {
    loadUnreadCounts();
    const interval = setInterval(loadUnreadCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Aggiorna il conteggio quando il popover viene chiuso
  const handleClose = () => {
    setIsOpen(false);
    loadUnreadCounts();
  };

  const totalUnread = unreadNotifications + unreadMessages;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        aria-label="Notifiche"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {totalUnread > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {totalUnread}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationsPopover
          onClose={handleClose}
          unreadNotifications={unreadNotifications}
          unreadMessages={unreadMessages}
        />
      )}
    </div>
  );
}
