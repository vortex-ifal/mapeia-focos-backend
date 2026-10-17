import { Module } from '@nestjs/common';
import { OccurrencesController } from '../controllers';
import { OccurrenceMapper, OccurrenceStatusMapper } from '../mappers';
import {
  OccurrencesRepository,
  OccurrenceStatusesRepository,
} from '../repositories';
import { OccurrenceService } from '../services';

@Module({
  controllers: [OccurrencesController],
  providers: [
    OccurrenceService,
    OccurrencesRepository,
    OccurrenceStatusesRepository,
    OccurrenceMapper,
    OccurrenceStatusMapper,
  ],
  exports: [
    OccurrenceService,
    OccurrencesRepository,
    OccurrenceStatusesRepository,
  ],
})
export class OccurrencesModule {}
