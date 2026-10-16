import * as bcrypt from 'bcrypt';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../src/infra/database/schema';
import { rolesTable, usersTable } from '../../src/infra/database/schema';

export async function seedUsers(db: PostgresJsDatabase<typeof schema>): Promise<void> {
  const roles = await db.select().from(rolesTable);
  const rolesByName = new Map(roles.map((r) => [r.name, r.id]));

  const citizenRoleId = rolesByName.get('citizen');
  const agentRoleId = rolesByName.get('agent');
  const managerRoleId = rolesByName.get('manager');

  if (!citizenRoleId || !agentRoleId || !managerRoleId) {
    throw new Error('Roles necessárias não encontradas na tabela "roles". Execute o seed de roles primeiro.');
  }

  const defaultPasswordHash = await bcrypt.hash('Test1234!', 10);

  const initialUsers = [
    {
      id: '01a1427d-cf30-7abd-8766-892c2952f620',
      name: 'Cidadão Padrão',
      email: 'cidadao@email.com',
      cpf: '15793334009',
      roleId: citizenRoleId,
      isActive: true,
      passwordHash: defaultPasswordHash,
    },
    {
      id: '01a1427d-cf34-7f7d-9662-87d1921be41a',
      name: 'Agente de Endemias',
      email: 'agente@email.com',
      cpf: '40288895029',
      roleId: agentRoleId,
      isActive: true,
      passwordHash: defaultPasswordHash,
    },
    {
      id: '01a1427d-cf37-79cb-8cbf-aaf0a1fdacd6',
      name: 'Gestor Geral',
      email: 'gestor@email.com',
      cpf: '06612665084',
      roleId: managerRoleId,
      isActive: true,
      passwordHash: defaultPasswordHash,
    },
  ];

  for (const user of initialUsers) {
    await db
      .insert(usersTable)
      .values(user)
      .onConflictDoNothing({ target: usersTable.id });
  }
}
