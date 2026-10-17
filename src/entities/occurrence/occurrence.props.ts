import { OccurrenceStatusEntity } from '../occurrence-status';

export interface OccurrenceProps {
  id?: string;
  address: string;
  description: string;
  situationType?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: OccurrenceStatusEntity;
  isAnonymous?: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

