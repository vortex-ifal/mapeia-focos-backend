import { ApiProperty } from '@nestjs/swagger';
import { OccurrenceResponseDto } from './occurrence-response.dto';

export class AgentDashboardResponseDto {
  @ApiProperty({
    description: 'Total de ocorrências ativas atribuídas ao agente',
    example: 8,
  })
  totalAssigned: number;

  @ApiProperty({
    description: 'Total de ocorrências com prioridade ALTA',
    example: 3,
  })
  totalHighPriority: number;

  @ApiProperty({
    description:
      'Total de ocorrências que aguardam vistoria (status forwarded_for_inspection)',
    example: 2,
  })
  totalInspections: number;

  @ApiProperty({
    description:
      'Ocorrência mais urgente para destaque no dashboard. Ordenada por: prioridade (Alta > Média > Baixa) e depois por data de criação (mais antiga). Null se não houver ocorrências atribuídas.',
    type: OccurrenceResponseDto,
    nullable: true,
  })
  nextPriority: OccurrenceResponseDto | null;
}
