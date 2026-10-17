import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OccurrenceEntity } from '../entities';
import {
  OccurrencesRepository,
  OccurrenceStatusesRepository,
} from '../repositories';

@Injectable()
export class OccurrenceService {
  constructor(
    private readonly occurrencesRepository: OccurrencesRepository,
    private readonly occurrenceStatusesRepository: OccurrenceStatusesRepository,
  ) {}

  async create(entity: OccurrenceEntity): Promise<OccurrenceEntity> {
    if (!entity.status) {
      const defaultStatus =
        await this.occurrenceStatusesRepository.findByKey('registered');
      if (!defaultStatus) {
        throw new InternalServerErrorException(
          'Status padrão "registered" não encontrado no sistema',
        );
      }
      entity.status = defaultStatus;
    }

    return this.occurrencesRepository.create(entity);
  }

  async findById(id: string): Promise<OccurrenceEntity | null> {
    return this.occurrencesRepository.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    return this.occurrencesRepository.softDelete(id);
  }
}
