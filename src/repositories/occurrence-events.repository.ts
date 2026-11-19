import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { OccurrenceEventEntity, OccurrenceEventKey } from '../entities';
import {
  DRIZZLE_PROVIDER,
  type DrizzleDB,
  occurrenceEventsTable,
} from '../infra';
import { OccurrenceEventMapper } from '../mappers';

@Injectable()
export class OccurrenceEventsRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleDB,
    private readonly mapper: OccurrenceEventMapper,
  ) {}

  async findByKey(
    key: OccurrenceEventKey,
  ): Promise<OccurrenceEventEntity | null> {
    const [row] = await this.db
      .select()
      .from(occurrenceEventsTable)
      .where(eq(occurrenceEventsTable.key, key))
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }

  async findById(id: string): Promise<OccurrenceEventEntity | null> {
    const [row] = await this.db
      .select()
      .from(occurrenceEventsTable)
      .where(eq(occurrenceEventsTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }

  async findAll(): Promise<OccurrenceEventEntity[]> {
    const rows = await this.db.select().from(occurrenceEventsTable);
    return rows.map((row) => this.mapper.toDomainFromPersistence(row));
  }
}
