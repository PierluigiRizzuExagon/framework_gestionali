import { relations } from "drizzle-orm";
import { notifications, notificationReads } from "../notifications";
import { users } from "../users";
import { roles } from "../roles";

/**
 * Relazioni della tabella notifiche
 */
export const notificationsRelations = relations(
  notifications,
  ({ one, many }) => ({
    // Una notifica può essere destinata a un utente specifico
    targetUser: one(users, {
      fields: [notifications.targetId],
      references: [users.id],
      relationName: "notification_target_user",
    }),
    // Una notifica può essere destinata a un ruolo specifico
    targetRole: one(roles, {
      fields: [notifications.targetId],
      references: [roles.id],
      relationName: "notification_target_role",
    }),
    // Una notifica può essere letta da molti utenti
    reads: many(notificationReads),
  })
);

/**
 * Relazioni della tabella notifiche lette
 */
export const notificationReadsRelations = relations(
  notificationReads,
  ({ one }) => ({
    // Una lettura di notifica appartiene a una notifica
    notification: one(notifications, {
      fields: [notificationReads.notificationId],
      references: [notifications.id],
    }),
    // Una lettura di notifica appartiene a un utente
    user: one(users, {
      fields: [notificationReads.userId],
      references: [users.id],
    }),
  })
);
