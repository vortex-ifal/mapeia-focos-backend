import { Injectable } from '@nestjs/common';
import { RoleEntity, UserBuilder, UserEntity } from '../entities';
import { CreatedResponseDto, CreateUserDto } from '../dtos';
import { UserInsert, UserSelect } from '../infra';

@Injectable()
export class UserMapper {
  toDomainFromDto(dto: CreateUserDto): UserEntity {
    return UserBuilder.create()
      .withName(dto.name.trim())
      .withEmail(dto.email.trim().toLowerCase())
      .withPassword(dto.password)
      .withCpf(dto.cpf)
      .withIsActive(true)
      .build();
  }

  toCreatedDto(id: string): CreatedResponseDto {
    return {
      id,
    };
  }

  toPersistence(entity: UserEntity): UserInsert {
    if (!entity.role?.id) {
      throw new Error('UserEntity role id is required for persistence');
    }

    return {
      ...(entity.id ? { id: entity.id } : {}),
      name: entity.name,
      email: entity.email,
      passwordHash: entity.password,
      cpf: entity.cpf,
      roleId: entity.role.id,
      isActive: entity.isActive,
    };
  }

  toDomainFromPersistence(row: UserSelect, role?: RoleEntity): UserEntity {
    const builder = UserBuilder.create()
      .withId(row.id)
      .withName(row.name)
      .withEmail(row.email)
      .withPassword(row.passwordHash)
      .withCpf(row.cpf)
      .withIsActive(row.isActive)
      .withCreatedAt(row.createdAt)
      .withUpdatedAt(row.updatedAt);

    if (role) {
      builder.withRole(role);
    }

    return builder.build();
  }
}
