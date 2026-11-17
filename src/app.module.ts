import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CryptoModule, DatabaseModule, StorageModule } from './infra';
import { OccurrencesModule, UsersModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    StorageModule,
    CryptoModule,
    OccurrencesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
