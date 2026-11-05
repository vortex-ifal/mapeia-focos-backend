import { AssignmentEntity } from './assignment.entity';
import { AssignmentProps } from './assignment.props';

export class AssignmentBuilder {
  private props: AssignmentProps;

  constructor() {
    this.props = {
      occurrenceId: '',
      agentId: '',
      assignedByManagerId: '',
    };
  }

  static create(): AssignmentBuilder {
    return new AssignmentBuilder();
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withOccurrenceId(occurrenceId: string): this {
    this.props.occurrenceId = occurrenceId;
    return this;
  }

  withAgentId(agentId: string): this {
    this.props.agentId = agentId;
    return this;
  }

  withAssignedByManagerId(assignedByManagerId: string): this {
    this.props.assignedByManagerId = assignedByManagerId;
    return this;
  }

  withNotes(notes?: string | null): this {
    this.props.notes = notes;
    return this;
  }

  withAssignedAt(assignedAt: Date): this {
    this.props.assignedAt = assignedAt;
    return this;
  }

  build(): AssignmentEntity {
    if (
      !this.props.occurrenceId ||
      this.props.occurrenceId.trim().length === 0
    ) {
      throw new Error('OccurrenceId is required to build an AssignmentEntity');
    }
    if (!this.props.agentId || this.props.agentId.trim().length === 0) {
      throw new Error('AgentId is required to build an AssignmentEntity');
    }
    if (
      !this.props.assignedByManagerId ||
      this.props.assignedByManagerId.trim().length === 0
    ) {
      throw new Error(
        'AssignedByManagerId is required to build an AssignmentEntity',
      );
    }

    return new AssignmentEntity(this.props);
  }
}
