import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { DEV_USERS } from '../constants';
import {
  CreateOccurrenceDto,
  CreateOccurrenceResponseDto,
  FindAllOccurrencesQueryDto,
  OccurrenceDetailResponseDto,
  OccurrenceProtocolStatusResponseDto,
  OccurrenceResponseDto,
  PaginationResponseDto,
  ProtocolParamDto,
  TerritorialContextQueryDto,
  TerritorialContextResponseDto,
  UpdateOccurrencePriorityDto,
  UpdateOccurrenceStatusDto,
  UuidParamDto,
} from '../dtos';
import { OccurrenceMapper } from '../mappers';
import { OccurrenceService } from '../services';

@ApiTags('Occurrences')
@Controller('occurrences')
export class OccurrencesController {
  constructor(
    private readonly occurrenceService: OccurrenceService,
    private readonly occurrenceMapper: OccurrenceMapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar uma nova ocorrência ou foco de vetor',
    description:
      'Cria uma nova ocorrência de foco (ex.: dengue) no sistema a partir dos dados informados pelo cidadão ou agente.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ocorrência registrada com sucesso.',
    type: CreateOccurrenceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Dados da requisição inválidos (ex.: validações de campos ou coordenadas).',
  })
  async create(
    @Body() dto: CreateOccurrenceDto,
  ): Promise<CreateOccurrenceResponseDto> {
    const domainEntity = this.occurrenceMapper.toDomainFromDto(
      dto,
      DEV_USERS.CITIZEN_ID,
    );
    const createdOccurrence = await this.occurrenceService.create(domainEntity);
    return this.occurrenceMapper.toCreateResponseDto(createdOccurrence);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar ocorrências com paginação e filtros',
    description:
      'Retorna a lista paginada de ocorrências ativas no sistema, permitindo filtrar por chave de status (ex.: registered para a fila de triagem da Central Operacional).',
  })
  @ApiExtraModels(PaginationResponseDto, OccurrenceResponseDto)
  @ApiOkResponse({
    description: 'Lista paginada de ocorrências recuperada com sucesso.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(OccurrenceResponseDto) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Parâmetros de paginação ou filtro inválidos (ex.: página menor que 1 ou chave de status inexistente).',
  })
  async findAll(
    @Query() query: FindAllOccurrencesQueryDto,
  ): Promise<PaginationResponseDto<OccurrenceResponseDto>> {
    const paginatedReadModel = await this.occurrenceService.findAll(
      query.page,
      query.pageSize,
      query.statusKey,
    );

    return this.occurrenceMapper.toPaginatedListDto(paginatedReadModel);
  }

  @Get('protocol/:protocol')
  @ApiOperation({
    summary: 'Consultar status de ocorrência por protocolo',
    description:
      'Retorna o status atual de uma ocorrência através de seu código de protocolo alfanumérico de 5 caracteres.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status da ocorrência recuperado com sucesso.',
    type: OccurrenceProtocolStatusResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Parâmetro de protocolo inválido (deve conter exatamente 5 caracteres alfanuméricos).',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ocorrência não encontrada para o protocolo informado.',
  })
  async getStatusByProtocol(
    @Param() params: ProtocolParamDto,
  ): Promise<OccurrenceProtocolStatusResponseDto> {
    const readModel = await this.occurrenceService.findStatusByProtocol(
      params.protocol,
    );
    return this.occurrenceMapper.toStatusDto(readModel);
  }

  @Get(':id/territorial-context')
  @ApiOperation({
    summary: 'Contexto territorial de uma ocorrência',
    description:
      'Retorna as ocorrências em um raio (metros) ao redor da ocorrência analisada, sem dados pessoais.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: TerritorialContextResponseDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Parâmetro ID inválido (deve ser um UUID válido).',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ocorrência não encontrada.',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'A ocorrência não possui coordenadas.',
  })
  async findTerritorialContext(
    @Param() params: UuidParamDto,
    @Query() query: TerritorialContextQueryDto,
  ): Promise<TerritorialContextResponseDto> {
    const nearby = await this.occurrenceService.findTerritorialContext(
      params.id,
      query.radius,
      query.limit,
    );
    return this.occurrenceMapper.toTerritorialContextDto(nearby, query.radius);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar detalhes de uma ocorrência por ID',
    description:
      'Retorna os dados detalhados da ocorrência ativa e suas mídias anexadas, omitindo dados sensíveis do cidadão (user_id).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalhes da ocorrência recuperados com sucesso.',
    type: OccurrenceDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Parâmetro ID inválido (deve ser um UUID válido).',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ocorrência não encontrada no sistema.',
  })
  async findById(
    @Param() params: UuidParamDto,
  ): Promise<OccurrenceDetailResponseDto> {
    const entity = await this.occurrenceService.findDetailsById(params.id);
    return this.occurrenceMapper.toDetailsDto(entity);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualizar status de uma ocorrência',
    description:
      'Atualiza o status de uma ocorrência ativa para qualquer status válido no sistema.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Status da ocorrência atualizado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Parâmetros ou corpo da requisição inválidos (ex.: ID não é um UUID ou chave de status vazia).',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ocorrência não encontrada no sistema.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A ocorrência já se encontra com o status informado.',
  })
  async updateStatus(
    @Param() params: UuidParamDto,
    @Body() dto: UpdateOccurrenceStatusDto,
  ): Promise<void> {
    await this.occurrenceService.updateStatus(
      params.id,
      dto.statusKey,
      DEV_USERS.MANAGER_ID,
    );
  }

  @Patch(':id/priority')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Definir prioridade de uma ocorrência',
    description:
      'Atualiza o nível de prioridade (low, medium, high) de uma ocorrência que já se encontra validada (status accepted).',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Prioridade da ocorrência atualizada com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Parâmetros ou corpo da requisição inválidos (ex.: ID não é um UUID ou valor de prioridade inválido).',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ocorrência não encontrada no sistema.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'A prioridade só pode ser definida para ocorrências com status validado (accepted).',
  })
  async updatePriority(
    @Param() params: UuidParamDto,
    @Body() dto: UpdateOccurrencePriorityDto,
  ): Promise<void> {
    await this.occurrenceService.updatePriority(params.id, dto.priority);
  }
}
