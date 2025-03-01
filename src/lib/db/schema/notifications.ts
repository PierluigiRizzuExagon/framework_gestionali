import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  tinyint,
} from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2";

/**
 * Tipi di destinatari delle notifiche
 */
export enum NotificationTargetType {
  GLOBAL = 0, // Per tutti gli utenti
  ROLE = 1, // Per un ruolo specifico
  USER = 2, // Per un utente specifico
}

/**
 * Tipi di notifica
 */
export enum NotificationType {
  NOTIFICATION = 0, // Notifica standard
  MESSAGE = 1, // Messaggio
}

/**
 * Priorità delle notifiche
 */
export enum NotificationPriority {
  LOW = 0, // Bassa priorità
  NORMAL = 1, // Priorità normale
  HIGH = 2, // Alta priorità
  URGENT = 3, // Urgente
}

/**
 * Tabella delle notifiche
 */
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  targetType: tinyint("target_type")
    .notNull()
    .default(NotificationTargetType.GLOBAL),
  type: tinyint("type").notNull().default(NotificationType.NOTIFICATION),
  priority: tinyint("priority").notNull().default(NotificationPriority.NORMAL),
  targetId: varchar("target_id", { length: 128 }), // ID del ruolo o utente (null per globali)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Tabella per tenere traccia delle notifiche lette
 */
export const notificationReads = mysqlTable("notification_reads", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  notificationId: varchar("notification_id", { length: 128 }).notNull(),
  userId: varchar("user_id", { length: 128 }).notNull(),
  readAt: timestamp("read_at").notNull().defaultNow(),
});

// Tipi TypeScript derivati dagli schemi
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type NotificationRead = typeof notificationReads.$inferSelect;
export type NewNotificationRead = typeof notificationReads.$inferInsert;
