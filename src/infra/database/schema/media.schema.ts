import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  bigint,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { occurrencesTable } from './occurrence.schema';

export const mediaTypeEnum = pgEnum('media_type', ['photo', 'video']);

export const mediaTable = pgTable('media', {
  id: uuid('id')
    .default(sql`uuidv7()`)
    .primaryKey(),
  occurrenceId: uuid('occurrence_id')
    .notNull()
    .references(() => occurrencesTable.id, { onDelete: 'cascade' }),
  storageKey: varchar('storage_key', { length: 500 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }).notNull(),
  type: mediaTypeEnum('type').notNull().default('photo'),
  isPublic: boolean('is_public').default(false).notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

export type MediaSelect = typeof mediaTable.$inferSelect;
export type MediaInsert = typeof mediaTable.$inferInsert;
