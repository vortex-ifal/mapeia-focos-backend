import { ApiProperty } from '@nestjs/swagger';

export class OccurrenceStatusSummaryDto {
  @ApiProperty({ example: 'registered' })
  key: string;

  @ApiProperty({ example: 'Registrada' })
  name: string;
}

export class TriageQueueItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    description: 'Endereço simplificado',
    example: 'Rua das Flores, 123',
  })
  address: string;

  @ApiProperty({ nullable: true, example: -9.6659 })
  latitude: number | null;

  @ApiProperty({ nullable: true, example: -35.735 })
  longitude: number | null;

  @ApiProperty({ description: 'Data de criação (ISO 8601)' })
  createdAt: string;

  @ApiProperty({ description: 'Minutos desde a criação', example: 125 })
  waitingMinutes: number;

  @ApiProperty({ type: OccurrenceStatusSummaryDto })
  status: OccurrenceStatusSummaryDto;
}

export class TriageQueueResponseDto {
  @ApiProperty({ type: [TriageQueueItemDto] })
  items: TriageQueueItemDto[];

  @ApiProperty({ description: 'Total de ocorrências aguardando triagem' })
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}
