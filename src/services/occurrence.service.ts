import { Injectable } from '@nestjs/common';
import { OccurrenceEntity } from '../entities';
import { OccurrencesRepository } from '../repositories';

@Injectable()
export class OccurrenceService {
  constructor(private readonly occurrencesRepository: OccurrencesRepository) {}

  async create(entity: OccurrenceEntity): Promise<OccurrenceEntity> {
    return this.occurrencesRepository.create(entity);
  }
}
