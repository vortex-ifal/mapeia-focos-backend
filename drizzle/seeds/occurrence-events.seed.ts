import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../src/infra/database/schema';
import { occurrenceEventsTable } from '../../src/infra/database/schema';
import { OccurrenceEventKey } from '../../src/entities';

export const SEED_OCCURRENCE_EVENTS = {
  OCCURRENCE_CREATED: {
    id: '01a1478e-1c4a-7999-8001-d10ebf63fc01',
    key: OccurrenceEventKey.OCCURRENCE_CREATED,
    description: 'Ocorrência registrada no sistema',
  },
  STATUS_UPDATED: {
    id: '01a1478e-1c4a-7999-8002-d10ebf63fc02',
    key: OccurrenceEventKey.STATUS_UPDATED,
    description: 'Status da ocorrência alterado',
  },
  PRIORITY_UPDATED: {
    id: '01a1478e-1c4a-7999-8003-d10ebf63fc03',
    key: OccurrenceEventKey.PRIORITY_UPDATED,
    description: 'Prioridade da ocorrência atualizada',
  },
  AGENT_ASSIGNED: {
    id: '01a1478e-1c4a-7999-8004-d10ebf63fc04',
    key: OccurrenceEventKey.AGENT_ASSIGNED,
    description: 'Agente responsável atribuído à ocorrência',
  },
} as const;

export async function seedOccurrenceEvents(
  db: PostgresJsDatabase<typeof schema>,
): Promise<void> {
  const events = Object.values(SEED_OCCURRENCE_EVENTS);

  await db
    .insert(occurrenceEventsTable)
    .values(events)
    .onConflictDoNothing({ target: occurrenceEventsTable.key });
}
