import { ApiProperty } from '@nestjs/swagger';
import { MediaResponseDto } from './media-response.dto';

export class AgentOccurrenceMediaResponseDto extends MediaResponseDto {
  @ApiProperty({
    description: 'Tipo MIME do arquivo de mídia',
    example: 'image/jpeg',
  })
  mimeType: string;

  @ApiProperty({
    description: 'Tamanho do arquivo em bytes',
    example: 1048576,
  })
  fileSizeBytes: number;
}
