import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DEV_USERS } from '../constants';
import {
  CreatedResponseDto,
  CreateOccurrenceDto,
  TerritorialContextQueryDto,
  TerritorialContextResponseDto,
  TriageQueueQueryDto,
  TriageQueueResponseDto,
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
    type: CreatedResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Dados da requisição inválidos (ex.: validações de campos ou coordenadas).',
  })
  async create(@Body() dto: CreateOccurrenceDto): Promise<CreatedResponseDto> {
    const domainEntity = this.occurrenceMapper.toDomainFromDto(
      dto,
      DEV_USERS.CITIZEN_ID,
    );
    const id = await this.occurrenceService.create(domainEntity);
    return this.occurrenceMapper.toCreatedDto(id);
  }

  @Get('triage')
  @ApiOperation({
    summary: 'Listar a fila de triagem',
    description:
      'Retorna as ocorrências aguardando triagem, da mais antiga para a mais recente, com resumo para a Central Operacional.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: TriageQueueResponseDto })
  async findTriageQueue(
    @Query() query: TriageQueueQueryDto,
  ): Promise<TriageQueueResponseDto> {
    const [entities, total] = await Promise.all([
      this.occurrenceService.findAwaitingTriage(query.limit, query.offset),
      this.occurrenceService.countAwaitingTriage(),
    ]);

    return this.occurrenceMapper.toTriageQueueDto(
      entities,
      total,
      query.limit,
      query.offset,
    );
  }

  @Get(':id/territorial-context')
  @ApiOperation({
    summary: 'Contexto territorial de uma ocorrência',
    description:
      'Retorna as ocorrências em um raio (metros) ao redor da ocorrência analisada, sem dados pessoais.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: TerritorialContextResponseDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Ocorrência não encontrada.',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'A ocorrência não possui coordenadas.',
  })
  async findTerritorialContext(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: TerritorialContextQueryDto,
  ): Promise<TerritorialContextResponseDto> {
    const nearby = await this.occurrenceService.findTerritorialContext(
      id,
      query.radius,
    );
    return this.occurrenceMapper.toTerritorialContextDto(nearby, query.radius);
  }
}
