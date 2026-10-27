import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, count, eq } from 'drizzle-orm';
import { MediaEntity } from '../entities';
import { DRIZZLE_PROVIDER, type DrizzleDB, mediaTable, occurrencesTable } from '../infra';
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

  async createWithLimit(
    entity: MediaEntity,
    occurrenceId: string,
    maxLimit: number,
  ): Promise<MediaEntity> {
    return this.db.transaction(async (tx) => {
      // 1. Bloqueia a linha da ocorrência com FOR UPDATE para serializar requisições concorrentes
      const [occurrence] = await tx
        .select({ id: occurrencesTable.id })
        .from(occurrencesTable)
        .where(
          and(
            eq(occurrencesTable.id, occurrenceId),
            eq(occurrencesTable.isActive, true),
          ),
        )
        .for('update');

      if (!occurrence) {
        throw new NotFoundException('Ocorrência não encontrada');
      }

      // 2. Conta com precisão atômica sob a transação bloqueada
      const [result] = await tx
        .select({ count: count() })
        .from(mediaTable)
        .where(eq(mediaTable.occurrenceId, occurrenceId));

      const currentCount = result?.count ?? 0;
      if (currentCount >= maxLimit) {
        throw new BadRequestException(
          `Limite de ${maxLimit} mídias por ocorrência atingido`,
        );
      }

      // 3. Insere a mídia com segurança
      const data = this.mapper.toPersistence(entity);
      const [inserted] = await tx
        .insert(mediaTable)
        .values(data)
        .returning();

      return this.mapper.toDomainFromPersistence(inserted);
    });
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

  async findAllByOccurrenceId(occurrenceId: string): Promise<MediaEntity[]> {
    const rows = await this.db
      .select()
      .from(mediaTable)
      .where(eq(mediaTable.occurrenceId, occurrenceId))
      .orderBy(asc(mediaTable.uploadedAt));

    return rows.map((row) => this.mapper.toDomainFromPersistence(row));
  }
}
