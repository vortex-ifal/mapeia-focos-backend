import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  TERRITORIAL_DEFAULT_LIMIT,
  TERRITORIAL_DEFAULT_RADIUS_METERS,
  TERRITORIAL_MAX_LIMIT,
  TERRITORIAL_MAX_RADIUS_METERS,
  TERRITORIAL_MIN_LIMIT,
  TERRITORIAL_MIN_RADIUS_METERS,
} from '../../../constants';

export class TerritorialContextQueryDto {
  @ApiPropertyOptional({
    description: 'Raio de busca em metros',
    default: TERRITORIAL_DEFAULT_RADIUS_METERS,
    minimum: TERRITORIAL_MIN_RADIUS_METERS,
    maximum: TERRITORIAL_MAX_RADIUS_METERS,
    example: 500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O raio deve ser um número inteiro em metros' })
  @Min(TERRITORIAL_MIN_RADIUS_METERS, {
    message: `O raio deve ser no mínimo ${TERRITORIAL_MIN_RADIUS_METERS} metros`,
  })
  @Max(TERRITORIAL_MAX_RADIUS_METERS, {
    message: `O raio deve ser no máximo ${TERRITORIAL_MAX_RADIUS_METERS} metros`,
  })
  radius: number = TERRITORIAL_DEFAULT_RADIUS_METERS;

  @ApiPropertyOptional({
    description: 'Quantidade máxima de ocorrências próximas a retornar',
    default: TERRITORIAL_DEFAULT_LIMIT,
    minimum: TERRITORIAL_MIN_LIMIT,
    maximum: TERRITORIAL_MAX_LIMIT,
    example: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limite deve ser um número inteiro' })
  @Min(TERRITORIAL_MIN_LIMIT, {
    message: `O limite deve ser no mínimo ${TERRITORIAL_MIN_LIMIT}`,
  })
  @Max(TERRITORIAL_MAX_LIMIT, {
    message: `O limite deve ser no máximo ${TERRITORIAL_MAX_LIMIT}`,
  })
  limit: number = TERRITORIAL_DEFAULT_LIMIT;
}
