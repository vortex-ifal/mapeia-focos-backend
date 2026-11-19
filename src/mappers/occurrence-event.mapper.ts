import { Injectable } from '@nestjs/common';
import {
  OccurrenceEventBuilder,
  OccurrenceEventEntity,
  OccurrenceEventKey,
} from '../entities';
import { OccurrenceEventInsert, OccurrenceEventSelect } from '../infra';

@Injectable()
export class OccurrenceEventMapper {
  toDomainFromPersistence(row: OccurrenceEventSelect): OccurrenceEventEntity {
    return OccurrenceEventBuilder.create()
      .withId(row.id)
      .withKey(row.key as OccurrenceEventKey)
      .withDescription(row.description)
      .build();
  }

  toPersistence(entity: OccurrenceEventEntity): OccurrenceEventInsert {
    return {
      id: entity.id,
      key: entity.key,
      description: entity.description,
    };
  }
}
