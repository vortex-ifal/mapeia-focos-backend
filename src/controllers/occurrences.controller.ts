import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatedResponseDto, CreateOccurrenceDto } from '../dtos';
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
    const domainEntity = this.occurrenceMapper.toDomainFromDto(dto);
    const id = await this.occurrenceService.create(domainEntity);
    return this.occurrenceMapper.toCreatedDto(id);
  }
}
