import { relations } from "drizzle-orm";

import { roles } from "@/lib/db/schema/roles";
import { menus, roleMenus } from "@/lib/db/schema/menu";

/**
 * Definisce le relazioni per la tabella menus
 */
export const menusRelations = relations(menus, ({ one, many }) => ({
  // Un menu può avere un genitore
  parent: one(menus, {
    fields: [menus.parentId],
    references: [menus.id],
    relationName: "parent_child",
  }),

  // Un menu può avere molti figli
  children: many(menus, {
    relationName: "parent_child",
  }),

  // Un menu può essere associato a molti ruoli attraverso roleMenus
  roleMenus: many(roleMenus),
}));

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
