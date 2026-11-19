import { OccurrenceHistoryEntity } from './occurrence-history.entity';
import { OccurrenceHistoryProps } from './occurrence-history.props';

export class OccurrenceHistoryBuilder {
  private props: OccurrenceHistoryProps;

  constructor() {
    this.props = {
      occurrenceId: '',
      eventId: '',
    };
  }

  static create(): OccurrenceHistoryBuilder {
    return new OccurrenceHistoryBuilder();
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withOccurrenceId(occurrenceId: string): this {
    this.props.occurrenceId = occurrenceId;
    return this;
  }

  withEventId(eventId: string): this {
    this.props.eventId = eventId;
    return this;
  }

  withUserId(userId?: string | null): this {
    this.props.userId = userId;
    return this;
  }

  withCreatedAt(createdAt: Date): this {
    this.props.createdAt = createdAt;
    return this;
  }

  build(): OccurrenceHistoryEntity {
    if (
      !this.props.occurrenceId ||
      this.props.occurrenceId.trim().length === 0
    ) {
      throw new Error(
        'OccurrenceId is required to build an OccurrenceHistoryEntity',
      );
    }
    if (!this.props.eventId || this.props.eventId.trim().length === 0) {
      throw new Error('EventId is required to build an OccurrenceHistoryEntity');
    }

    return new OccurrenceHistoryEntity(this.props);
  }
}
