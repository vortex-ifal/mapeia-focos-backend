import { Injectable } from '@nestjs/common';
import { MediaBuilder, MediaEntity, MediaType } from '../entities';
import { UploadMediaResponseDto } from '../dtos';
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
    return {
      id: entity.id ?? '',
      storageKey: entity.storageKey,
      mimeType: entity.mimeType,
      fileSizeBytes: entity.fileSizeBytes,
      uploadedAt: entity.uploadedAt ?? new Date(),
    };
  }
}
