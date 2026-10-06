import { OccurrenceEntity } from './occurrence.entity';
import { OccurrenceProps, OccurrenceStatus } from './occurrence.props';

export class OccurrenceBuilder {
  private props: OccurrenceProps;

  constructor() {
    this.props = {
      address: '',
      description: '',
      status: 'pending',
      isAnonymous: true,
    };
  }

  static create(): OccurrenceBuilder {
    return new OccurrenceBuilder();
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withAddress(address: string): this {
    this.props.address = address;
    return this;
  }

  withDescription(description: string): this {
    this.props.description = description;
    return this;
  }

  withSituationType(situationType?: string | null): this {
    this.props.situationType = situationType;
    return this;
  }

  withContact(contact?: string | null): this {
    this.props.contact = contact;
    return this;
  }

  withStatus(status: OccurrenceStatus): this {
    this.props.status = status;
    return this;
  }

  withIsAnonymous(isAnonymous: boolean): this {
    this.props.isAnonymous = isAnonymous;
    return this;
  }

  withReportedByUserId(reportedByUserId?: string | null): this {
    this.props.reportedByUserId = reportedByUserId;
    return this;
  }

  withCreatedAt(createdAt: Date): this {
    this.props.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): this {
    this.props.updatedAt = updatedAt;
    return this;
  }

  build(): OccurrenceEntity {
    if (!this.props.address || this.props.address.trim().length === 0) {
      throw new Error('Address is required to build an OccurrenceEntity');
    }
    if (!this.props.description || this.props.description.trim().length === 0) {
      throw new Error('Description is required to build an OccurrenceEntity');
    }

    // Invariante de negócio: se for anônimo, não deve ter reportedByUserId
    if (this.props.isAnonymous) {
      this.props.reportedByUserId = null;
    }

    return new OccurrenceEntity(this.props);
  }
}
