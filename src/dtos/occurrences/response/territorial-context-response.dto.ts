import { ApiProperty } from '@nestjs/swagger';
import { OccurrenceStatusSummaryDto } from './occurrence-list-item-response.dto';

export class NearbyOccurrenceDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: -9.6675 })
  latitude: number;

  @ApiProperty({ example: -35.735 })
  longitude: number;

  @ApiProperty({
    description: 'Distância até a ocorrência analisada, em metros',
    example: 178,
  })
  distanceMeters: number;

  @ApiProperty({ type: OccurrenceStatusSummaryDto })
  status: OccurrenceStatusSummaryDto;

  @ApiProperty({ description: 'Data de criação (ISO 8601)' })
  createdAt: string;
}

export class TerritorialContextResponseDto {
  @ApiProperty({ description: 'Raio usado na busca, em metros' })
  radiusMeters: number;

  @ApiProperty()
  total: number;

  @ApiProperty({ type: [NearbyOccurrenceDto] })
  items: NearbyOccurrenceDto[];
}
