import { ApiProperty } from '@nestjs/swagger';
import { MediaResponseDto } from '../../media';
import { OccurrenceResponseDto } from './occurrence-response.dto';

export class OccurrenceDetailResponseDto extends OccurrenceResponseDto {
  @ApiProperty({
    description: 'Lista de mídias/evidências anexadas à ocorrência',
    type: [MediaResponseDto],
  })
  media: MediaResponseDto[];
}
