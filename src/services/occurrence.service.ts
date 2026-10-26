import { randomBytes } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  NearbyOccurrenceEntity,
  OccurrenceEntity,
  OccurrenceStatusKey,
  type OccurrenceStatusReadModel,
} from '../entities';
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

    entity.protocol = await this.generateUniqueProtocol();

    return this.occurrencesRepository.create(entity);
  }

  async findStatusByProtocol(
    protocol: string,
  ): Promise<OccurrenceStatusReadModel> {
    const normalizedProtocol = protocol.trim().toLowerCase();
    const readModel =
      await this.occurrencesRepository.findStatusByProtocol(normalizedProtocol);

    if (!readModel) {
      throw new NotFoundException(
        'Ocorrência não encontrada para o protocolo informado',
      );
    }

    return readModel;
  }

  async findById(id: string): Promise<OccurrenceEntity | null> {
    return this.occurrencesRepository.findById(id);
  }

  async updateStatus(
    id: string,
    statusKey: OccurrenceStatusKey | string,
    userId: string,
  ): Promise<void> {
    const occurrence = await this.occurrencesRepository.findById(id);
    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada no sistema');
    }

    const previousStatusId = occurrence.status?.id;
    if (!previousStatusId) {
      throw new InternalServerErrorException(
        'Status atual da ocorrência não identificado no sistema',
      );
    }

    const newStatus =
      await this.occurrenceStatusesRepository.findByKey(statusKey);
    if (!newStatus || !newStatus.id) {
      throw new InternalServerErrorException(
        'Status informado não encontrado no sistema',
      );
    }

    if (previousStatusId === newStatus.id) {
      throw new ConflictException(
        'A ocorrência já se encontra com o status informado',
      );
    }

    const isActive = statusKey !== OccurrenceStatusKey.REJECTED;
    const updated = await this.occurrencesRepository.updateStatusWithHistory({
      occurrenceId: id,
      previousStatusId,
      newStatusId: newStatus.id,
      changedByUserId: userId,
      isActive,
    });

    if (!updated) {
      throw new InternalServerErrorException(
        'Falha ao atualizar o status da ocorrência',
      );
    }
  }

  async softDelete(id: string): Promise<boolean> {
    return this.occurrencesRepository.softDelete(id);
  }

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

  private async generateUniqueProtocol(): Promise<string> {
    const maxAttempts = 10;
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      const candidate = this.generateRandomProtocol();
      const existing =
        await this.occurrencesRepository.findStatusByProtocol(candidate);
      if (!existing) {
        return candidate;
      }
    }

    throw new InternalServerErrorException(
      'Falha ao gerar protocolo único para a ocorrência',
    );
  }

  private generateRandomProtocol(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = randomBytes(5);
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars[bytes[i] % chars.length];
    }
    return result;
  }
}
