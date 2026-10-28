import { Module } from '@nestjs/common';
import { OccurrencesController } from '../controllers';
import {
  MediaMapper,
  OccurrenceMapper,
  OccurrenceStatusMapper,
} from '../mappers';
import {
  OccurrencesRepository,
  OccurrenceStatusesRepository,
} from '../repositories';
import { OccurrenceService } from '../services';
import { UsersModule } from './users.module';

@Module({
  imports: [UsersModule],
  controllers: [OccurrencesController],
  providers: [
    OccurrenceService,
    OccurrencesRepository,
    OccurrenceStatusesRepository,
    OccurrenceMapper,
    OccurrenceStatusMapper,
    MediaMapper,
  ],
  exports: [
    OccurrenceService,
    OccurrencesRepository,
    OccurrenceStatusesRepository,
  ],
})
export class OccurrencesModule {}
