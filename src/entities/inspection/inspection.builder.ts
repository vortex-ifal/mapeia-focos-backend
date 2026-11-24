import { InspectionEntity } from './inspection.entity';
import { InspectionResult, InspectionStatus } from './inspection.enum';
import { InspectionProps } from './inspection.props';

/**
 * Builder responsável por instanciar e validar invariantes de InspectionEntity.
 */
export class InspectionBuilder {
  private props: InspectionProps;

  constructor() {
    this.props = {
      occurrenceId: '',
      agentId: '',
      status: InspectionStatus.DRAFT,
    };
  }

  static create(): InspectionBuilder {
    return new InspectionBuilder();
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

  withStatus(status: InspectionStatus): this {
    this.props.status = status;
    return this;
  }

  withCondition(condition?: string | null): this {
    this.props.condition = condition;
    return this;
  }

  withActionsTaken(actionsTaken?: string | null): this {
    this.props.actionsTaken = actionsTaken;
    return this;
  }

  withNotes(notes?: string | null): this {
    this.props.notes = notes;
    return this;
  }

  withResult(result?: InspectionResult | null): this {
    this.props.result = result;
    return this;
  }

  withInspectedAt(inspectedAt: Date): this {
    this.props.inspectedAt = inspectedAt;
    return this;
  }

  build(): InspectionEntity {
    if (
      !this.props.occurrenceId ||
      this.props.occurrenceId.trim().length === 0
    ) {
      throw new Error('OccurrenceId is required to build an InspectionEntity');
    }
    if (!this.props.agentId || this.props.agentId.trim().length === 0) {
      throw new Error('AgentId is required to build an InspectionEntity');
    }
    if (!this.props.status) {
      throw new Error('Status is required to build an InspectionEntity');
    }

    if (this.props.status === InspectionStatus.COMPLETED) {
      if (!this.props.condition || this.props.condition.trim().length === 0) {
        throw new Error(
          'Condition is required to build a completed InspectionEntity',
        );
      }
      if (
        !this.props.actionsTaken ||
        this.props.actionsTaken.trim().length === 0
      ) {
        throw new Error(
          'ActionsTaken is required to build a completed InspectionEntity',
        );
      }
      if (!this.props.result) {
        throw new Error(
          'Result is required to build a completed InspectionEntity',
        );
      }
    }

    return new InspectionEntity(this.props);
  }
}
