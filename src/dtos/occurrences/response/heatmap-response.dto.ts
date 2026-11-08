import { ApiProperty } from '@nestjs/swagger';

export class HeatmapPointDto {
  @ApiProperty({
    description: 'Latitude da ocorrência',
    example: -9.751234,
  })
  latitude!: number;

  @ApiProperty({
    description: 'Longitude da ocorrência',
    example: -36.661234,
  })
  longitude!: number;
}

export class HeatmapResponseDto {
  @ApiProperty({
    description: 'Total de ocorrências confirmadas com localização disponível',
    example: 142,
  })
  total!: number;

  @ApiProperty({
    description: 'Lista de coordenadas geográficas para renderização do heatmap',
    type: [HeatmapPointDto],
  })
  points!: HeatmapPointDto[];
}
