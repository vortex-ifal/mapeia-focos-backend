import { ApiProperty } from '@nestjs/swagger';

export class AssignedAgentResponseDto {
  @ApiProperty({
    description: 'Identificador único do agente responsável (UUID)',
    example: 'd9b2d63d-a232-4d22-bf45-d4101e428df8',
  })
  id: string;

  @ApiProperty({
    description: 'Nome completo do agente responsável',
    example: 'Carlos Agente',
  })
  name: string;
}
