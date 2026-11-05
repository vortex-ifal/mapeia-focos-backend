import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AgentIdParamDto {
  @ApiProperty({
    description: 'Identificador único (UUID) do agente',
    example: '01a1427d-cf34-7f7d-9662-87d1921be41a',
  })
  @IsUUID('all', { message: 'O ID do agente deve ser um UUID válido.' })
  agentId: string;
}
