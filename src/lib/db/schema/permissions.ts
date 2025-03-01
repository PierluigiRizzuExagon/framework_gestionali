import { mysqlTable, varchar, text, timestamp } from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2";

/**
 * Tabella dei permessi
 */
export const permissions = mysqlTable("permissions", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tipi TypeScript derivati dagli schemi
export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
