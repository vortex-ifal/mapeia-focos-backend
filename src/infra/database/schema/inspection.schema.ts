import { sql } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { occurrencesTable } from './occurrence.schema';
import { usersTable } from './user.schema';

export const inspectionStatusEnum = pgEnum('inspection_status', [
  'draft',
  'completed',
]);

export const inspectionResultEnum = pgEnum('inspection_result', [
  'focus_eliminated',
  'larvicide_applied',
  'property_closed',
  'resident_refused',
  'abandoned_property',
]);

export const inspectionsTable = pgTable('inspections', {
  id: uuid('id')
    .default(sql`uuidv7()`)
    .primaryKey(),
  occurrenceId: uuid('occurrence_id')
    .references(() => occurrencesTable.id, { onDelete: 'cascade' })
    .notNull(),
  agentId: uuid('agent_id')
    .references(() => usersTable.id, { onDelete: 'restrict' })
    .notNull(),
  status: inspectionStatusEnum('status').default('draft').notNull(),
  condition: varchar('condition', { length: 100 }),
  actionsTaken: text('actions_taken'),
  notes: text('notes'),
  result: inspectionResultEnum('result'),
  inspectedAt: timestamp('inspected_at').defaultNow().notNull(),
});

export type InspectionSelect = typeof inspectionsTable.$inferSelect;
export type InspectionInsert = typeof inspectionsTable.$inferInsert;
