import { Module } from '@nestjs/common';
import { AgentController, OccurrencesController } from '../controllers';
import {
  AgentDashboardMapper,
  AssignmentMapper,
  MediaMapper,
  OccurrenceMapper,
  OccurrenceStatusMapper,
} from '../mappers';
import {
  AssignmentsRepository,
  MediaRepository,
  OccurrencesRepository,
  OccurrenceStatusesRepository,
} from '../repositories';
import { MediaService, OccurrenceService } from '../services';
import { UsersModule } from './users.module';

@Module({
  imports: [UsersModule],
  controllers: [OccurrencesController, AgentController],
  providers: [
    OccurrenceService,
    OccurrencesRepository,
    OccurrenceStatusesRepository,
    AssignmentsRepository,
    OccurrenceMapper,
    OccurrenceStatusMapper,
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
    MediaService,
    MediaRepository,
  ],
})
export class OccurrencesModule {}
