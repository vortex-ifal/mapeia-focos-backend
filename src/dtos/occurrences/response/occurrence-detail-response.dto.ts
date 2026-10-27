import { ApiProperty } from '@nestjs/swagger';
import { OccurrenceResponseDto } from './occurrence-response.dto';
import { OccurrenceMediaResponseDto } from './occurrence-media-response.dto';

export class OccurrenceDetailResponseDto extends OccurrenceResponseDto {
  @ApiProperty({
    description: 'Lista de mídias/evidências anexadas à ocorrência',
    type: [OccurrenceMediaResponseDto],
  })
  media: OccurrenceMediaResponseDto[];
}
