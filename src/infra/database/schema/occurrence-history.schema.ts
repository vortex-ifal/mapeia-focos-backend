import { sql } from 'drizzle-orm';
import { index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { occurrencesTable } from './occurrence.schema';
import { occurrenceEventsTable } from './occurrence-event.schema';
import { usersTable } from './user.schema';

export const occurrenceHistoryTable = pgTable(
  'occurrence_history',
  {
    id: uuid('id').default(sql`uuidv7()`).primaryKey(),
    occurrenceId: uuid('occurrence_id')
      .references(() => occurrencesTable.id, { onDelete: 'cascade' })
      .notNull(),
    eventId: uuid('event_id')
      .references(() => occurrenceEventsTable.id, { onDelete: 'restrict' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => usersTable.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('occurrence_history_occurrence_created_idx').on(
      table.occurrenceId,
      table.createdAt,
    ),
  ],
);

export type OccurrenceHistorySelect =
  typeof occurrenceHistoryTable.$inferSelect;
export type OccurrenceHistoryInsert =
  typeof occurrenceHistoryTable.$inferInsert;
