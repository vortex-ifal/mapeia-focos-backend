import { OccurrenceMediaReadModel } from './occurrence-media.read-model';

export interface OccurrenceDetailsReadModel {
  id: string;
  protocol: string;
  address: string;
  description: string;
  situationType: string | null;
  latitude: number | null;
  longitude: number | null;
  status: {
    key: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  media: OccurrenceMediaReadModel[];
}
