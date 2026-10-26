import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOccurrenceStatusDto {
  @ApiProperty({
    description: 'Chave do novo status da ocorrência',
    example: 'under_review',
  })
  @IsString({ message: 'A chave de status deve ser um texto' })
  @IsNotEmpty({ message: 'A chave de status não pode estar vazia' })
  statusKey: string;
}
