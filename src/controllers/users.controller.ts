import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AgentAvailabilityResponseDto,
  CreatedResponseDto,
  CreateUserDto,
} from '../dtos';
import { AgentAvailabilityMapper, UserMapper } from '../mappers';
import { UserService } from '../services';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
    private readonly agentAvailabilityMapper: AgentAvailabilityMapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar um novo usuário',
    description:
      'Cria um novo usuário cidadão no sistema a partir dos dados informados.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário cadastrado com sucesso.',
    type: CreatedResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados da requisição inválidos.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'E-mail ou CPF já cadastrado no sistema.',
  })
  async create(@Body() dto: CreateUserDto): Promise<CreatedResponseDto> {
    const domainEntity = this.userMapper.toDomainFromDto(dto);
    const id = await this.userService.create(domainEntity);
    return this.userMapper.toCreatedDto(id);
  }

  @Get('agentes')
  @ApiOperation({
    summary: 'Listar agentes e suas tarefas ativas',
    description:
      'Retorna os agentes ativos do município configurado e a quantidade de ocorrências atualmente atribuídas a cada um.',
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
