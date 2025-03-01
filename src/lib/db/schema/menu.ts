import {
  mysqlTable,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2";

/**
 * Tabella dei menu
 */
export const menus = mysqlTable("menus", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  label: varchar("label", { length: 255 }).notNull(),
  path: varchar("path", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  parentId: varchar("parent_id", { length: 128 }),
  order: varchar("order", { length: 10 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Tabella di relazione tra ruoli e menu
 */
export const roleMenus = mysqlTable("role_menus", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  roleId: varchar("role_id", { length: 128 }).notNull(),
  menuId: varchar("menu_id", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tipi TypeScript derivati dagli schemi
export type Menu = typeof menus.$inferSelect;
export type NewMenu = typeof menus.$inferInsert;
export type RoleMenu = typeof roleMenus.$inferSelect;
export type NewRoleMenu = typeof roleMenus.$inferInsert;
