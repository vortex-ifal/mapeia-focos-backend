import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DispatchOccurrenceDto {
  @ApiProperty({
    description: 'ID do agente que receberá a ocorrência',
    example: '01a1427d-cf34-7f7d-9662-87d1921be41a',
  })
  @IsUUID('all', { message: 'O agent_id deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O agent_id é obrigatório' })
  agent_id: string;
}
