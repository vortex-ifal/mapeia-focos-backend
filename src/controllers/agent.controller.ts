import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DEV_USERS } from '../constants';
import { AgentDashboardResponseDto, OccurrenceResponseDto } from '../dtos';
import { AgentDashboardMapper, OccurrenceMapper } from '../mappers';
import { OccurrenceService } from '../services';

@ApiTags('Agents')
@Controller('agents')
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

  @Get('dashboard')
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
}
