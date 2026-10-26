import { ApiProperty } from '@nestjs/swagger';
import { CreatedResponseDto } from '../../common';

export class CreateOccurrenceResponseDto extends CreatedResponseDto {
  @ApiProperty({
    description: 'Código de protocolo alfanumérico único da ocorrência',
    example: 'a1b2c',
  })
  protocol: string;
}
