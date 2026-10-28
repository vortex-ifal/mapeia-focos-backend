import { MediaEntity } from '../media';
import { OccurrenceStatusEntity } from '../occurrence-status';
import { OccurrencePriority } from './occurrence-priority.enum';

export interface OccurrenceProps {
  id?: string;
  protocol?: string;
  address: string;
  description: string;
  situationType?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: OccurrenceStatusEntity;
  priority?: OccurrencePriority | null;
  userId: string;
  media?: MediaEntity[];
  createdAt?: Date;
  updatedAt?: Date;
}
