import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OccurrencePriority } from '../../../entities';

export class UpdateOccurrencePriorityDto {
  @ApiProperty({
    description: 'Nível de prioridade da ocorrência',
    enum: OccurrencePriority,
    example: OccurrencePriority.HIGH,
  })
  @IsNotEmpty({
    message: 'A prioridade da ocorrência é obrigatória.',
  })
  @IsEnum(OccurrencePriority, {
    message: `A prioridade deve ser um dos valores válidos: ${Object.values(OccurrencePriority).join(', ')}`,
  })
  priority: OccurrencePriority;
}
