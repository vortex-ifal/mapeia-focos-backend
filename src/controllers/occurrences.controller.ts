import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DEV_USERS } from '../constants';
import {
  CreatedResponseDto,
  CreateOccurrenceDto,
  OccurrenceStatusResponseDto,
  ProtocolParamDto,
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
    description: 'Dados da requisição inválidos (ex.: validações de campos ou coordenadas).',
  })
  async create(@Body() dto: CreateOccurrenceDto): Promise<CreatedResponseDto> {
    const domainEntity = this.occurrenceMapper.toDomainFromDto(
      dto,
      DEV_USERS.CITIZEN_ID,
    );
    const id = await this.occurrenceService.create(domainEntity);
    return this.occurrenceMapper.toCreatedDto(id);
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
    type: OccurrenceStatusResponseDto,
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
  ): Promise<OccurrenceStatusResponseDto> {
    const readModel = await this.occurrenceService.findStatusByProtocol(
      params.protocol,
    );
    return this.occurrenceMapper.toStatusDto(readModel);
  }
}
