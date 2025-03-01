import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2";

/**
 * Tabella dei ruoli
 */
export const roles = mysqlTable("roles", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tipi TypeScript derivati dagli schemi
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
