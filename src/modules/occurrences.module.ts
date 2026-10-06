import { Module } from '@nestjs/common';
import { OccurrencesController } from '../controllers';
import { OccurrenceMapper } from '../mappers';
import { OccurrencesRepository } from '../repositories';
import { OccurrenceService } from '../services';

@Module({
  controllers: [OccurrencesController],
  providers: [
    OccurrenceService,
    OccurrencesRepository,
    OccurrenceMapper,
  ],
  exports: [OccurrenceService, OccurrencesRepository],
})
export class OccurrencesModule {}
