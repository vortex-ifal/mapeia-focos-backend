import * as bcrypt from 'bcrypt';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../src/infra/database/schema';
import { usersTable } from '../../src/infra/database/schema';
import { SEED_ROLES } from './roles.seed';

const SEED_USERS = {
  CITIZEN: {
    id: '01a1427d-cf30-7abd-8766-892c2952f620',
    name: 'Cidadão Padrão',
    email: 'cidadao@email.com',
    cpf: '11111111111',
    roleId: SEED_ROLES.CITIZEN.id,
    isActive: true,
  },
  AGENT: {
    id: '01a1427d-cf34-7f7d-9662-87d1921be41a',
    name: 'Agente de Endemias',
    email: 'agente@email.com',
    cpf: '22222222222',
    roleId: SEED_ROLES.AGENT.id,
    isActive: true,
  },
  MANAGER: {
    id: '01a1427d-cf37-79cb-8cbf-aaf0a1fdacd6',
    name: 'Gestor Geral',
    email: 'gestor@email.com',
    cpf: '33333333333',
    roleId: SEED_ROLES.MANAGER.id,
    isActive: true,
  },
} as const;

export async function seedUsers(db: PostgresJsDatabase<typeof schema>): Promise<void> {
  const defaultPasswordHash = await bcrypt.hash('Test1234!', 10);

  const initialUsers = Object.values(SEED_USERS).map((user) => ({
    ...user,
    passwordHash: defaultPasswordHash,
  }));

  for (const user of initialUsers) {
    await db
      .insert(usersTable)
      .values(user)
      .onConflictDoNothing({ target: usersTable.id });
  }
}
