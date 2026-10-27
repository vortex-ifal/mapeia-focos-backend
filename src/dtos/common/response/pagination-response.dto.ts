import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty({ description: 'Página atual (base 1)', example: 1 })
  page: number;

  @ApiProperty({ description: 'Quantidade de registros por página', example: 50 })
  pageSize: number;

  @ApiProperty({ description: 'Total de registros encontrados', example: 120 })
  total: number;

  @ApiProperty({ description: 'Total de páginas', example: 3 })
  totalPages: number;

  constructor(
    data: T[],
    page: number,
    pageSize: number,
    total: number,
    totalPages: number,
  ) {
    this.data = data;
    this.page = page;
    this.pageSize = pageSize;
    this.total = total;
    this.totalPages = totalPages;
  }
}
