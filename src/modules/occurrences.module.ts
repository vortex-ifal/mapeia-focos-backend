import { Module } from '@nestjs/common';
import { AgentController, OccurrencesController } from '../controllers';
import {
  AgentDashboardMapper,
  AssignmentMapper,
  InspectionMapper,
  MediaMapper,
  OccurrenceEventMapper,
  OccurrenceHistoryMapper,
  OccurrenceMapper,
  OccurrenceStatusMapper,
} from '../mappers';
import {
  AssignmentsRepository,
  InspectionsRepository,
  MediaRepository,
  OccurrenceEventsRepository,
  OccurrencesRepository,
  OccurrenceStatusesRepository,
} from '../repositories';
import { InspectionService, MediaService, OccurrenceService } from '../services';
import { UsersModule } from './users.module';

@Module({
  imports: [UsersModule],
  controllers: [OccurrencesController, AgentController],
  providers: [
    OccurrenceService,
    InspectionService,
    OccurrencesRepository,
    InspectionsRepository,
    OccurrenceStatusesRepository,
    OccurrenceEventsRepository,
    AssignmentsRepository,
    OccurrenceMapper,
    InspectionMapper,
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
    InspectionService,
    OccurrencesRepository,
    InspectionsRepository,
    OccurrenceStatusesRepository,
    OccurrenceEventsRepository,
    MediaService,
    MediaRepository,
  ],
})
export class OccurrencesModule {}
