import { sql } from 'drizzle-orm';
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const occurrenceEventsTable = pgTable('occurrence_events', {
  id: uuid('id').default(sql`uuidv7()`).primaryKey(),
  key: varchar('key', { length: 100 }).unique().notNull(),
  description: text('description').notNull(),
});

export type OccurrenceEventSelect = typeof occurrenceEventsTable.$inferSelect;
export type OccurrenceEventInsert = typeof occurrenceEventsTable.$inferInsert;
