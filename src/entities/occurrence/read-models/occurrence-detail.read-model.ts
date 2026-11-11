import { OccurrenceEntity } from '../occurrence.entity';
import { AssignedAgentReadModel } from './assigned-agent.read-model';

export interface OccurrenceDetailReadModel {
  occurrence: OccurrenceEntity;
  assignedAgent: AssignedAgentReadModel | null;
}
