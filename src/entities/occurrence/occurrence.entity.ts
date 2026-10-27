import { MediaEntity } from '../media';
import { OccurrenceStatusEntity } from '../occurrence-status';
import { OccurrenceProps } from './occurrence.props';

export class OccurrenceEntity {
  private readonly _id?: string;
  private _protocol?: string;
  private readonly _address: string;
  private readonly _description: string;
  private readonly _situationType?: string | null;
  private readonly _latitude: number | null;
  private readonly _longitude: number | null;
  private _status?: OccurrenceStatusEntity;
  private _userId: string;
  private _media?: MediaEntity[];
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  constructor(props: OccurrenceProps) {
    this._id = props.id;
    this._protocol = props.protocol;
    this._address = props.address;
    this._description = props.description;
    this._situationType = props.situationType ?? null;
    this._latitude = props.latitude ?? null;
    this._longitude = props.longitude ?? null;
    this._status = props.status;
    this._userId = props.userId;
    this._media = props.media ?? [];
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get protocol(): string | undefined {
    return this._protocol;
  }

  set protocol(protocol: string | undefined) {
    this._protocol = protocol;
  }

  get address(): string {
    return this._address;
  }

  get description(): string {
    return this._description;
  }

  get situationType(): string | null | undefined {
    return this._situationType;
  }

  get latitude(): number | null {
    return this._latitude;
  }

  get longitude(): number | null {
    return this._longitude;
  }

  get status(): OccurrenceStatusEntity | undefined {
    return this._status;
  }

  set status(status: OccurrenceStatusEntity | undefined) {
    this._status = status;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(userId: string) {
    this._userId = userId;
  }

  get media(): MediaEntity[] {
    return this._media ?? [];
  }

  set media(media: MediaEntity[] | undefined) {
    this._media = media;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
