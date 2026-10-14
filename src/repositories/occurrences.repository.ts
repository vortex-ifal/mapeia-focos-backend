import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
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
      .where(
        and(
          eq(occurrencesTable.id, id),
          eq(occurrencesTable.isActive, true),
        ),
      )
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }

  async softDelete(id: string): Promise<boolean> {
    const [updated] = await this.db
      .update(occurrencesTable)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(occurrencesTable.id, id),
          eq(occurrencesTable.isActive, true),
        ),
      )
      .returning({ id: occurrencesTable.id });

    return !!updated;
  }
}

