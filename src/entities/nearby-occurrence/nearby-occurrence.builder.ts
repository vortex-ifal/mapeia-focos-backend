import { NearbyOccurrenceEntity } from './nearby-occurrence.entity';
import { NearbyOccurrenceProps } from './nearby-occurrence.props';

export class NearbyOccurrenceBuilder {
  private props: Partial<NearbyOccurrenceProps> = {};

  static create(): NearbyOccurrenceBuilder {
    return new NearbyOccurrenceBuilder();
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withCoordinates(latitude: number, longitude: number): this {
    this.props.latitude = latitude;
    this.props.longitude = longitude;
    return this;
  }

  withStatus(key: string, name: string): this {
    this.props.statusKey = key;
    this.props.statusName = name;
    return this;
  }

  withDistanceMeters(distanceMeters: number): this {
    this.props.distanceMeters = distanceMeters;
    return this;
  }

  withCreatedAt(createdAt: Date): this {
    this.props.createdAt = createdAt;
    return this;
  }

  build(): NearbyOccurrenceEntity {
    const {
      id,
      latitude,
      longitude,
      statusKey,
      statusName,
      distanceMeters,
      createdAt,
    } = this.props;

    if (!id) {
      throw new Error('Id is required to build a NearbyOccurrenceEntity');
    }
    if (latitude === undefined || longitude === undefined) {
      throw new Error(
        'Coordinates are required to build a NearbyOccurrenceEntity',
      );
    }
    if (distanceMeters === undefined || distanceMeters < 0) {
      throw new Error(
        'A valid distance is required to build a NearbyOccurrenceEntity',
      );
    }
    if (!statusKey || statusName === undefined || !createdAt) {
      throw new Error(
        'Status and createdAt are required to build a NearbyOccurrenceEntity',
      );
    }

    return new NearbyOccurrenceEntity({
      id,
      latitude,
      longitude,
      statusKey,
      statusName,
      distanceMeters,
      createdAt,
    });
  }
}
