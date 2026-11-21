import { Module } from '@nestjs/common';
import { CryptoModule } from '../infra';
import { RoleMapper, UserMapper } from '../mappers';
import { RolesRepository, UsersRepository } from '../repositories';
import { UserService } from '../services';

@Module({
  imports: [CryptoModule],
  controllers: [],
  providers: [
    UserService,
    UsersRepository,
    RolesRepository,
    UserMapper,
    RoleMapper,
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
