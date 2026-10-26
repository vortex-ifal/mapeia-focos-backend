import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OccurrenceStatusKey } from '../../../entities';

export class UpdateOccurrenceStatusDto {
  @ApiProperty({
    description: 'Chave do novo status da ocorrência',
    enum: OccurrenceStatusKey,
    example: OccurrenceStatusKey.UNDER_REVIEW,
  })
  @IsEnum(OccurrenceStatusKey, {
    message: `A chave de status deve ser um dos valores válidos: ${Object.values(OccurrenceStatusKey).join(', ')}`,
  })
  statusKey: OccurrenceStatusKey;
}
