import { Injectable } from '@nestjs/common';
import { OccurrenceBuilder, OccurrenceEntity, OccurrenceStatus } from '../entities';
import { CreatedResponseDto, CreateOccurrenceDto } from '../dtos';
import { OccurrenceInsert, OccurrenceSelect } from '../infra';

@Injectable()
export class OccurrenceMapper {
  toDomainFromDto(dto: CreateOccurrenceDto): OccurrenceEntity {
    return OccurrenceBuilder.create()
      .withAddress(dto.address)
      .withDescription(dto.description)
      .withSituationType(dto.situation_type)
      .withContact(dto.contact)
      .withStatus('pending')
      .withIsAnonymous(true)
      .build();
  }

  toCreatedDto(entity: OccurrenceEntity): CreatedResponseDto {
    return {
      id: entity.id ?? '',
    };
  }

  toPersistence(entity: OccurrenceEntity): OccurrenceInsert {
    return {
      ...(entity.id ? { id: entity.id } : {}),
      address: entity.address,
      description: entity.description,
      situationType: entity.situationType ?? null,
      contact: entity.contact ?? null,
      status: entity.status,
      isAnonymous: entity.isAnonymous,
      reportedByUserId: entity.reportedByUserId ?? null,
    };
  }

  toDomainFromPersistence(row: OccurrenceSelect): OccurrenceEntity {
    return OccurrenceBuilder.create()
      .withId(row.id)
      .withAddress(row.address)
      .withDescription(row.description)
      .withSituationType(row.situationType)
      .withContact(row.contact)
      .withStatus(row.status as OccurrenceStatus)
      .withIsAnonymous(row.isAnonymous)
      .withReportedByUserId(row.reportedByUserId)
      .withCreatedAt(row.createdAt)
      .withUpdatedAt(row.updatedAt)
      .build();
  }
}
