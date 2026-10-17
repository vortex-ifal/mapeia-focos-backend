import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../src/infra/database/schema';
import { occurrenceStatusesTable } from '../../src/infra/database/schema';

export const SEED_OCCURRENCE_STATUSES = {
  REGISTERED: {
    id: '01a1478e-1c42-7490-8a29-2085577de626',
    name: 'Registrada',
    key: 'registered',
  },
  UNDER_REVIEW: {
    id: '01a1478e-1c49-777e-882f-4cb0bb46b779',
    name: 'Em análise',
    key: 'under_review',
  },
  REJECTED: {
    id: '01a1478e-1c49-70ac-99c1-2f26eb87575f',
    name: 'Reprovada',
    key: 'rejected',
  },
  ACCEPTED: {
    id: '01a1478e-1c4a-7337-89ca-419c7f35ef00',
    name: 'Aceita',
    key: 'accepted',
  },
  FORWARDED_FOR_INSPECTION: {
    id: '01a1478e-1c4a-756b-8aa1-d10ebf63fc6b',
    name: 'Encaminhada para Vistoria',
    key: 'forwarded_for_inspection',
  },
  RESOLVED: {
    id: '01a1478e-1c4a-758b-9700-b38b756a66cf',
    name: 'Resolvida',
    key: 'resolved',
  },
} as const;

export async function seedOccurrenceStatuses(
  db: PostgresJsDatabase<typeof schema>,
): Promise<void> {
  const statuses = Object.values(SEED_OCCURRENCE_STATUSES);

  await db
    .insert(occurrenceStatusesTable)
    .values(statuses)
    .onConflictDoNothing({ target: occurrenceStatusesTable.key });
}
