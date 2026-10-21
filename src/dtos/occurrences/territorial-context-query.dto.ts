import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  TERRITORIAL_DEFAULT_RADIUS_METERS,
  TERRITORIAL_MAX_RADIUS_METERS,
  TERRITORIAL_MIN_RADIUS_METERS,
} from '../../constants';

export class TerritorialContextQueryDto {
  @ApiPropertyOptional({
    description: 'Raio de busca em metros',
    default: TERRITORIAL_DEFAULT_RADIUS_METERS,
    minimum: TERRITORIAL_MIN_RADIUS_METERS,
    maximum: TERRITORIAL_MAX_RADIUS_METERS,
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
}
