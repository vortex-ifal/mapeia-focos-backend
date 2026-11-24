import { InspectionResult, InspectionStatus } from './inspection.enum';

export interface InspectionProps {
  id?: string;
  occurrenceId: string;
  agentId: string;
  status: InspectionStatus;
  condition?: string | null;
  actionsTaken?: string | null;
  notes?: string | null;
  result?: InspectionResult | null;
  inspectedAt?: Date;
}
