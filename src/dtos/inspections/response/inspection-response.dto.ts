import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InspectionResult, InspectionStatus } from '../../../entities';

export class InspectionResponseDto {
  @ApiProperty({
    description: 'Identificador único da vistoria',
    example: '01a1478e-1c4a-7999-8001-d10ebf63fc10',
  })
  id: string;

  @ApiProperty({
    description: 'Identificador da ocorrência vistoriada',
    example: '01a1478e-1c4a-7999-8001-d10ebf63fc01',
  })
  occurrenceId: string;

  @ApiProperty({
    description: 'Identificador do agente responsável pela vistoria',
    example: '01a1427d-cf34-7f7d-9662-87d1921be41a',
  })
  agentId: string;

  @ApiProperty({
    description: 'Status atual da vistoria',
    enum: InspectionStatus,
    example: InspectionStatus.COMPLETED,
  })
  status: InspectionStatus;

  @ApiPropertyOptional({
    description: 'Condição encontrada no local durante a vistoria',
    example: 'Foco com água parada e larvas',
    nullable: true,
  })
  condition: string | null;

  @ApiPropertyOptional({
    description: 'Ações realizadas pelo agente em campo',
    example: 'Eliminação mecânica dos criadouros',
    nullable: true,
  })
  actionsTaken: string | null;

  @ApiPropertyOptional({
    description: 'Observações adicionais sobre a vistoria',
    example: 'Morador orientado sobre prevenção',
    nullable: true,
  })
  notes: string | null;

  @ApiPropertyOptional({
    description: 'Desfecho final da vistoria (preenchido ao concluir)',
    enum: InspectionResult,
    example: InspectionResult.FOCUS_ELIMINATED,
    nullable: true,
  })
  result: InspectionResult | null;

  @ApiProperty({
    description: 'Data e hora da primeira inserção da vistoria',
    example: '2026-11-24T17:15:00.000Z',
  })
  inspectedAt: Date;
}
