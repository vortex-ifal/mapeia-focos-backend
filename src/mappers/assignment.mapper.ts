import { Injectable } from '@nestjs/common';
import { AssignmentBuilder, AssignmentEntity } from '../entities';
import { AssignmentInsert, AssignmentSelect } from '../infra';

@Injectable()
export class AssignmentMapper {
  toPersistence(entity: AssignmentEntity): AssignmentInsert {
    return {
      ...(entity.id ? { id: entity.id } : {}),
      occurrenceId: entity.occurrenceId,
      agentId: entity.agentId,
      assignedByManagerId: entity.assignedByManagerId,
      notes: entity.notes ?? null,
    };
  }

  toDomainFromPersistence(row: AssignmentSelect): AssignmentEntity {
    return AssignmentBuilder.create()
      .withId(row.id)
      .withOccurrenceId(row.occurrenceId)
      .withAgentId(row.agentId)
      .withAssignedByManagerId(row.assignedByManagerId)
      .withNotes(row.notes)
      .withAssignedAt(row.assignedAt)
      .build();
  }
}
