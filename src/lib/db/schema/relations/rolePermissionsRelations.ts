import { relations } from "drizzle-orm";
import { rolePermissions } from "./rolePermissions";
import { roles } from "../roles";
import { permissions } from "../permissions";

/**
 * Relazioni della tabella di giunzione ruoli-permessi
 */
export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    // Una relazione ruolo-permesso appartiene a un ruolo
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    // Una relazione ruolo-permesso appartiene a un permesso
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  })
);
