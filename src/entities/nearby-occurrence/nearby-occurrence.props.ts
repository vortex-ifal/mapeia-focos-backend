export interface NearbyOccurrenceProps {
  id: string;
  latitude: number;
  longitude: number;
  statusKey: string;
  statusName: string;
  distanceMeters: number;
  createdAt: Date;
}
