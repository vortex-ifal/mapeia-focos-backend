import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AgentDashboardResponseDto, AgentIdParamDto } from '../dtos';
import { AgentDashboardMapper } from '../mappers';
import { OccurrenceService } from '../services';

@ApiTags('Agent')
@Controller('agent')
export class AgentController {
  constructor(
    private readonly occurrenceService: OccurrenceService,
    private readonly agentDashboardMapper: AgentDashboardMapper,
  ) {}

  @Get(':agentId/dashboard')
  @ApiOperation({
    summary: 'Resumo diário do agente',
    description:
      'Retorna o compilado estatístico das ocorrências ativas atribuídas ao agente: ' +
      'total de tarefas, contagem de prioridade alta, total de vistorias pendentes e a ocorrência mais urgente em destaque.',
  })
  @ApiParam({
    name: 'agentId',
    description: 'Identificador único (UUID) do agente',
    example: '01a1427d-cf34-7f7d-9662-87d1921be41a',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resumo do dia recuperado com sucesso.',
    type: AgentDashboardResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'O ID do agente deve ser um UUID válido.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agente não encontrado no sistema.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'O usuário informado não possui perfil de agente.',
  })
  async getDashboard(
    @Param() params: AgentIdParamDto,
  ): Promise<AgentDashboardResponseDto> {
    const readModel = await this.occurrenceService.getAgentDashboard(
      params.agentId,
    );
    return this.agentDashboardMapper.toDto(readModel);
  }
}
