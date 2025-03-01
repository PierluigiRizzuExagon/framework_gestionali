import { mysqlTable, varchar, primaryKey } from "drizzle-orm/mysql-core";

/**
 * Tabella di giunzione tra ruoli e permessi
 */
export const rolePermissions = mysqlTable(
  "role_permissions",
  {
    roleId: varchar("role_id", { length: 128 }).notNull(),
    permissionId: varchar("permission_id", { length: 128 }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
    };
  }
);

// Tipi TypeScript derivati dagli schemi
export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;
