import { NearbyOccurrenceProps } from './nearby-occurrence.props';

export class NearbyOccurrenceEntity {
  constructor(private readonly props: NearbyOccurrenceProps) {}

  get id(): string {
    return this.props.id;
  }

  get latitude(): number {
    return this.props.latitude;
  }

  get longitude(): number {
    return this.props.longitude;
  }

  get statusKey(): string {
    return this.props.statusKey;
  }

  get statusName(): string {
    return this.props.statusName;
  }

  get distanceMeters(): number {
    return this.props.distanceMeters;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
