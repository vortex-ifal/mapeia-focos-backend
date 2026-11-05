import { desc, sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { occurrencesTable } from './occurrence.schema';
import { usersTable } from './user.schema';

export const assignmentsTable = pgTable(
  'assignments',
  {
    id: uuid('id')
      .default(sql`uuidv7()`)
      .primaryKey(),
    occurrenceId: uuid('occurrence_id')
      .references(() => occurrencesTable.id, { onDelete: 'cascade' })
      .notNull(),
    agentId: uuid('agent_id')
      .references(() => usersTable.id, { onDelete: 'restrict' })
      .notNull(),
    assignedByManagerId: uuid('assigned_by_manager_id')
      .references(() => usersTable.id, { onDelete: 'restrict' })
      .notNull(),
    notes: text('notes'),
    assignedAt: timestamp('assigned_at').defaultNow().notNull(),
  },
  (table) => [
    index('assignments_occurrence_assigned_at_idx').on(
      table.occurrenceId,
      desc(table.assignedAt),
      desc(table.id),
    ),
  ],
);

export type AssignmentSelect = typeof assignmentsTable.$inferSelect;
export type AssignmentInsert = typeof assignmentsTable.$inferInsert;
