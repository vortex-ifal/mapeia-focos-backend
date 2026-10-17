import { OccurrenceStatusEntity } from './occurrence-status.entity';
import { OccurrenceStatusProps } from './occurrence-status.props';

export class OccurrenceStatusBuilder {
  private props: OccurrenceStatusProps;

  constructor() {
    this.props = {
      name: '',
      key: '',
    };
  }

  static create(): OccurrenceStatusBuilder {
    return new OccurrenceStatusBuilder();
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withName(name: string): this {
    this.props.name = name;
    return this;
  }

  withKey(key: string): this {
    this.props.key = key;
    return this;
  }

  build(): OccurrenceStatusEntity {
    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new Error('Name is required to build an OccurrenceStatusEntity');
    }
    if (!this.props.key || this.props.key.trim().length === 0) {
      throw new Error('Key is required to build an OccurrenceStatusEntity');
    }

    return new OccurrenceStatusEntity(this.props);
  }
}
