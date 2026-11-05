import { Module } from '@nestjs/common';
import { OccurrencesController } from '../controllers';
import {
  AssignmentMapper,
  MediaMapper,
  OccurrenceMapper,
  OccurrenceStatusMapper,
} from '../mappers';
import {
  AssignmentsRepository,
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
    AssignmentsRepository,
    OccurrenceMapper,
    OccurrenceStatusMapper,
    MediaMapper,
    AssignmentMapper,
  ],
  exports: [
    OccurrenceService,
    OccurrencesRepository,
    OccurrenceStatusesRepository,
  ],
})
export class OccurrencesModule {}
