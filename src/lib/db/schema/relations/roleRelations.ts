import { relations } from "drizzle-orm";
import { roles } from "../roles";
import { users } from "../users";
import { notifications } from "../notifications";
import { rolePermissions } from "./rolePermissions";
import { roleMenus } from "../menu";

/**
 * Relazioni della tabella ruoli
 */
export const rolesRelations = relations(roles, ({ many }) => ({
  // Un ruolo può essere assegnato a molti utenti
  users: many(users),
  // Un ruolo può avere molti permessi attraverso la tabella di giunzione
  rolePermissions: many(rolePermissions),
  // Un ruolo può essere destinatario di molte notifiche
  targetNotifications: many(notifications, {
    relationName: "notification_target_role",
  }),
  // Un ruolo può essere associato a molti menu attraverso roleMenus
  roleMenus: many(roleMenus),
}));
