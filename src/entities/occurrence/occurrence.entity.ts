import { OccurrenceStatusEntity } from '../occurrence-status';
import { OccurrenceProps } from './occurrence.props';

export class OccurrenceEntity {
  private readonly _id?: string;
  private readonly _address: string;
  private readonly _description: string;
  private readonly _situationType?: string | null;
  private readonly _latitude: number | null;
  private readonly _longitude: number | null;
  private _status?: OccurrenceStatusEntity;
  private readonly _isAnonymous: boolean;
  private readonly _reportedByUserId?: string | null;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  constructor(props: OccurrenceProps) {
    this._id = props.id;
    this._address = props.address;
    this._description = props.description;
    this._situationType = props.situationType ?? null;
    this._latitude = props.latitude ?? null;
    this._longitude = props.longitude ?? null;
    this._status = props.status;
    this._isAnonymous = props.isAnonymous ?? true;
    this._reportedByUserId = props.reportedByUserId ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): string | undefined {
    return this._id;
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

  get isAnonymous(): boolean {
    return this._isAnonymous;
  }

  get reportedByUserId(): string | null | undefined {
    return this._reportedByUserId;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
