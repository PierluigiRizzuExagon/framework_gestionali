import { relations } from "drizzle-orm";
import { users } from "../users";
import { roles } from "../roles";
import { notifications, notificationReads } from "../notifications";

/**
 * Relazioni della tabella utenti
 */
export const usersRelations = relations(users, ({ one, many }) => ({
  // Un utente ha un ruolo
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  // Un utente può essere destinatario di molte notifiche
  targetNotifications: many(notifications, {
    relationName: "notification_target_user",
  }),
  // Un utente può leggere molte notifiche
  notificationReads: many(notificationReads),
}));
