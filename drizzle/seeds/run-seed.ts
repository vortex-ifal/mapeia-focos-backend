import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../src/infra/database/schema';
import { seedOccurrenceStatuses } from './occurrence-statuses.seed';
import { seedRoles } from './roles.seed';
import { seedUsers } from './users.seed';

async function runSeeds() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL não configurada no ambiente.');
    process.exit(1);
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  console.log('🌱 Iniciando execução dos seeds...');

  try {
    console.log('⏳ Populando roles...');
    await seedRoles(db);
    console.log('✅ Roles populadas com sucesso.');

    console.log('⏳ Populando usuários iniciais...');
    await seedUsers(db);
    console.log('✅ Usuários iniciais populados com sucesso.');

    console.log('⏳ Populando status de ocorrência...');
    await seedOccurrenceStatuses(db);
    console.log('✅ Status de ocorrência populados com sucesso.');

    console.log('🎉 Todos os seeds foram aplicados com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a execução dos seeds:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

void runSeeds();
