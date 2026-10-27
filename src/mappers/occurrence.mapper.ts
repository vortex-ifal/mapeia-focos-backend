import { Injectable } from '@nestjs/common';
import {
  OccurrenceBuilder,
  OccurrenceEntity,
  OccurrenceStatusEntity,
  type NearbyOccurrenceReadModel,
  type OccurrenceCreatedReadModel,
  type OccurrenceDetailsReadModel,
  type OccurrenceProtocolStatusReadModel,
  type PaginationReadModel,
} from '../entities';
import {
  CreatedResponseDto,
  CreateOccurrenceDto,
  CreateOccurrenceResponseDto,
  NearbyOccurrenceDto,
  OccurrenceDetailResponseDto,
  OccurrenceProtocolStatusResponseDto,
  OccurrenceResponseDto,
  PaginationResponseDto,
  TerritorialContextResponseDto,
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
      .withSituationType(dto.situationType)
      .withCoordinates(dto.latitude, dto.longitude)
      .withUserId(userId)
      .build();
  }

  toCreatedDto(id: string): CreatedResponseDto {
    return {
      id,
    };
  }

  toCreateResponseDto(
    readModel: OccurrenceCreatedReadModel,
  ): CreateOccurrenceResponseDto {
    return {
      id: readModel.id,
      protocol: readModel.protocol,
    };
  }

  toStatusDto(
    readModel: OccurrenceProtocolStatusReadModel,
  ): OccurrenceProtocolStatusResponseDto {
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

  toDomainFromPersistence(row: OccurrenceSelectWithStatus): OccurrenceEntity {
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

  toNearbyReadModelFromPersistence(
    row: NearbyOccurrenceRow,
  ): NearbyOccurrenceReadModel {
    if (row.latitude === null || row.longitude === null) {
      throw new Error('A nearby occurrence must have coordinates');
    }

    return {
      id: row.id,
      latitude: row.latitude,
      longitude: row.longitude,
      statusKey: row.statusKey,
      statusName: row.statusName,
      distanceMeters: Math.round(row.distanceMeters),
      createdAt: row.createdAt,
    };
  }

  toPaginatedListDto(
    readModel: PaginationReadModel<OccurrenceEntity>,
  ): PaginationResponseDto<OccurrenceResponseDto> {
    const data = readModel.data.map((entity) => this.toDto(entity));

    return new PaginationResponseDto<OccurrenceResponseDto>(
      data,
      readModel.page,
      readModel.pageSize,
      readModel.total,
      readModel.totalPages,
    );
  }

  toTerritorialContextDto(
    readModels: NearbyOccurrenceReadModel[],
    radiusMeters: number,
  ): TerritorialContextResponseDto {
    return {
      radiusMeters,
      total: readModels.length,
      items: readModels.map((item) => this.toNearbyDto(item)),
    };
  }

  toDetailsDto(
    readModel: OccurrenceDetailsReadModel,
  ): OccurrenceDetailResponseDto {
    return {
      id: readModel.id,
      protocol: readModel.protocol,
      address: readModel.address,
      description: readModel.description,
      situationType: readModel.situationType,
      latitude: readModel.latitude,
      longitude: readModel.longitude,
      status: {
        key: readModel.status.key,
        name: readModel.status.name,
      },
      createdAt: readModel.createdAt,
      updatedAt: readModel.updatedAt,
      media: readModel.media.map((item) => ({
        id: item.id,
        mimeType: item.mimeType,
        fileSizeBytes: item.fileSizeBytes,
        type: item.type,
        uploadedAt: item.uploadedAt,
      })),
    };
  }

  toDto(entity: OccurrenceEntity): OccurrenceResponseDto {
    return {
      id: entity.id ?? '',
      protocol: entity.protocol ?? '',
      address: entity.address,
      description: entity.description,
      situationType: entity.situationType ?? null,
      latitude: entity.latitude,
      longitude: entity.longitude,
      createdAt: entity.createdAt ?? new Date(),
      updatedAt: entity.updatedAt ?? new Date(),
      status: {
        key: entity.status?.key ?? '',
        name: entity.status?.name ?? '',
      },
    };
  }

  private toNearbyDto(item: NearbyOccurrenceReadModel): NearbyOccurrenceDto {
    return {
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      distanceMeters: item.distanceMeters,
      status: { key: item.statusKey, name: item.statusName },
      createdAt: item.createdAt.toISOString(),
    };
  }
}
