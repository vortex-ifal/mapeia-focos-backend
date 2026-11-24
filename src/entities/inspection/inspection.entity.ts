import { InspectionResult, InspectionStatus } from './inspection.enum';
import { InspectionProps } from './inspection.props';

/**
 * Entidade de domínio que representa uma vistoria em campo associada a uma ocorrência.
 */
export class InspectionEntity {
  private readonly _id?: string;
  private readonly _occurrenceId: string;
  private readonly _agentId: string;
  private readonly _status: InspectionStatus;
  private readonly _condition: string | null;
  private readonly _actionsTaken: string | null;
  private readonly _notes: string | null;
  private readonly _result: InspectionResult | null;
  private readonly _inspectedAt?: Date;

  constructor(props: InspectionProps) {
    this._id = props.id;
    this._occurrenceId = props.occurrenceId;
    this._agentId = props.agentId;
    this._status = props.status;
    this._condition = props.condition ?? null;
    this._actionsTaken = props.actionsTaken ?? null;
    this._notes = props.notes ?? null;
    this._result = props.result ?? null;
    this._inspectedAt = props.inspectedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get occurrenceId(): string {
    return this._occurrenceId;
  }

  get agentId(): string {
    return this._agentId;
  }

  get status(): InspectionStatus {
    return this._status;
  }

  get condition(): string | null {
    return this._condition;
  }

  get actionsTaken(): string | null {
    return this._actionsTaken;
  }

  get notes(): string | null {
    return this._notes;
  }

  get result(): InspectionResult | null {
    return this._result;
  }

  get inspectedAt(): Date | undefined {
    return this._inspectedAt;
  }

  isDraft(): boolean {
    return this._status === InspectionStatus.DRAFT;
  }

  isCompleted(): boolean {
    return this._status === InspectionStatus.COMPLETED;
  }

  shouldResolveOccurrence(): boolean {
    return (
      this._status === InspectionStatus.COMPLETED &&
      this._result === InspectionResult.FOCUS_ELIMINATED
    );
  }
}
