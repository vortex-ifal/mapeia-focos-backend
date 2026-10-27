import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Número da página (base 1)',
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'A página deve ser um número inteiro' })
  @Min(1, { message: 'A página deve ser no mínimo 1' })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de registros por página',
    default: 50,
    minimum: 1,
    maximum: 100,
    example: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O tamanho da página deve ser um número inteiro' })
  @Min(1, { message: 'O tamanho da página deve ser no mínimo 1' })
  @Max(100, { message: 'O tamanho da página deve ser no máximo 100' })
  pageSize: number = 50;

  get skip(): number {
    return (this.page - 1) * this.pageSize;
  }
}
