import { Injectable } from '@nestjs/common';
import {
  NearbyOccurrenceBuilder,
  NearbyOccurrenceEntity,
  OccurrenceBuilder,
  OccurrenceEntity,
  OccurrenceStatusEntity,
} from '../entities';
import {
  CreatedResponseDto,
  CreateOccurrenceDto,
  NearbyOccurrenceDto,
  TerritorialContextResponseDto,
  TriageQueueItemDto,
  TriageQueueResponseDto,
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

export interface NearbyOccurrenceRow {
  id: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  statusKey: string;
  statusName: string;
  distanceMeters: number;
}

@Injectable()
export class OccurrenceMapper {
  constructor(
    private readonly occurrenceStatusMapper: OccurrenceStatusMapper,
  ) {}

  toDomainFromDto(dto: CreateOccurrenceDto, userId: string): OccurrenceEntity {
    return OccurrenceBuilder.create()
      .withAddress(dto.address)
      .withDescription(dto.description)
      .withSituationType(dto.situation_type)
      .withCoordinates(dto.latitude, dto.longitude)
      .withIsAnonymous(true)
      .withUserId(userId)
      .build();
  }

  toCreatedDto(id: string): CreatedResponseDto {
    return {
      id,
    };
  }

  toPersistence(entity: OccurrenceEntity): OccurrenceInsert {
    const statusId = entity.status?.id;
    if (!statusId) {
      throw new Error(
        'A valid status with ID is required to persist an OccurrenceEntity',
      );
    }

    return {
      ...(entity.id ? { id: entity.id } : {}),
      address: entity.address,
      description: entity.description,
      situationType: entity.situationType ?? null,
      latitude: entity.latitude,
      longitude: entity.longitude,
      statusId,
      isAnonymous: entity.isAnonymous,
      userId: entity.userId,
    };
  }

  toDomainFromPersistence(row: OccurrenceSelectWithStatus): OccurrenceEntity {
    let statusEntity: OccurrenceStatusEntity | undefined;
    if (row.status) {
      statusEntity = this.occurrenceStatusMapper.toDomainFromPersistence(
        row.status,
      );
    }

    const builder = OccurrenceBuilder.create()
      .withId(row.id)
      .withAddress(row.address)
      .withDescription(row.description)
      .withSituationType(row.situationType)
      .withCoordinates(row.latitude, row.longitude)
      .withIsAnonymous(row.isAnonymous)
      .withUserId(row.userId)
      .withCreatedAt(row.createdAt)
      .withUpdatedAt(row.updatedAt);

    if (statusEntity) {
      builder.withStatus(statusEntity);
    }

    return builder.build();
  }

  // --- NOVOS MÉTODOS PARA TRIAGEM E CONTEXTO TERRITORIAL ---

  toNearbyDomainFromPersistence(
    row: NearbyOccurrenceRow,
  ): NearbyOccurrenceEntity {
    if (row.latitude === null || row.longitude === null) {
      throw new Error('A nearby occurrence must have coordinates');
    }

    return NearbyOccurrenceBuilder.create()
      .withId(row.id)
      .withCoordinates(row.latitude, row.longitude)
      .withStatus(row.statusKey, row.statusName)
      .withDistanceMeters(Math.round(row.distanceMeters))
      .withCreatedAt(row.createdAt)
      .build();
  }

  toTriageQueueDto(
    entities: OccurrenceEntity[],
    total: number,
    limit: number,
    offset: number,
  ): TriageQueueResponseDto {
    const now = new Date();
    return {
      items: entities.map((entity) => this.toTriageQueueItemDto(entity, now)),
      total,
      limit,
      offset,
    };
  }

  toTerritorialContextDto(
    entities: NearbyOccurrenceEntity[],
    radiusMeters: number,
  ): TerritorialContextResponseDto {
    return {
      radiusMeters,
      total: entities.length,
      items: entities.map((entity) => this.toNearbyDto(entity)),
    };
  }

  private toTriageQueueItemDto(
    entity: OccurrenceEntity,
    now: Date,
  ): TriageQueueItemDto {
    const createdAt = entity.createdAt ?? now;
    const waitingMs = Math.max(0, now.getTime() - createdAt.getTime());

    return {
      id: entity.id ?? '',
      address: this.simplifyAddress(entity.address),
      latitude: entity.latitude,
      longitude: entity.longitude,
      createdAt: createdAt.toISOString(),
      waitingMinutes: Math.floor(waitingMs / 60000),
      status: {
        key: entity.status?.key ?? '',
        name: entity.status?.name ?? '',
      },
    };
  }

  private toNearbyDto(entity: NearbyOccurrenceEntity): NearbyOccurrenceDto {
    return {
      id: entity.id,
      latitude: entity.latitude,
      longitude: entity.longitude,
      distanceMeters: entity.distanceMeters,
      status: { key: entity.statusKey, name: entity.statusName },
      createdAt: entity.createdAt.toISOString(),
    };
  }

  private simplifyAddress(address: string): string {
    return address
      .split(',')
      .slice(0, 2)
      .map((part) => part.trim())
      .join(', ')
      .slice(0, 80);
  }
}
