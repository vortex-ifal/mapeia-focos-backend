import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { occurrencesTable } from './occurrence.schema';
import { occurrenceStatusesTable } from './occurrence-status.schema';
import { usersTable } from './user.schema';

export const statusHistoriesTable = pgTable(
  'status_histories',
  {
    occurrenceId: uuid('occurrence_id')
      .references(() => occurrencesTable.id, { onDelete: 'cascade' })
      .notNull(),
    changedByUserId: uuid('changed_by_user_id')
      .references(() => usersTable.id, { onDelete: 'restrict' })
      .notNull(),
    previousStatusId: uuid('previous_status_id')
      .references(() => occurrenceStatusesTable.id, { onDelete: 'restrict' })
      .notNull(),
    newStatusId: uuid('new_status_id')
      .references(() => occurrenceStatusesTable.id, { onDelete: 'restrict' })
      .notNull(),
    changedAt: timestamp('changed_at').defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.occurrenceId, table.changedAt] }),
  ],
);

export type StatusHistorySelect = typeof statusHistoriesTable.$inferSelect;
export type StatusHistoryInsert = typeof statusHistoriesTable.$inferInsert;
