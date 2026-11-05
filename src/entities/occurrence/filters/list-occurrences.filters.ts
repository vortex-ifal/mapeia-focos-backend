import { OccurrenceStatusKey } from '../../occurrence-status';
import { OccurrencePriority } from '../occurrence-priority.enum';

export interface ListOccurrencesFilters {
  statusKey?: OccurrenceStatusKey;
  priority?: OccurrencePriority;
  address?: string;
}
