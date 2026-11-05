import { Module } from '@nestjs/common';
import { UsersController } from '../controllers';
import { CryptoModule } from '../infra';
import {
  AgentAvailabilityMapper,
  RoleMapper,
  UserMapper,
} from '../mappers';
import { RolesRepository, UsersRepository } from '../repositories';
import { UserService } from '../services';

@Module({
  imports: [CryptoModule],
  controllers: [UsersController],
  providers: [
    UserService,
    UsersRepository,
    RolesRepository,
    UserMapper,
    RoleMapper,
    AgentAvailabilityMapper,
  ],
  exports: [
    UserService,
    UsersRepository,
    RolesRepository,
    UserMapper,
    RoleMapper,
  ],
})
export class UsersModule {}
