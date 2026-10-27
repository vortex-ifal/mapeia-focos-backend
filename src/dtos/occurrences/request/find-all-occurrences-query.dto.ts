import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common';
import { OccurrenceStatusKey } from '../../../entities';

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
}
