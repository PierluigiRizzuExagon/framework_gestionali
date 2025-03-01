import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2";

/**
 * Tabella degli utenti
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  roleId: varchar("role_id", { length: 128 }).notNull(),
  resetToken: varchar("reset_token", { length: 128 }),
  resetTokenExpiry: varchar("reset_token_expiry", { length: 128 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tipi TypeScript derivati dagli schemi
// User rappresenta il tipo di un record esistente nella tabella users, con tutti i campi
export type User = typeof users.$inferSelect;

// NewUser rappresenta il tipo per inserire un nuovo utente, dove alcuni campi potrebbero essere opzionali
// (come id, createdAt, updatedAt che vengono generati automaticamente)
export type NewUser = typeof users.$inferInsert;
