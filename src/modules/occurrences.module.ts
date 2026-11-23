import { Module } from '@nestjs/common';
import {
  AgentController,
  ManagementOccurrencesController,
  OccurrencesController,
} from '../controllers';
import {
  AgentDashboardMapper,
  AssignmentMapper,
  MediaMapper,
  OccurrenceEventMapper,
  OccurrenceHistoryMapper,
  OccurrenceMapper,
  OccurrenceStatusMapper,
} from '../mappers';
import {
  AssignmentsRepository,
  MediaRepository,
  OccurrenceEventsRepository,
  OccurrencesRepository,
  OccurrenceStatusesRepository,
} from '../repositories';
import { MediaService, OccurrenceService } from '../services';
import { UsersModule } from './users.module';

@Module({
  imports: [UsersModule],
  controllers: [
    OccurrencesController,
    AgentController,
    ManagementOccurrencesController,
  ],
  providers: [
    OccurrenceService,
    OccurrencesRepository,
    OccurrenceStatusesRepository,
    OccurrenceEventsRepository,
    AssignmentsRepository,
    OccurrenceMapper,
    OccurrenceStatusMapper,
    OccurrenceEventMapper,
    OccurrenceHistoryMapper,
    MediaMapper,
    MediaService,
    MediaRepository,
    AssignmentMapper,
    AgentDashboardMapper,
  ],
  exports: [
    OccurrenceService,
    OccurrencesRepository,
    OccurrenceStatusesRepository,
    OccurrenceEventsRepository,
    MediaService,
    MediaRepository,
  ],
})
export class OccurrencesModule {}
