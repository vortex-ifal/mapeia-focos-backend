import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infra';
import { OccurrencesModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    OccurrencesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
