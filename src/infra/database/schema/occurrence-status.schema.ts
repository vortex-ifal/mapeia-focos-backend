import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const occurrenceStatusesTable = pgTable('occurrence_statuses', {
  id: uuid('id').default(sql`uuidv7()`).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  key: varchar('key', { length: 50 }).unique().notNull(),
});

export type OccurrenceStatusSelect = typeof occurrenceStatusesTable.$inferSelect;
export type OccurrenceStatusInsert = typeof occurrenceStatusesTable.$inferInsert;
