import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { InspectionResult } from '../../../entities';

export class CompleteInspectionDto {
  @ApiProperty({
    description: 'Condição encontrada no local durante a vistoria',
    example: 'Foco com água parada e larvas',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'A condição encontrada é obrigatória.' })
  @IsString({ message: 'A condição encontrada deve ser um texto válido.' })
  @MaxLength(100, {
    message: 'A condição encontrada deve ter no máximo 100 caracteres.',
  })
  condition: string;

  @ApiProperty({
    description: 'Descrição das ações realizadas pelo agente em campo',
    example: 'Eliminação mecânica dos criadouros e limpeza do quintal',
  })
  @IsNotEmpty({ message: 'As ações realizadas são obrigatórias.' })
  @IsString({ message: 'As ações realizadas devem ser um texto válido.' })
  actionsTaken: string;

  @ApiPropertyOptional({
    description: 'Observações adicionais relevantes sobre a vistoria',
    example: 'Morador orientado sobre vedação de reservatórios',
  })
  @IsOptional()
  @IsString({ message: 'As observações devem ser um texto válido.' })
  notes?: string;

  @ApiProperty({
    description: 'Desfecho final obtido na tentativa de vistoria',
    enum: InspectionResult,
    example: InspectionResult.FOCUS_ELIMINATED,
  })
  @IsNotEmpty({ message: 'O desfecho da vistoria é obrigatório.' })
  @IsEnum(InspectionResult, {
    message: `O desfecho da vistoria deve ser um dos valores válidos: ${Object.values(InspectionResult).join(', ')}`,
  })
  result: InspectionResult;
}
