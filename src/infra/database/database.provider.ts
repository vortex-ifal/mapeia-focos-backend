import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { DRIZZLE_PROVIDER } from './database.constants';

export type DrizzleDB = PostgresJsDatabase<typeof schema>;

export const databaseProvider = {
  provide: DRIZZLE_PROVIDER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): DrizzleDB => {
    const connectionString =
      configService.get<string>('DATABASE_URL') || process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not set in environment variables');
    }

    const client = postgres(connectionString);
    return drizzle(client, { schema });
  },
};