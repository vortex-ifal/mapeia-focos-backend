import { ApiProperty } from '@nestjs/swagger';

export class AgentAvailabilityResponseDto {
  @ApiProperty({
    description: 'Identificador único do agente',
    example: '01a1427d-cf34-7f7d-9662-87d1921be41a',
  })
  agentId!: string;

  @ApiProperty({
    description: 'Nome do agente',
    example: 'Maria da Silva',
  })
  name!: string;

  @ApiProperty({
    description: 'Setor ou região de atuação do agente',
    example: 'Centro',
    nullable: true,
  })
  sectorRegion!: string | null;

  @ApiProperty({
    description: 'Quantidade de ocorrências atualmente atribuídas ao agente',
    example: 4,
  })
  totalActiveTasks!: number;
}
