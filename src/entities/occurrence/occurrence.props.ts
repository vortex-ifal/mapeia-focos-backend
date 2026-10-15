export type OccurrenceStatus =
  | 'pending'
  | 'validated'
  | 'discarded'
  | 'assigned'
  | 'inspected'
  | 'resolved';

export interface OccurrenceProps {
  id?: string;
  address: string;
  description: string;
  situationType?: string | null;

  latitude?: number | null;
  longitude?: number | null;
  status?: OccurrenceStatus;
  isAnonymous?: boolean;
  reportedByUserId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
