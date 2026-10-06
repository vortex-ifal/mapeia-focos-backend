import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { OccurrenceEntity } from '../entities';
import { DRIZZLE_PROVIDER, type DrizzleDB, occurrencesTable } from '../infra';
import { OccurrenceMapper } from '../mappers';

@Injectable()
export class OccurrencesRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleDB,
    private readonly mapper: OccurrenceMapper,
  ) {}

  async create(entity: OccurrenceEntity): Promise<OccurrenceEntity> {
    const data = this.mapper.toPersistence(entity);

    const [inserted] = await this.db
      .insert(occurrencesTable)
      .values(data)
      .returning();

    return this.mapper.toDomainFromPersistence(inserted);
  }

  async findById(id: string): Promise<OccurrenceEntity | null> {
    const [row] = await this.db
      .select()
      .from(occurrencesTable)
      .where(eq(occurrencesTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }
}
