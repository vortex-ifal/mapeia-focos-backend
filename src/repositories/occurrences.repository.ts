import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import {
  OccurrenceEntity,
  type OccurrenceCreatedReadModel,
  type OccurrenceStatusReadModel,
} from '../entities';
import {
  DRIZZLE_PROVIDER,
  type DrizzleDB,
  occurrencesTable,
  occurrenceStatusesTable,
  statusHistoriesTable,
} from '../infra';
import { OccurrenceMapper } from '../mappers';

@Injectable()
export class OccurrencesRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleDB,
    private readonly mapper: OccurrenceMapper,
  ) {}

  async create(
    entity: OccurrenceEntity,
  ): Promise<OccurrenceCreatedReadModel> {
    const data = this.mapper.toPersistence(entity);

    const [inserted] = await this.db
      .insert(occurrencesTable)
      .values(data)
      .returning({
        id: occurrencesTable.id,
        protocol: occurrencesTable.protocol,
      });

    return {
      id: inserted.id,
      protocol: inserted.protocol,
    };
  }

  async findById(id: string): Promise<OccurrenceEntity | null> {
    const [row] = await this.db
      .select({
        occurrence: occurrencesTable,
        status: occurrenceStatusesTable,
      })
      .from(occurrencesTable)
      .leftJoin(
        occurrenceStatusesTable,
        eq(occurrencesTable.statusId, occurrenceStatusesTable.id),
      )
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

    return this.mapper.toDomainFromPersistence({
      ...row.occurrence,
      status: row.status,
    });
  }

  async findStatusByProtocol(
    protocol: string,
  ): Promise<OccurrenceStatusReadModel | null> {
    const [row] = await this.db
      .select({
        protocol: occurrencesTable.protocol,
        statusKey: occurrenceStatusesTable.key,
        statusName: occurrenceStatusesTable.name,
      })
      .from(occurrencesTable)
      .innerJoin(
        occurrenceStatusesTable,
        eq(occurrencesTable.statusId, occurrenceStatusesTable.id),
      )
      .where(
        and(
          eq(occurrencesTable.protocol, protocol),
          eq(occurrencesTable.isActive, true),
        ),
      )
      .limit(1);

    if (!row) {
      return null;
    }

    return {
      protocol: row.protocol,
      statusKey: row.statusKey,
      statusName: row.statusName,
    };
  }

  async updateStatusWithHistory(params: {
    occurrenceId: string;
    previousStatusId: string;
    newStatusId: string;
    changedByUserId: string;
    isActive?: boolean;
  }): Promise<boolean> {
    const {
      occurrenceId,
      previousStatusId,
      newStatusId,
      changedByUserId,
      isActive = true,
    } = params;

    return this.db.transaction(async (tx) => {
      const [updated] = await tx
        .update(occurrencesTable)
        .set({
          statusId: newStatusId,
          isActive,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(occurrencesTable.id, occurrenceId),
            eq(occurrencesTable.isActive, true),
          ),
        )
        .returning({ id: occurrencesTable.id });

      if (!updated) {
        return false;
      }

      await tx.insert(statusHistoriesTable).values({
        occurrenceId,
        previousStatusId,
        newStatusId,
        changedByUserId,
      });

      return true;
    });
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
