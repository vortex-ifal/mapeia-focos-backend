import { Injectable } from '@nestjs/common';
import { OccurrenceHistoryBuilder, OccurrenceHistoryEntity } from '../entities';
import { OccurrenceHistoryInsert, OccurrenceHistorySelect } from '../infra';

@Injectable()
export class OccurrenceHistoryMapper {
  toDomainFromPersistence(
    row: OccurrenceHistorySelect,
  ): OccurrenceHistoryEntity {
    return OccurrenceHistoryBuilder.create()
      .withId(row.id)
      .withOccurrenceId(row.occurrenceId)
      .withEventId(row.eventId)
      .withUserId(row.userId)
      .withCreatedAt(row.createdAt)
      .build();
  }

  toPersistence(entity: OccurrenceHistoryEntity): OccurrenceHistoryInsert {
    return {
      id: entity.id,
      occurrenceId: entity.occurrenceId,
      eventId: entity.eventId,
      userId: entity.userId,
    };
  }
}
