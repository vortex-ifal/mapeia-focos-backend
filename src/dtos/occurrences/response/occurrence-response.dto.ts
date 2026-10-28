import { ApiProperty } from '@nestjs/swagger';
import { OccurrencePriority } from '../../../entities';
import { OccurrenceStatusResponseDto } from './occurrence-status-response.dto';

export class OccurrenceResponseDto {
  @ApiProperty({
    description: 'Identificador único da ocorrência (UUID)',
    example: '3c2423c7-d51f-486b-9fc3-7c0ea3c7b683',
  })
  id: string;

  @ApiProperty({
    description: 'Código de protocolo alfanumérico único da ocorrência',
    example: 'lon91',
  })
  protocol: string;

  @ApiProperty({
    description: 'Endereço descritivo ou logradouro da ocorrência',
    example: 'Deputado Nezinho, Senador Arnon de Melo, Arapiraca',
  })
  address: string;

  @ApiProperty({
    description: 'Descrição detalhada informada pelo cidadão',
    example: 'Recipientes com água parada encontrados no local.',
  })
  description: string;

  @ApiProperty({
    description: 'Tipo de situação do local (ex.: recipientes com água parada)',
    nullable: true,
    example: 'Recipientes com água parada',
  })
  situationType: string | null;

  @ApiProperty({
    description: 'Latitude geográfica da ocorrência',
    nullable: true,
    example: -9.751234,
  })
  latitude: number | null;

  @ApiProperty({
    description: 'Longitude geográfica da ocorrência',
    nullable: true,
    example: -36.661234,
  })
  longitude: number | null;

  @ApiProperty({
    description: 'Data de criação da ocorrência em formato ISO 8601',
    example: '2026-10-27T15:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização da ocorrência em formato ISO 8601',
    example: '2026-10-27T15:35:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Status atual da ocorrência',
    type: OccurrenceStatusResponseDto,
  })
  status: OccurrenceStatusResponseDto;

  @ApiProperty({
    description: 'Nível de prioridade da ocorrência',
    enum: OccurrencePriority,
    nullable: true,
    example: OccurrencePriority.HIGH,
  })
  priority: OccurrencePriority | null;
}
