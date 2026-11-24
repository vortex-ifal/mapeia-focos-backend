import { Injectable } from '@nestjs/common';
import {
  CompleteInspectionDto,
  InspectionResponseDto,
  SaveInspectionDraftDto,
} from '../dtos';
import {
  InspectionBuilder,
  InspectionEntity,
  InspectionResult,
  InspectionStatus,
} from '../entities';
import { InspectionInsert, InspectionSelect } from '../infra';

@Injectable()
export class InspectionMapper {
  toDomainFromDraftDto(
    occurrenceId: string,
    agentId: string,
    dto: SaveInspectionDraftDto,
  ): InspectionEntity {
    return InspectionBuilder.create()
      .withOccurrenceId(occurrenceId)
      .withAgentId(agentId)
      .withStatus(InspectionStatus.DRAFT)
      .withCondition(dto.condition ?? null)
      .withActionsTaken(dto.actionsTaken ?? null)
      .withNotes(dto.notes ?? null)
      .withResult(null)
      .build();
  }

  toDomainFromCompleteDto(
    occurrenceId: string,
    agentId: string,
    dto: CompleteInspectionDto,
  ): InspectionEntity {
    return InspectionBuilder.create()
      .withOccurrenceId(occurrenceId)
      .withAgentId(agentId)
      .withStatus(InspectionStatus.COMPLETED)
      .withCondition(dto.condition)
      .withActionsTaken(dto.actionsTaken)
      .withNotes(dto.notes ?? null)
      .withResult(dto.result)
      .build();
  }

  toDomainFromPersistence(row: InspectionSelect): InspectionEntity {
    const builder = InspectionBuilder.create()
      .withId(row.id)
      .withOccurrenceId(row.occurrenceId)
      .withAgentId(row.agentId)
      .withStatus(row.status as InspectionStatus)
      .withCondition(row.condition)
      .withActionsTaken(row.actionsTaken)
      .withNotes(row.notes)
      .withResult((row.result as InspectionResult | null) ?? null)
      .withInspectedAt(row.inspectedAt);

    return builder.build();
  }

  toPersistence(entity: InspectionEntity): InspectionInsert {
    return {
      ...(entity.id ? { id: entity.id } : {}),
      occurrenceId: entity.occurrenceId,
      agentId: entity.agentId,
      status: entity.status,
      condition: entity.condition,
      actionsTaken: entity.actionsTaken,
      notes: entity.notes,
      result: entity.result,
    };
  }

  toDto(entity: InspectionEntity): InspectionResponseDto {
    return {
      id: entity.id ?? '',
      occurrenceId: entity.occurrenceId,
      agentId: entity.agentId,
      status: entity.status,
      condition: entity.condition,
      actionsTaken: entity.actionsTaken,
      notes: entity.notes,
      result: entity.result,
      inspectedAt: entity.inspectedAt ?? new Date(),
    };
  }
}
