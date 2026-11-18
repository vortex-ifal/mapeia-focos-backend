export interface OccurrenceHistoryProps {
  id?: string;
  occurrenceId: string;
  eventId: string;
  userId?: string | null;
  createdAt?: Date;
}
