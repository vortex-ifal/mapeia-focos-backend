import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from '../common';
import type { AuthenticatedUserPayload } from '../common';
import {
  AgentDashboardResponseDto,
  AgentOccurrenceDetailResponseDto,
  AgentWorkloadResponseDto,
  AgentWorklistQueryDto,
  OccurrenceResponseDto,
  UuidParamDto,
} from '../dtos';
import type { AgentWorklistFilters } from '../entities';
import { AgentDashboardMapper, OccurrenceMapper, UserMapper } from '../mappers';
import { OccurrenceService, UserService } from '../services';

@ApiTags('Agents')
@ApiBearerAuth()
@Controller()
export class AgentController {
  constructor(
    private readonly occurrenceService: OccurrenceService,
    private readonly agentDashboardMapper: AgentDashboardMapper,
    private readonly occurrenceMapper: OccurrenceMapper,
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Get('agents/occurrences')
  @Roles('agent')
  @ApiOperation({
    summary: 'Lista de trabalho do agente',
    description:
      'Retorna a lista de ocorrências ativas atribuídas ao agente autenticado. ' +
      'Permite ordenar/agrupar por status ou endereço ("status" ou "address"), ' +
      'com ocorrências de prioridade alta sempre no topo de cada grupo. ' +
      'Caso nenhum parâmetro seja informado, a lista é ordenada prioritariamente por urgência ' +
      '(Alta > Média > Baixa) e data de criação.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de trabalho do agente recuperada com sucesso.',
    type: [OccurrenceResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Critério de ordenação inválido.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agente não encontrado no sistema.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'O usuário informado não possui perfil de agente.',
  })
  async getWorklist(
    @CurrentUser() user: AuthenticatedUserPayload,
    @Query() query: AgentWorklistQueryDto,
  ): Promise<OccurrenceResponseDto[]> {
    const filters: AgentWorklistFilters = {
      orderBy: query.orderBy,
    };
    const occurrences = await this.occurrenceService.findAssignedToAgent(
      user.sub,
      filters,
    );
    return occurrences.map((occ) => this.occurrenceMapper.toDto(occ));
  }

  @Get('agents/dashboard')
  @Roles('agent')
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
  async getDashboard(
    @CurrentUser() user: AuthenticatedUserPayload,
  ): Promise<AgentDashboardResponseDto> {
    const readModel = await this.occurrenceService.getAgentDashboard(
      user.sub,
    );
    return this.agentDashboardMapper.toDto(readModel);
  }

  @Get('agents')
  @Roles('manager')
  @ApiOperation({
    summary: 'Listar agentes e suas tarefas em andamento',
    description:
      'Retorna os agentes ativos ordenados pela quantidade de ocorrências em atendimento atribuídas.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de agentes ativos e suas quantidades de tarefas.',
    type: AgentWorkloadResponseDto,
    isArray: true,
  })
  async findAgentsWithActiveTasks(): Promise<AgentWorkloadResponseDto[]> {
    const agents = await this.userService.findAgentsWithActiveTasks();
    return agents.map((agent) => this.userMapper.toAgentWorkloadDto(agent));
  }

  @Get('agent/occurrences/:id')
  @Roles('agent')
  @ApiOperation({
    summary: 'Consultar detalhes de uma ocorrência atribuída ao agente',
    description:
      'Retorna os detalhes e as mídias da ocorrência somente quando sua atribuição vigente pertence ao agente autenticado.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalhes da ocorrência recuperados com sucesso.',
    type: AgentOccurrenceDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'O identificador da ocorrência informado não é um UUID válido.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Você não tem permissão para acessar esta ocorrência.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ocorrência não encontrada no sistema.',
  })
  async getAssignedOccurrenceDetails(
    @CurrentUser() user: AuthenticatedUserPayload,
    @Param() params: UuidParamDto,
  ): Promise<AgentOccurrenceDetailResponseDto> {
    const details = await this.occurrenceService.findDetailsForAgent(
      params.id,
      user.sub,
    );
    return this.occurrenceMapper.toAgentDetailsDto(details);
  }
}
