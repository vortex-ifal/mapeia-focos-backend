import { Injectable } from '@nestjs/common';
import { type AgentDashboardReadModel } from '../entities';
import { AgentDashboardResponseDto, OccurrenceResponseDto } from '../dtos';
import { OccurrenceMapper } from './occurrence.mapper';

@Injectable()
export class AgentDashboardMapper {
  constructor(private readonly occurrenceMapper: OccurrenceMapper) {}

  toDto(readModel: AgentDashboardReadModel): AgentDashboardResponseDto {
    const nextPriority: OccurrenceResponseDto | null = readModel.nextPriority
      ? this.occurrenceMapper.toDto(readModel.nextPriority)
      : null;

    return {
      totalAssigned: readModel.totalAssigned,
      totalHighPriority: readModel.totalHighPriority,
      totalInspections: readModel.totalInspections,
      nextPriority,
    };
  }
}
