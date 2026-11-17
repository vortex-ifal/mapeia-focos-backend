import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { DEV_USERS } from '../constants';
import { type ListOccurrencesFilters } from '../entities';
import {
  AssignOccurrenceDto,
  CreateOccurrenceDto,
  CreateOccurrenceResponseDto,
  FindAllOccurrencesQueryDto,
  HeatmapResponseDto,
  OccurrenceDetailResponseDto,
  OccurrenceProtocolStatusResponseDto,
  OccurrenceResponseDto,
  PaginationResponseDto,
  ProtocolParamDto,
  TerritorialContextQueryDto,
  TerritorialContextResponseDto,
  UpdateOccurrencePriorityDto,
  UpdateOccurrenceStatusDto,
  UploadMediaResponseDto,
  UuidParamDto,
} from '../dtos';
import { MediaMapper, OccurrenceMapper } from '../mappers';
import { MediaService, OccurrenceService } from '../services';

@ApiTags('Occurrences')
@Controller('occurrences')
export class OccurrencesController {
  constructor(
    private readonly occurrenceService: OccurrenceService,
    private readonly occurrenceMapper: OccurrenceMapper,
    private readonly mediaService: MediaService,
    private readonly mediaMapper: MediaMapper,
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
      'Retorna a lista paginada de ocorrências ativas no sistema, ordenadas pelas mais recentes. Permite filtrar por chave de status, prioridade, endereço (bairro ou logradouro) e agente atribuído.',
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
      'Parâmetros de paginação ou filtro inválidos (ex.: página menor que 1, chave de status inexistente ou prioridade inválida).',
  })
  async findAll(
    @Query() query: FindAllOccurrencesQueryDto,
  ): Promise<PaginationResponseDto<OccurrenceResponseDto>> {
    const filters: ListOccurrencesFilters = {
      statusKey: query.statusKey,
      priority: query.priority,
      address: query.address,
      agentId: query.agentId,
    };

    const paginatedReadModel = await this.occurrenceService.findAll(
      query.page,
      query.pageSize,
      filters,
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

  @Get('heatmap')
  @ApiOperation({
    summary: 'Coordenadas para mapa de calor de risco',
    description:
      'Retorna todas as coordenadas de ocorrências confirmadas e ativas (status accepted ou forwarded_for_inspection) '
      + 'com localização disponível para renderização da camada de calor no painel do gestor.',
  })
  @ApiOkResponse({
    description: 'Pontos do heatmap retornados com sucesso.',
    type: HeatmapResponseDto,
  })
  async getHeatmap(): Promise<HeatmapResponseDto> {
    const points = await this.occurrenceService.findHeatmapPoints();
    return this.occurrenceMapper.toHeatmapResponseDto(points);
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
    const detail = await this.occurrenceService.findDetailsById(params.id);
    return this.occurrenceMapper.toDetailsDto(detail);
  }

  @Post(':id/media')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Fazer upload de mídias para uma ocorrência',
    description:
      'Envia até 3 arquivos vinculados à ocorrência especificada (máximo 10MB por arquivo).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'Identificador único (UUID) da ocorrência',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Lista de arquivos de mídia (máx. 3)',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Mídias enviadas com sucesso.',
    type: [UploadMediaResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Nenhum arquivo enviado ou limites excedidos.',
  })
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadMedia(
    @Param() params: UuidParamDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadMediaResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const results: UploadMediaResponseDto[] = [];

    for (const file of files) {
      const entity = await this.mediaService.uploadMedia(params.id, file);
      results.push(this.mediaMapper.toDto(entity));
    }

    return results;
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

  @Patch(':id/assign')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Despachar ocorrência para um agente',
    description:
      'Associa um agente à ocorrência validada (accepted), atualizando seu status para "forwarded_for_inspection" e registrando o despacho no histórico.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Ocorrência despachada para o agente com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Parâmetros ou corpo da requisição inválidos (ex.: ID não é um UUID válido).',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ocorrência ou agente não encontrado no sistema.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Apenas ocorrências com status validado (accepted) podem ser despachadas, ou o usuário informado não possui perfil de agente.',
  })
  async assign(
    @Param() params: UuidParamDto,
    @Body() dto: AssignOccurrenceDto,
  ): Promise<void> {
    await this.occurrenceService.assign(
      params.id,
      dto.agentId,
      DEV_USERS.MANAGER_ID,
    );
  }
}
