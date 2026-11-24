import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
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
      await tx.insert(assignmentsTable).values(data);

      const [updated] = await tx
        .update(occurrencesTable)
        .set({
          statusId: newStatusId,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(occurrencesTable.id, entity.occurrenceId),
            eq(occurrencesTable.isActive, true),
          ),
        )
        .returning({ id: occurrencesTable.id });

      if (!updated) {
        return false;
      }

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

  async findLatestByOccurrenceId(
    occurrenceId: string,
  ): Promise<AssignmentEntity | null> {
    const [row] = await this.db
      .select()
      .from(assignmentsTable)
      .where(eq(assignmentsTable.occurrenceId, occurrenceId))
      .orderBy(desc(assignmentsTable.assignedAt), desc(assignmentsTable.id))
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }
}
