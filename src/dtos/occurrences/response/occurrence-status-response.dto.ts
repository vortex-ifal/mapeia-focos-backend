import { ApiProperty } from '@nestjs/swagger';

export class OccurrenceStatusResponseDto {
  @ApiProperty({
    example: 'a1b2c',
    description: 'Código de protocolo alfanumérico único de 5 caracteres em minúsculo',
  })
  protocol!: string;

  @ApiProperty({
    example: 'registered',
    description: 'Chave técnica do status da ocorrência',
  })
  statusKey!: string;

  @ApiProperty({
    example: 'Registrada',
    description: 'Nome descritivo do status da ocorrência',
  })
  statusName!: string;
}
