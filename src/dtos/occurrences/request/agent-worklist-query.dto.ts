import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AgentWorklistOrderBy } from '../../../entities';

export class AgentWorklistQueryDto {
  @ApiPropertyOptional({
    description:
      'Critério de ordenação da lista de tarefas do agente (status ou address)',
    enum: AgentWorklistOrderBy,
    example: AgentWorklistOrderBy.STATUS,
  })
  @IsOptional()
  @IsEnum(AgentWorklistOrderBy, {
    message: 'O critério de ordenação deve ser "status" ou "address"',
  })
  orderBy?: AgentWorklistOrderBy;
}
