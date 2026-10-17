import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { OccurrenceStatusEntity } from '../entities';
import {
  DRIZZLE_PROVIDER,
  type DrizzleDB,
  occurrenceStatusesTable,
} from '../infra';
import { OccurrenceStatusMapper } from '../mappers';

@Injectable()
export class OccurrenceStatusesRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleDB,
    private readonly mapper: OccurrenceStatusMapper,
  ) {}

  async findByKey(key: string): Promise<OccurrenceStatusEntity | null> {
    const [row] = await this.db
      .select()
      .from(occurrenceStatusesTable)
      .where(eq(occurrenceStatusesTable.key, key))
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }

  async findById(id: string): Promise<OccurrenceStatusEntity | null> {
    const [row] = await this.db
      .select()
      .from(occurrenceStatusesTable)
      .where(eq(occurrenceStatusesTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }

  async findAll(): Promise<OccurrenceStatusEntity[]> {
    const rows = await this.db.select().from(occurrenceStatusesTable);
    return rows.map((row) => this.mapper.toDomainFromPersistence(row));
  }
}
