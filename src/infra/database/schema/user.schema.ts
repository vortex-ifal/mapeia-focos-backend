import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { rolesTable } from './role.schema';

export const usersTable = pgTable('users', {
  id: uuid('id').default(sql`uuidv7()`).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  cpf: varchar('cpf', { length: 11 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  roleId: uuid('role_id')
    .references(() => rolesTable.id, { onDelete: 'restrict' })
    .notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type UserSelect = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;