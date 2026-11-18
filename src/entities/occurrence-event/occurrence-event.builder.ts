import { OccurrenceEventEntity } from './occurrence-event.entity';
import { OccurrenceEventKey } from './occurrence-event.enum';
import { OccurrenceEventProps } from './occurrence-event.props';

export class OccurrenceEventBuilder {
  private props: OccurrenceEventProps;

  constructor() {
    this.props = {
      key: '' as OccurrenceEventKey,
      description: '',
    };
  }

  static create(): OccurrenceEventBuilder {
    return new OccurrenceEventBuilder();
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withKey(key: OccurrenceEventKey): this {
    this.props.key = key;
    return this;
  }

  withDescription(description: string): this {
    this.props.description = description;
    return this;
  }

  build(): OccurrenceEventEntity {
    if (!this.props.key || this.props.key.trim().length === 0) {
      throw new Error('Key is required to build an OccurrenceEventEntity');
    }
    if (!this.props.description || this.props.description.trim().length === 0) {
      throw new Error(
        'Description is required to build an OccurrenceEventEntity',
      );
    }

    return new OccurrenceEventEntity(this.props);
  }
}
