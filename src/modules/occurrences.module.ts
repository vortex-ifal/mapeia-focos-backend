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
  OccurrencesRepository,
  OccurrenceStatusesRepository,
} from '../repositories';
import { OccurrenceService } from '../services';
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
    AssignmentMapper,
    AgentDashboardMapper,
  ],
  exports: [
    OccurrenceService,
    OccurrencesRepository,
    OccurrenceStatusesRepository,
  ],
})
export class OccurrencesModule {}
