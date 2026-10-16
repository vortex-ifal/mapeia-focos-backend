import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../src/infra/database/schema';
import { rolesTable } from '../../src/infra/database/schema';

export const SEED_ROLES = {
  CITIZEN: {
    id: '01a1427d-b040-74e0-9921-1f44bb8a8cd3',
    name: 'citizen',
  },
  AGENT: {
    id: '01a1427d-b040-7cbd-8029-cdb377c5c3db',
    name: 'agent',
  },
  MANAGER: {
    id: '01a1427d-b040-7e49-80fa-a069e39f36fd',
    name: 'manager',
  },
} as const;

export async function seedRoles(db: PostgresJsDatabase<typeof schema>): Promise<void> {
  const roles = Object.values(SEED_ROLES);

  await db
    .insert(rolesTable)
    .values(roles)
    .onConflictDoNothing({ target: rolesTable.name });
}
