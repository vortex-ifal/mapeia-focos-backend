import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OccurrenceEntity } from '../entities';
import {
  OccurrencesRepository,
  OccurrenceStatusesRepository,
  UsersRepository,
} from '../repositories';

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
}
