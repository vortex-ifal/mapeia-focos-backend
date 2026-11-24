import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import {
  InspectionEntity,
  InspectionStatus,
  OccurrenceHistoryEntity,
} from '../entities';
import {
  DRIZZLE_PROVIDER,
  type DrizzleDB,
  inspectionsTable,
  occurrenceHistoryTable,
  occurrencesTable,
  statusHistoriesTable,
} from '../infra';
import { InspectionMapper, OccurrenceHistoryMapper } from '../mappers';

export interface OccurrenceStatusTransition {
  previousStatusId: string;
  newStatusId: string;
}

@Injectable()
export class InspectionsRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleDB,
    private readonly mapper: InspectionMapper,
    private readonly historyMapper: OccurrenceHistoryMapper,
  ) {}

  async findDraftByOccurrenceAndAgent(
    occurrenceId: string,
    agentId: string,
  ): Promise<InspectionEntity | null> {
    const [row] = await this.db
      .select()
      .from(inspectionsTable)
      .where(
        and(
          eq(inspectionsTable.occurrenceId, occurrenceId),
          eq(inspectionsTable.agentId, agentId),
          eq(inspectionsTable.status, InspectionStatus.DRAFT),
        ),
      )
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }

  async findByOccurrenceId(occurrenceId: string): Promise<InspectionEntity[]> {
    const rows = await this.db
      .select()
      .from(inspectionsTable)
      .where(eq(inspectionsTable.occurrenceId, occurrenceId))
      .orderBy(desc(inspectionsTable.inspectedAt), desc(inspectionsTable.id));

    return rows.map((row) => this.mapper.toDomainFromPersistence(row));
  }

  async upsertDraft(entity: InspectionEntity): Promise<InspectionEntity> {
    return this.db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(inspectionsTable)
        .where(
          and(
            eq(inspectionsTable.occurrenceId, entity.occurrenceId),
            eq(inspectionsTable.agentId, entity.agentId),
            eq(inspectionsTable.status, InspectionStatus.DRAFT),
          ),
        )
        .limit(1);

      if (existing) {
        const [updated] = await tx
          .update(inspectionsTable)
          .set({
            condition: entity.condition,
            actionsTaken: entity.actionsTaken,
            notes: entity.notes,
          })
          .where(eq(inspectionsTable.id, existing.id))
          .returning();

        return this.mapper.toDomainFromPersistence(updated);
      }

      const [inserted] = await tx
        .insert(inspectionsTable)
        .values(this.mapper.toPersistence(entity))
        .returning();

      return this.mapper.toDomainFromPersistence(inserted);
    });
  }

  async completeWithStatusUpdate(
    entity: InspectionEntity,
    existingDraftId?: string,
    statusTransition?: OccurrenceStatusTransition,
    historyEntity?: OccurrenceHistoryEntity,
  ): Promise<InspectionEntity | null> {
    return this.db.transaction(async (tx) => {
      if (statusTransition) {
        const [updatedOccurrence] = await tx
          .update(occurrencesTable)
          .set({
            statusId: statusTransition.newStatusId,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(occurrencesTable.id, entity.occurrenceId),
              eq(occurrencesTable.isActive, true),
              eq(occurrencesTable.statusId, statusTransition.previousStatusId),
            ),
          )
          .returning({ id: occurrencesTable.id });

        if (!updatedOccurrence) {
          return null;
        }

        await tx.insert(statusHistoriesTable).values({
          occurrenceId: entity.occurrenceId,
          previousStatusId: statusTransition.previousStatusId,
          newStatusId: statusTransition.newStatusId,
          changedByUserId: entity.agentId,
        });
      }

      if (historyEntity) {
        await tx
          .insert(occurrenceHistoryTable)
          .values(this.historyMapper.toPersistence(historyEntity));
      }

      if (existingDraftId) {
        const [updatedInspection] = await tx
          .update(inspectionsTable)
          .set({
            status: InspectionStatus.COMPLETED,
            condition: entity.condition,
            actionsTaken: entity.actionsTaken,
            notes: entity.notes,
            result: entity.result,
          })
          .where(
            and(
              eq(inspectionsTable.id, existingDraftId),
              eq(inspectionsTable.status, InspectionStatus.DRAFT),
            ),
          )
          .returning();

        if (!updatedInspection) {
          throw new ConflictException(
            'O rascunho da vistoria não está mais disponível para conclusão',
          );
        }

        return this.mapper.toDomainFromPersistence(updatedInspection);
      }

      const [insertedInspection] = await tx
        .insert(inspectionsTable)
        .values(this.mapper.toPersistence(entity))
        .returning();

      return this.mapper.toDomainFromPersistence(insertedInspection);
    });
  }
}
