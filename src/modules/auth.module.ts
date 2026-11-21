import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../controllers';
import { CryptoModule } from '../infra';
import { AuthMapper } from '../mappers';
import { AuthService } from '../services';
import { UsersModule } from './users.module';

@Module({
  imports: [
    UsersModule,
    CryptoModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '1d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMapper],
  exports: [AuthService, AuthMapper, JwtModule],
})
export class AuthModule {}
