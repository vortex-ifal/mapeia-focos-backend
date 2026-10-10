import { Inject, Injectable } from '@nestjs/common';
import { count, eq } from 'drizzle-orm';
import { MediaEntity } from '../entities';
import { DRIZZLE_PROVIDER, type DrizzleDB, mediaTable } from '../infra';
import { MediaMapper } from '../mappers';

@Injectable()
export class MediaRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleDB,
    private readonly mapper: MediaMapper,
  ) {}

  async countByOccurrenceId(occurrenceId: string): Promise<number> {
    const [result] = await this.db
      .select({ count: count() })
      .from(mediaTable)
      .where(eq(mediaTable.occurrenceId, occurrenceId));

    return result?.count ?? 0;
  }

  async create(entity: MediaEntity): Promise<MediaEntity> {
    const data = this.mapper.toPersistence(entity);

    const [inserted] = await this.db
      .insert(mediaTable)
      .values(data)
      .returning();

    return this.mapper.toDomainFromPersistence(inserted);
  }

  async findById(id: string): Promise<MediaEntity | null> {
    const [row] = await this.db
      .select()
      .from(mediaTable)
      .where(eq(mediaTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }
}
