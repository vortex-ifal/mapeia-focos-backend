import { ApiProperty } from '@nestjs/swagger';
import { MediaResponseDto } from '../../media';
import { AssignedAgentResponseDto } from './assigned-agent-response.dto';
import { OccurrenceResponseDto } from './occurrence-response.dto';

export class OccurrenceDetailResponseDto extends OccurrenceResponseDto {
  @ApiProperty({
    description:
      'Dados do agente responsável atualmente atribuído à ocorrência (se houver)',
    type: AssignedAgentResponseDto,
    nullable: true,
  })
  assignedAgent: AssignedAgentResponseDto | null;

  @ApiProperty({
    description:
      'Lista de mídias/evidências anexadas à ocorrência com URLs temporárias',
    type: [MediaResponseDto],
  })
  media: MediaResponseDto[];
}
