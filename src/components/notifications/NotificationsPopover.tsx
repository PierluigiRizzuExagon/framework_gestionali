"use client";

import { useState, useEffect, useRef } from "react";
import {
  fetchUserStandardNotifications,
  fetchUserMessages,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/notifications/actions";
import {
  NotificationType,
  NotificationPriority,
  type Notification,
} from "@/lib/db/schema/notifications";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

interface NotificationsPopoverProps {
  onClose: () => void;
  unreadNotifications: number;
  unreadMessages: number;
}

// Estende il tipo Notification per includere lo stato di lettura
type NotificationWithReadStatus = Notification & { isRead: boolean };

export function NotificationsPopover({
  onClose,
  unreadNotifications,
  unreadMessages,
}: NotificationsPopoverProps) {
  const [activeTab, setActiveTab] = useState<"notifications" | "messages">(
    "notifications"
  );
  const [notifications, setNotifications] = useState<
    NotificationWithReadStatus[]
  >([]);
  const [messages, setMessages] = useState<NotificationWithReadStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Carica le notifiche e i messaggi
  const loadNotificationsAndMessages = async () => {
    setLoading(true);

    const notificationsResult = await fetchUserStandardNotifications();
    const messagesResult = await fetchUserMessages();

    if (notificationsResult.success) {
      setNotifications(notificationsResult.data || []);
    }

    if (messagesResult.success) {
      setMessages(messagesResult.data || []);
    }

    setLoading(false);
  };

  // Carica le notifiche all'avvio
  useEffect(() => {
    loadNotificationsAndMessages();
  }, []);

  // Gestisce i click fuori dal popover per chiuderlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Segna una notifica come letta
  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);

    // Aggiorna le liste locali
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

    setMessages(
      messages.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  // Segna tutte le notifiche come lette
  const handleMarkAllAsRead = async () => {
    if (activeTab === "notifications") {
      await markAllNotificationsAsRead(NotificationType.NOTIFICATION);
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } else {
      await markAllNotificationsAsRead(NotificationType.MESSAGE);
      setMessages(messages.map((m) => ({ ...m, isRead: true })));
    }
  };

  // Ottiene la classe di priorità per una notifica
  const getPriorityClass = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.LOW:
        return "bg-gray-50";
      case NotificationPriority.NORMAL:
        return "bg-white";
      case NotificationPriority.HIGH:
        return "bg-yellow-50";
      case NotificationPriority.URGENT:
        return "bg-red-50";
      default:
        return "bg-white";
    }
  };

  // Formatta la data in formato relativo
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: it,
    });
  };

  const currentItems = activeTab === "notifications" ? notifications : messages;
  const hasUnread =
    activeTab === "notifications"
      ? unreadNotifications > 0
      : unreadMessages > 0;

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50"
    >
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "notifications"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notifiche
          {unreadNotifications > 0 && (
            <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
              {unreadNotifications}
            </span>
          )}
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "messages"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("messages")}
        >
          Messaggi
          {unreadMessages > 0 && (
            <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
              {unreadMessages}
            </span>
          )}
        </button>
      </div>

      {/* Azioni */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
        <span className="text-sm font-medium text-gray-700">
          {activeTab === "notifications" ? "Notifiche" : "Messaggi"}
        </span>
        {hasUnread && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Segna tutti come letti
          </button>
        )}
      </div>

      {/* Lista notifiche/messaggi */}
      <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
        {loading ? (
          <div className="p-4 text-center text-gray-500">Caricamento...</div>
        ) : currentItems.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nessun {activeTab === "notifications" ? "notifica" : "messaggio"}{" "}
            disponibile
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {currentItems.map((item) => (
              <li
                key={item.id}
                className={`${getPriorityClass(item.priority)} ${
                  !item.isRead ? "bg-opacity-80" : ""
                }`}
              >
                <div className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <h3
                      className={`text-sm font-medium ${
                        !item.isRead ? "text-black" : "text-gray-700"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {item.message}
                  </p>
                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Segna come letto
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2 bg-gray-50">
        <button
          onClick={onClose}
          className="w-full text-sm text-center text-gray-700 hover:text-gray-900"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
}
