import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common';
import { OccurrencePriority, OccurrenceStatusKey } from '../../../entities';

export class FindAllOccurrencesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description:
      'Filtrar ocorrências por chave de status (ex.: registered para fila de triagem)',
    example: OccurrenceStatusKey.REGISTERED,
    enum: OccurrenceStatusKey,
  })
  @IsOptional()
  @IsEnum(OccurrenceStatusKey, {
    message: 'A chave de status informada é inválida',
  })
  statusKey?: OccurrenceStatusKey;

  @ApiPropertyOptional({
    description:
      'Filtrar ocorrências por nível de prioridade (low, medium ou high)',
    enum: OccurrencePriority,
    example: OccurrencePriority.HIGH,
  })
  @IsOptional()
  @IsEnum(OccurrencePriority, {
    message: 'O nível de prioridade informado é inválido',
  })
  priority?: OccurrencePriority;

  @ApiPropertyOptional({
    description:
      'Filtrar ocorrências por endereço (bairro ou logradouro) usando busca parcial',
    example: 'Centro',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'O endereço deve ser um texto válido' })
  @MaxLength(100, { message: 'O endereço deve ter no máximo 100 caracteres' })
  address?: string;
}
