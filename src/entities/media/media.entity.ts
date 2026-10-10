import { MediaProps, MediaType } from './media.props';

export class MediaEntity {
  private readonly _id?: string;
  private readonly _occurrenceId: string;
  private readonly _storageKey: string;
  private readonly _mimeType: string;
  private readonly _fileSizeBytes: number;
  private readonly _type: MediaType;
  private readonly _isPublic: boolean;
  private readonly _uploadedAt?: Date;

  constructor(props: MediaProps) {
    this._id = props.id;
    this._occurrenceId = props.occurrenceId;
    this._storageKey = props.storageKey;
    this._mimeType = props.mimeType;
    this._fileSizeBytes = props.fileSizeBytes;
    this._type = props.type ?? 'photo';
    this._isPublic = false; // Invariante de negócio RN03: mídias de ocorrência nunca são públicas
    this._uploadedAt = props.uploadedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get occurrenceId(): string {
    return this._occurrenceId;
  }

  get storageKey(): string {
    return this._storageKey;
  }

  get mimeType(): string {
    return this._mimeType;
  }

  get fileSizeBytes(): number {
    return this._fileSizeBytes;
  }

  get type(): MediaType {
    return this._type;
  }

  get isPublic(): boolean {
    return this._isPublic;
  }

  get uploadedAt(): Date | undefined {
    return this._uploadedAt;
  }
}
