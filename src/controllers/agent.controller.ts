import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DEV_USERS } from '../constants';
import {
  AgentDashboardResponseDto,
  AgentIdParamDto,
  OccurrenceResponseDto,
} from '../dtos';
import { AgentDashboardMapper, OccurrenceMapper } from '../mappers';
import { OccurrenceService } from '../services';

@ApiTags('Agent')
@Controller('agent')
export class AgentController {
  constructor(
    private readonly occurrenceService: OccurrenceService,
    private readonly agentDashboardMapper: AgentDashboardMapper,
    private readonly occurrenceMapper: OccurrenceMapper,
  ) {}

  @Get('occurrences')
  @ApiOperation({
    summary: 'Lista de trabalho do agente',
    description:
      'Retorna a lista de ocorrências ativas atribuídas ao agente autenticado, ' +
      'ordenadas por prioridade (Alta > Média > Baixa) e data de criação (mais antigas primeiro).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de trabalho do agente recuperada com sucesso.',
    type: [OccurrenceResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agente não encontrado no sistema.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'O usuário informado não possui perfil de agente.',
  })
  async getWorklist(): Promise<OccurrenceResponseDto[]> {
    const occurrences = await this.occurrenceService.findAssignedToAgent(
      DEV_USERS.AGENT_ID,
    );
    return occurrences.map((occ) => this.occurrenceMapper.toDto(occ));
  }

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
