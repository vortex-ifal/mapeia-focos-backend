import { OccurrenceEventKey } from './occurrence-event.enum';
import { OccurrenceEventProps } from './occurrence-event.props';

export class OccurrenceEventEntity {
  private readonly _id?: string;
  private readonly _key: OccurrenceEventKey;
  private readonly _description: string;

  constructor(props: OccurrenceEventProps) {
    this._id = props.id;
    this._key = props.key;
    this._description = props.description;
  }

  get id(): string | undefined {
    return this._id;
  }

  get key(): OccurrenceEventKey {
    return this._key;
  }

  get description(): string {
    return this._description;
  }
}
