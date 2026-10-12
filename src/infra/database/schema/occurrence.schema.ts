import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
  numeric,
  check,
} from 'drizzle-orm/pg-core';
import { usersTable } from './user.schema';

export const occurrenceStatusEnum = pgEnum('occurrence_status', [
  'pending',
  'validated',
  'discarded',
  'assigned',
  'inspected',
  'resolved',
]);

export const occurrencesTable = pgTable(
  'occurrences',
  {
    id: uuid('id')
      .default(sql`uuidv7()`)
      .primaryKey(),
    address: varchar('address', { length: 255 }).notNull(),
    description: text('description').notNull(),
    situationType: varchar('situation_type', { length: 100 }),
    contact: varchar('contact', { length: 150 }),
    latitude: numeric('latitude', { precision: 9, scale: 6, mode: 'number' }),
    longitude: numeric('longitude', { precision: 9, scale: 6, mode: 'number' }),
    status: occurrenceStatusEnum('status').default('pending').notNull(),
    isAnonymous: boolean('is_anonymous').default(true).notNull(),
    reportedByUserId: uuid('reported_by_user_id').references(
      () => usersTable.id,
      {
        onDelete: 'set null',
      },
    ),
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
  ],
);

export type OccurrenceSelect = typeof occurrencesTable.$inferSelect;
export type OccurrenceInsert = typeof occurrencesTable.$inferInsert;
