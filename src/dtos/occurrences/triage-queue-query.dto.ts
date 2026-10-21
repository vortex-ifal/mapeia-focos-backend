import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  TRIAGE_QUEUE_DEFAULT_LIMIT,
  TRIAGE_QUEUE_MAX_LIMIT,
} from '../../constants';

export class TriageQueueQueryDto {
  @ApiPropertyOptional({
    description: 'Quantidade máxima de itens na página',
    default: TRIAGE_QUEUE_DEFAULT_LIMIT,
    minimum: 1,
    maximum: TRIAGE_QUEUE_MAX_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limite deve ser um número inteiro' })
  @Min(1, { message: 'O limite deve ser no mínimo 1' })
  @Max(TRIAGE_QUEUE_MAX_LIMIT, {
    message: `O limite deve ser no máximo ${TRIAGE_QUEUE_MAX_LIMIT}`,
  })
  limit: number = TRIAGE_QUEUE_DEFAULT_LIMIT;

  @ApiPropertyOptional({
    description: 'Quantidade de itens a pular',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O offset deve ser um número inteiro' })
  @Min(0, { message: 'O offset deve ser no mínimo 0' })
  offset: number = 0;
}
