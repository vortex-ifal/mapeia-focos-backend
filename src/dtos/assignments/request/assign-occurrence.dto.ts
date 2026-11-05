import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignOccurrenceDto {
  @ApiProperty({
    description: 'UUID do agente a ser associado à ocorrência',
    example: '01a1427d-cf34-7f7d-9662-87d1921be41a',
  })
  @IsNotEmpty({ message: 'O ID do agente é obrigatório.' })
  @IsUUID('all', { message: 'O ID do agente deve ser um UUID válido.' })
  agentId: string;
}
