import { Injectable } from '@nestjs/common';
import { OccurrenceStatusBuilder, OccurrenceStatusEntity } from '../entities';
import { OccurrenceStatusInsert, OccurrenceStatusSelect } from '../infra';

@Injectable()
export class OccurrenceStatusMapper {
  toDomainFromPersistence(row: OccurrenceStatusSelect): OccurrenceStatusEntity {
    return OccurrenceStatusBuilder.create()
      .withId(row.id)
      .withName(row.name)
      .withKey(row.key)
      .build();
  }

  toPersistence(entity: OccurrenceStatusEntity): OccurrenceStatusInsert {
    return {
      ...(entity.id ? { id: entity.id } : {}),
      name: entity.name,
      key: entity.key,
    };
  }
}
