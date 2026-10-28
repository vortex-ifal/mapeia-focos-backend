import { MediaEntity } from '../media';
import { OccurrenceStatusEntity } from '../occurrence-status';
import { OccurrencePriority } from './occurrence-priority.enum';
import { OccurrenceEntity } from './occurrence.entity';
import { OccurrenceProps } from './occurrence.props';

export class OccurrenceBuilder {
  private props: OccurrenceProps;

  constructor() {
    this.props = {
      address: '',
      description: '',
      latitude: null,
      longitude: null,
      userId: '',
    };
  }

  static create(): OccurrenceBuilder {
    return new OccurrenceBuilder();
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withProtocol(protocol?: string): this {
    this.props.protocol = protocol;
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

  withCoordinates(latitude?: number | null, longitude?: number | null): this {
    this.props.latitude = latitude;
    this.props.longitude = longitude;
    return this;
  }

  withStatus(status: OccurrenceStatusEntity): this {
    this.props.status = status;
    return this;
  }

  withPriority(priority?: OccurrencePriority | null): this {
    this.props.priority = priority;
    return this;
  }

  withMedia(media?: MediaEntity[]): this {
    this.props.media = media;
    return this;
  }

  withUserId(userId: string): this {
    this.props.userId = userId;
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
    if (!this.props.userId || this.props.userId.trim().length === 0) {
      throw new Error('UserId is required to build an OccurrenceEntity');
    }

    const { latitude, longitude } = this.props;

    if (latitude != null && longitude == null) {
      throw new Error('Longitude is required when latitude is provided');
    }
    if (longitude != null && latitude == null) {
      throw new Error('Latitude is required when longitude is provided');
    }
    if (latitude != null && (latitude < -90 || latitude > 90)) {
      throw new Error('Latitude must be between -90 and 90');
    }
    if (longitude != null && (longitude < -180 || longitude > 180)) {
      throw new Error('Longitude must be between -180 and 180');
    }

    return new OccurrenceEntity(this.props);
  }
}
