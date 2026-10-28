import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  numeric,
  check,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { occurrenceStatusesTable } from './occurrence-status.schema';
import { usersTable } from './user.schema';

export const occurrencePriorityEnum = pgEnum('occurrence_priority', [
  'low',
  'medium',
  'high',
]);

export const occurrencesTable = pgTable(
  'occurrences',
  {
    id: uuid('id')
      .default(sql`uuidv7()`)
      .primaryKey(),
    protocol: varchar('protocol', { length: 5 }).unique().notNull(),
    address: varchar('address', { length: 255 }).notNull(),
    description: text('description').notNull(),
    situationType: varchar('situation_type', { length: 100 }),
    latitude: numeric('latitude', { precision: 9, scale: 6, mode: 'number' }),
    longitude: numeric('longitude', { precision: 9, scale: 6, mode: 'number' }),
    statusId: uuid('status_id')
      .references(() => occurrenceStatusesTable.id)
      .notNull(),
    priority: occurrencePriorityEnum('priority'),
    isActive: boolean('is_active').default(true).notNull(),
    userId: uuid('user_id')
      .references(() => usersTable.id, {
        onDelete: 'restrict',
      })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    check(
      'occurrences_latitude_range',
      sql`${table.latitude} BETWEEN -90 AND 90`,
    ),
    check(
      'occurrences_longitude_range',
      sql`${table.longitude} BETWEEN -180 AND 180`,
    ),
    // 2. Índices adicionados abaixo:
    index('occurrences_status_created_at_idx').on(
      table.statusId,
      table.createdAt,
    ),
    index('occurrences_coordinates_idx').on(table.latitude, table.longitude),
  ],
);

export type OccurrenceSelect = typeof occurrencesTable.$inferSelect;
export type OccurrenceInsert = typeof occurrencesTable.$inferInsert;
