import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const rolesTable = pgTable('roles', {
  id: uuid('id').default(sql`uuidv7()`).primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
});

export type RoleSelect = typeof rolesTable.$inferSelect;
export type RoleInsert = typeof rolesTable.$inferInsert;
