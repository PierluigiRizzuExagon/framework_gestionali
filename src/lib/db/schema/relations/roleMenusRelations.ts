import { relations } from "drizzle-orm";
import { roles } from "@/lib/db/schema/roles";
import { menus, roleMenus } from "@/lib/db/schema/menu";

/**
 * Definisce le relazioni per la tabella role_menus
 */
export const roleMenusRelations = relations(roleMenus, ({ one }) => ({
  // Una relazione ruolo-menu appartiene a un ruolo
  role: one(roles, {
    fields: [roleMenus.roleId],
    references: [roles.id],
  }),
  // Una relazione ruolo-menu appartiene a un menu
  menu: one(menus, {
    fields: [roleMenus.menuId],
    references: [menus.id],
  }),
}));
