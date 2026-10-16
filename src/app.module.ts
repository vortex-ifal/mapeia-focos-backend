import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CryptoModule, DatabaseModule, StorageModule } from './infra';
import { MediaModule, OccurrencesModule, UsersModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    StorageModule,
    CryptoModule,
    OccurrencesModule,
    MediaModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
