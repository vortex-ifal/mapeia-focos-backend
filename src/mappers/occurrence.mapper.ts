import { Injectable } from '@nestjs/common';
import {
  OccurrenceBuilder,
  OccurrenceEntity,
  OccurrenceStatusEntity,
  type OccurrenceStatusReadModel,
} from '../entities';
import {
  CreatedResponseDto,
  CreateOccurrenceDto,
  OccurrenceStatusResponseDto,
} from '../dtos';
import {
  OccurrenceInsert,
  OccurrenceSelect,
  OccurrenceStatusSelect,
} from '../infra';
import { OccurrenceStatusMapper } from './occurrence-status.mapper';

export type OccurrenceSelectWithStatus = OccurrenceSelect & {
  status?: OccurrenceStatusSelect | null;
};

@Injectable()
export class OccurrenceMapper {
  constructor(
    private readonly occurrenceStatusMapper: OccurrenceStatusMapper,
  ) {}

  toDomainFromDto(dto: CreateOccurrenceDto, userId: string): OccurrenceEntity {
    return OccurrenceBuilder.create()
      .withAddress(dto.address)
      .withDescription(dto.description)
      .withSituationType(dto.situationType)
      .withCoordinates(dto.latitude, dto.longitude)
      .withUserId(userId)
      .build();
  }

  toCreatedDto(id: string, protocol?: string): CreatedResponseDto {
    return {
      id,
      ...(protocol ? { protocol } : {}),
    };
  }

  toStatusDto(
    readModel: OccurrenceStatusReadModel,
  ): OccurrenceStatusResponseDto {
    return {
      protocol: readModel.protocol,
      statusKey: readModel.statusKey,
      statusName: readModel.statusName,
    };
  }

  toPersistence(entity: OccurrenceEntity): OccurrenceInsert {
    const statusId = entity.status?.id;
    if (!statusId) {
      throw new Error(
        'A valid status with ID is required to persist an OccurrenceEntity',
      );
    }
    if (!entity.protocol) {
      throw new Error(
        'A valid protocol is required to persist an OccurrenceEntity',
      );
    }

    return {
      ...(entity.id ? { id: entity.id } : {}),
      protocol: entity.protocol,
      address: entity.address,
      description: entity.description,
      situationType: entity.situationType ?? null,
      latitude: entity.latitude,
      longitude: entity.longitude,
      statusId,
      userId: entity.userId,
    };
  }

  toDomainFromPersistence(
    row: OccurrenceSelectWithStatus,
  ): OccurrenceEntity {
    let statusEntity: OccurrenceStatusEntity | undefined;
    if (row.status) {
      statusEntity = this.occurrenceStatusMapper.toDomainFromPersistence(
        row.status,
      );
    }

    const builder = OccurrenceBuilder.create()
      .withId(row.id)
      .withProtocol(row.protocol)
      .withAddress(row.address)
      .withDescription(row.description)
      .withSituationType(row.situationType)
      .withCoordinates(row.latitude, row.longitude)
      .withUserId(row.userId)
      .withCreatedAt(row.createdAt)
      .withUpdatedAt(row.updatedAt);

    if (statusEntity) {
      builder.withStatus(statusEntity);
    }

    return builder.build();
  }
}
