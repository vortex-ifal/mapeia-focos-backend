import { Injectable } from '@nestjs/common';
import type { AgentAvailabilityReadModel } from '../entities';
import { AgentAvailabilityResponseDto } from '../dtos';

@Injectable()
export class AgentAvailabilityMapper {
  toDto(
    readModel: AgentAvailabilityReadModel,
  ): AgentAvailabilityResponseDto {
    return {
      agentId: readModel.agentId,
      name: readModel.name,
      sectorRegion: readModel.sectorRegion,
      totalActiveTasks: readModel.totalActiveTasks,
    };
  }
}
