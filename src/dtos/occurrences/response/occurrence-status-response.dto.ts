import { ApiProperty } from '@nestjs/swagger';

export class OccurrenceStatusResponseDto {
  @ApiProperty({
    description: 'Chave identificadora do status da ocorrência',
    example: 'registered',
  })
  key: string;

  @ApiProperty({
    description: 'Nome legível do status da ocorrência',
    example: 'Registrada',
  })
  name: string;
}
