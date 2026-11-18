import { OccurrenceHistoryProps } from './occurrence-history.props';

export class OccurrenceHistoryEntity {
  private readonly _id?: string;
  private readonly _occurrenceId: string;
  private readonly _eventId: string;
  private readonly _userId: string | null;
  private readonly _createdAt?: Date;

  constructor(props: OccurrenceHistoryProps) {
    this._id = props.id;
    this._occurrenceId = props.occurrenceId;
    this._eventId = props.eventId;
    this._userId = props.userId ?? null;
    this._createdAt = props.createdAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get occurrenceId(): string {
    return this._occurrenceId;
  }

  get eventId(): string {
    return this._eventId;
  }

  get userId(): string | null {
    return this._userId;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }
}
