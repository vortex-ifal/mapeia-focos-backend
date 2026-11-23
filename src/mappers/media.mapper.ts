import { Injectable } from '@nestjs/common';
import { MediaBuilder, MediaEntity, MediaType } from '../entities';
import {
  AgentOccurrenceMediaResponseDto,
  MediaResponseDto,
  UploadMediaResponseDto,
} from '../dtos';
import { MediaInsert, MediaSelect } from '../infra';

@Injectable()
export class MediaMapper {
  toDomainFromPersistence(row: MediaSelect): MediaEntity {
    return MediaBuilder.create()
      .withId(row.id)
      .withOccurrenceId(row.occurrenceId)
      .withStorageKey(row.storageKey)
      .withMimeType(row.mimeType)
      .withFileSizeBytes(Number(row.fileSizeBytes))
      .withType(row.type as MediaType)
      .withUploadedAt(row.uploadedAt)
      .build();
  }

  toPersistence(entity: MediaEntity): MediaInsert {
    return {
      ...(entity.id ? { id: entity.id } : {}),
      occurrenceId: entity.occurrenceId,
      storageKey: entity.storageKey,
      mimeType: entity.mimeType,
      fileSizeBytes: entity.fileSizeBytes,
      type: entity.type,
      isPublic: entity.isPublic,
    };
  }

  toDto(entity: MediaEntity): UploadMediaResponseDto {
    if (!entity.id) {
      throw new Error('MediaEntity id is required to map to DTO');
    }
    if (!entity.uploadedAt) {
      throw new Error('MediaEntity uploadedAt is required to map to DTO');
    }

    return {
      id: entity.id,
      storageKey: entity.storageKey,
      mimeType: entity.mimeType,
      fileSizeBytes: entity.fileSizeBytes,
      uploadedAt: entity.uploadedAt,
    };
  }

  toResponseDto(entity: MediaEntity): MediaResponseDto {
    if (!entity.id) {
      throw new Error('MediaEntity id is required to map to DTO');
    }

    return {
      id: entity.id,
      url: entity.url ?? '',
      type: entity.type,
    };
  }

  toAgentOccurrenceResponseDto(
    entity: MediaEntity,
  ): AgentOccurrenceMediaResponseDto {
    const response = this.toResponseDto(entity);

    return {
      id: response.id,
      url: response.url,
      type: response.type,
      mimeType: entity.mimeType,
      fileSizeBytes: entity.fileSizeBytes,
    };
  }
}
