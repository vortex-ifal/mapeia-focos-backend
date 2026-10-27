import { ApiProperty } from '@nestjs/swagger';

export class OccurrenceStatusSummaryDto {
  @ApiProperty({
    description: 'Chave identificadora do status',
    example: 'registered',
  })
  key: string;

  @ApiProperty({
    description: 'Nome legível do status',
    example: 'Registrada',
  })
  name: string;
}

export class OccurrenceListItemResponseDto {
  @ApiProperty({ description: 'Identificador único da ocorrência' })
  id: string;

  @ApiProperty({
    description: 'Código de protocolo alfanumérico único da ocorrência',
    example: 'a1b2c',
  })
  protocol: string;

  @ApiProperty({
    description: 'Endereço simplificado da ocorrência',
    example: 'Rua das Flores, 123',
  })
  address: string;

  @ApiProperty({ nullable: true, example: -9.6659 })
  latitude: number | null;

  @ApiProperty({ nullable: true, example: -35.735 })
  longitude: number | null;

  @ApiProperty({ description: 'Data de criação em formato ISO 8601' })
  createdAt: string;

  @ApiProperty({
    description: 'Tempo decorrido em minutos desde a criação da ocorrência',
    example: 125,
  })
  waitingMinutes: number;

  @ApiProperty({ type: OccurrenceStatusSummaryDto })
  status: OccurrenceStatusSummaryDto;
}
