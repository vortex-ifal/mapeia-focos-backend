import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DEV_USERS } from '../constants';
import {
  AgentAvailabilityResponseDto,
  AgentDashboardResponseDto,
  OccurrenceResponseDto,
} from '../dtos';
import {
  AgentAvailabilityMapper,
  AgentDashboardMapper,
  OccurrenceMapper,
} from '../mappers';
import { OccurrenceService, UserService } from '../services';

@ApiTags('Agents')
@Controller()
export class AgentController {
  constructor(
    private readonly occurrenceService: OccurrenceService,
    private readonly agentDashboardMapper: AgentDashboardMapper,
    private readonly occurrenceMapper: OccurrenceMapper,
    private readonly userService: UserService,
    private readonly agentAvailabilityMapper: AgentAvailabilityMapper,
  ) {}

  @Get('agents/occurrences')
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

  @Get('agents/dashboard')
  @ApiOperation({
    summary: 'Resumo diário do agente',
    description:
      'Retorna o compilado estatístico das ocorrências ativas atribuídas ao agente autenticado: ' +
      'total de tarefas, contagem de prioridade alta, total de vistorias pendentes e a ocorrência mais urgente em destaque.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resumo do dia recuperado com sucesso.',
    type: AgentDashboardResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agente não encontrado no sistema.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'O usuário informado não possui perfil de agente.',
  })
  async getDashboard(): Promise<AgentDashboardResponseDto> {
    const readModel = await this.occurrenceService.getAgentDashboard(
      DEV_USERS.AGENT_ID,
    );
    return this.agentDashboardMapper.toDto(readModel);
  }

  @Get('users/agentes')
  @ApiOperation({
    summary: 'Listar agentes e suas tarefas ativas',
    description:
      'Retorna todos os agentes ativos e a quantidade de ocorrências em andamento atualmente atribuídas a cada um.',
  })
  @ApiOkResponse({
    description: 'Lista de agentes recuperada com sucesso.',
    type: [AgentAvailabilityResponseDto],
  })
  async findAgents(): Promise<AgentAvailabilityResponseDto[]> {
    const agents = await this.userService.findAgentsWithActiveTaskCounts();
    return agents.map((agent) => this.agentAvailabilityMapper.toDto(agent));
  }
}
