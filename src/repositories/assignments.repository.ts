import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNotNull } from 'drizzle-orm';
import { AssignmentEntity, OccurrenceHistoryEntity } from '../entities';
import {
  assignmentsTable,
  DRIZZLE_PROVIDER,
  type DrizzleDB,
  occurrenceHistoryTable,
  occurrencesTable,
  statusHistoriesTable,
} from '../infra';
import { AssignmentMapper, OccurrenceHistoryMapper } from '../mappers';

@Injectable()
export class AssignmentsRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleDB,
    private readonly mapper: AssignmentMapper,
    private readonly historyMapper: OccurrenceHistoryMapper,
  ) {}

  async createWithStatusUpdate(
    entity: AssignmentEntity,
    previousStatusId: string,
    newStatusId: string,
    historyEntity?: OccurrenceHistoryEntity,
  ): Promise<boolean> {
    const data = this.mapper.toPersistence(entity);

    return this.db.transaction(async (tx) => {
      const operationAt = new Date();
      const [updated] = await tx
        .update(occurrencesTable)
        .set({
          statusId: newStatusId,
          updatedAt: operationAt,
        })
        .where(
          and(
            eq(occurrencesTable.id, entity.occurrenceId),
            eq(occurrencesTable.isActive, true),
            eq(occurrencesTable.statusId, previousStatusId),
            isNotNull(occurrencesTable.priority),
          ),
        )
        .returning({ id: occurrencesTable.id });

      if (!updated) {
        return false;
      }

      await tx
        .insert(assignmentsTable)
        .values({ ...data, assignedAt: operationAt });

      await tx.insert(statusHistoriesTable).values({
        occurrenceId: entity.occurrenceId,
        previousStatusId,
        newStatusId,
        changedByUserId: entity.assignedByManagerId,
      });

      if (historyEntity) {
        await tx
          .insert(occurrenceHistoryTable)
          .values(this.historyMapper.toPersistence(historyEntity));
      }

      return true;
    });
  }
}
