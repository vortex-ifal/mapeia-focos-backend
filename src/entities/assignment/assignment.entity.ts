import { AssignmentProps } from './assignment.props';

export class AssignmentEntity {
  private readonly _id?: string;
  private readonly _occurrenceId: string;
  private readonly _agentId: string;
  private readonly _assignedByManagerId: string;
  private readonly _notes: string | null;
  private readonly _assignedAt?: Date;

  constructor(props: AssignmentProps) {
    this._id = props.id;
    this._occurrenceId = props.occurrenceId;
    this._agentId = props.agentId;
    this._assignedByManagerId = props.assignedByManagerId;
    this._notes = props.notes ?? null;
    this._assignedAt = props.assignedAt;
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

  get assignedByManagerId(): string {
    return this._assignedByManagerId;
  }

  get notes(): string | null {
    return this._notes;
  }

  get assignedAt(): Date | undefined {
    return this._assignedAt;
  }
}
