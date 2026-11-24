import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SaveInspectionDraftDto {
  @ApiPropertyOptional({
    description: 'Condição encontrada no local durante a vistoria',
    example: 'Água parada com presença de larvas',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'A condição encontrada deve ser um texto válido.' })
  @MaxLength(100, {
    message: 'A condição encontrada deve ter no máximo 100 caracteres.',
  })
  condition?: string;

  @ApiPropertyOptional({
    description: 'Descrição das ações realizadas pelo agente em campo',
    example: 'Remoção de recipientes plásticos e orientação ao morador',
  })
  @IsOptional()
  @IsString({ message: 'As ações realizadas devem ser um texto válido.' })
  actionsTaken?: string;

  @ApiPropertyOptional({
    description: 'Observações adicionais relevantes sobre a vistoria',
    example: 'Imóvel com caixa d’água destampada nos fundos',
  })
  @IsOptional()
  @IsString({ message: 'As observações devem ser um texto válido.' })
  notes?: string;
}
