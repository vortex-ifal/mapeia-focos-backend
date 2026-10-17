import { OccurrenceStatusProps } from './occurrence-status.props';

export class OccurrenceStatusEntity {
  private readonly _id?: string;
  private readonly _name: string;
  private readonly _key: string;

  constructor(props: OccurrenceStatusProps) {
    this._id = props.id;
    this._name = props.name;
    this._key = props.key;
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get key(): string {
    return this._key;
  }
}
