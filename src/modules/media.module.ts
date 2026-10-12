import { Module } from '@nestjs/common';
import { MediaController } from '../controllers';
import { MediaMapper } from '../mappers';
import { MediaRepository } from '../repositories';
import { MediaService } from '../services';
import { OccurrencesModule } from './occurrences.module';

@Module({
  imports: [OccurrencesModule],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository, MediaMapper],
  exports: [MediaService, MediaRepository],
})
export class MediaModule {}
