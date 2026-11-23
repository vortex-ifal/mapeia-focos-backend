import { ApiProperty } from '@nestjs/swagger';
import { AgentOccurrenceMediaResponseDto } from '../../media';
import { OccurrenceResponseDto } from './occurrence-response.dto';

export class AgentOccurrenceDetailResponseDto extends OccurrenceResponseDto {
  @ApiProperty({
    description:
      'Lista de mídias da ocorrência com URLs temporárias e metadados seguros',
    type: [AgentOccurrenceMediaResponseDto],
  })
  media: AgentOccurrenceMediaResponseDto[];
}
