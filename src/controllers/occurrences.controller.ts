import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreatedResponseDto, CreateOccurrenceDto } from '../dtos';
import { OccurrenceMapper } from '../mappers';
import { OccurrenceService } from '../services';

@Controller('occurrences')
export class OccurrencesController {
  constructor(
    private readonly occurrenceService: OccurrenceService,
    private readonly occurrenceMapper: OccurrenceMapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOccurrenceDto): Promise<CreatedResponseDto> {
    const domainEntity = this.occurrenceMapper.toDomainFromDto(dto);
    const createdEntity = await this.occurrenceService.create(domainEntity);
    return this.occurrenceMapper.toCreatedDto(createdEntity);
  }
}
