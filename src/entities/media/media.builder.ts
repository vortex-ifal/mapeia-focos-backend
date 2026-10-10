import { MediaEntity } from './media.entity';
import { MediaProps, MediaType } from './media.props';

export class MediaBuilder {
  private props: MediaProps;

  constructor() {
    this.props = {
      occurrenceId: '',
      storageKey: '',
      mimeType: '',
      fileSizeBytes: 0,
      type: 'photo',
      isPublic: false,
    };
  }

  static create(): MediaBuilder {
    return new MediaBuilder();
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withOccurrenceId(occurrenceId: string): this {
    this.props.occurrenceId = occurrenceId;
    return this;
  }

  withStorageKey(storageKey: string): this {
    this.props.storageKey = storageKey;
    return this;
  }

  withMimeType(mimeType: string): this {
    this.props.mimeType = mimeType;
    return this;
  }

  withFileSizeBytes(fileSizeBytes: number): this {
    this.props.fileSizeBytes = fileSizeBytes;
    return this;
  }

  withType(type: MediaType): this {
    this.props.type = type;
    return this;
  }

  withUploadedAt(uploadedAt?: Date): this {
    this.props.uploadedAt = uploadedAt;
    return this;
  }

  build(): MediaEntity {
    if (
      !this.props.occurrenceId ||
      this.props.occurrenceId.trim().length === 0
    ) {
      throw new Error('occurrenceId is required to build a MediaEntity');
    }
    if (!this.props.storageKey || this.props.storageKey.trim().length === 0) {
      throw new Error('storageKey is required to build a MediaEntity');
    }
    if (!this.props.mimeType || this.props.mimeType.trim().length === 0) {
      throw new Error('mimeType is required to build a MediaEntity');
    }
    if (
      this.props.fileSizeBytes === undefined ||
      this.props.fileSizeBytes <= 0
    ) {
      throw new Error(
        'fileSizeBytes must be greater than 0 to build a MediaEntity',
      );
    }

    return new MediaEntity(this.props);
  }
}
