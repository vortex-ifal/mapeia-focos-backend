import { OccurrenceEntity } from '../occurrence.entity';

export interface AgentDashboardReadModel {
  totalAssigned: number;
  totalHighPriority: number;
  totalInspections: number;
  nextPriority: OccurrenceEntity | null;
}
