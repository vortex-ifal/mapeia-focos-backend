import { ApiProperty } from '@nestjs/swagger';

export class AgentWorkloadResponseDto {
  @ApiProperty({
    description: 'Identificador único do agente (UUID)',
    example: '01a1427d-cf34-7f7d-9662-87d1921be41a',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do agente',
    example: 'Agente de Endemias',
  })
  name: string;

  @ApiProperty({
    description: 'Quantidade de ocorrências em andamento atribuídas ao agente',
    example: 0,
  })
  activeTasksCount: number;
}
