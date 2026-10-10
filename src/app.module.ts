import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, StorageModule } from './infra';
import { MediaModule, OccurrencesModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    StorageModule,
    OccurrencesModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
