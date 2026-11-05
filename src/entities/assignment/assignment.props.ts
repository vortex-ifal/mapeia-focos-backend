export interface AssignmentProps {
  id?: string;
  occurrenceId: string;
  agentId: string;
  assignedByManagerId: string;
  notes?: string | null;
  assignedAt?: Date;
}
