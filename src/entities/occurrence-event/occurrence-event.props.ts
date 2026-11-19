import { OccurrenceEventKey } from './occurrence-event.enum';

export interface OccurrenceEventProps {
  id?: string;
  key: OccurrenceEventKey;
  description: string;
}
