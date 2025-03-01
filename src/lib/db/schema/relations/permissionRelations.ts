import { relations } from "drizzle-orm";
import { permissions } from "../permissions";
import { rolePermissions } from "./rolePermissions";

/**
 * Relazioni della tabella permessi
 */
export const permissionsRelations = relations(permissions, ({ many }) => ({
  // Un permesso può essere assegnato a molti ruoli attraverso la tabella di giunzione
  rolePermissions: many(rolePermissions),
}));
