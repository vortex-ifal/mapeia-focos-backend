import { OccurrenceStatusEntity } from '../occurrence-status';

export interface OccurrenceProps {
  id?: string;
  address: string;
  description: string;
  situationType?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: OccurrenceStatusEntity;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

