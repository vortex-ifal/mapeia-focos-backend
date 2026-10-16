import { Module } from '@nestjs/common';
import { UsersController } from '../controllers';
import { CryptoModule } from '../infra';
import { UserMapper } from '../mappers';
import { UsersRepository } from '../repositories';
import { UserService } from '../services';

@Module({
  imports: [CryptoModule],
  controllers: [UsersController],
  providers: [UserService, UsersRepository, UserMapper],
  exports: [UserService, UsersRepository, UserMapper],
})
export class UsersModule {}
