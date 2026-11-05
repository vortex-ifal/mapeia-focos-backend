import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { AssignmentEntity } from '../entities';
import {
  assignmentsTable,
  DRIZZLE_PROVIDER,
  type DrizzleDB,
  occurrencesTable,
  statusHistoriesTable,
} from '../infra';
import { AssignmentMapper } from '../mappers';

@Injectable()
export class AssignmentsRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleDB,
    private readonly mapper: AssignmentMapper,
  ) {}

  async createWithStatusUpdate(
    entity: AssignmentEntity,
    previousStatusId: string,
    newStatusId: string,
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

      return true;
    });
  }
}
