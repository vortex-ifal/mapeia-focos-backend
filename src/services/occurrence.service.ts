import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NearbyOccurrenceEntity, OccurrenceEntity } from '../entities';
import {
  OccurrencesRepository,
  OccurrenceStatusesRepository,
  UsersRepository,
} from '../repositories';
import { TERRITORIAL_MAX_RESULTS } from '../constants';

@Injectable()
export class OccurrenceService {
  constructor(
    private readonly occurrencesRepository: OccurrencesRepository,
    private readonly occurrenceStatusesRepository: OccurrenceStatusesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(entity: OccurrenceEntity): Promise<string> {
    const user = await this.usersRepository.findById(entity.userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado no sistema');
    }

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

  // --- NOVOS MÉTODOS PARA TRIAGEM E CONTEXTO TERRITORIAL ---

  async findAwaitingTriage(
    limit: number,
    offset: number,
  ): Promise<OccurrenceEntity[]> {
    return this.occurrencesRepository.findAwaitingTriage(limit, offset);
  }

  async countAwaitingTriage(): Promise<number> {
    return this.occurrencesRepository.countAwaitingTriage();
  }

  async findTerritorialContext(
    id: string,
    radiusMeters: number,
  ): Promise<NearbyOccurrenceEntity[]> {
    const occurrence = await this.occurrencesRepository.findById(id);
    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    if (occurrence.latitude === null || occurrence.longitude === null) {
      throw new UnprocessableEntityException(
        'A ocorrência não possui coordenadas para calcular o contexto territorial',
      );
    }

    return this.occurrencesRepository.findNearby(
      { id, latitude: occurrence.latitude, longitude: occurrence.longitude },
      radiusMeters,
      TERRITORIAL_MAX_RESULTS,
    );
  }
}
