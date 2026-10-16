import { Injectable } from '@nestjs/common';
import { UserBuilder, UserEntity, UserRole } from '../entities';
import { CreatedResponseDto, CreateUserDto } from '../dtos';
import { UserInsert, UserSelect } from '../infra';

@Injectable()
export class UserMapper {
  toDomainFromDto(dto: CreateUserDto): UserEntity {
    return UserBuilder.create()
      .withName(dto.name.trim())
      .withEmail(dto.email.trim().toLowerCase())
      .withPassword(dto.password)
      .withCpf(dto.cpf ?? null)
      .withRole('citizen')
      .withIsActive(true)
      .build();
  }

  toCreatedDto(id: string): CreatedResponseDto {
    return {
      id,
    };
  }

  toPersistence(entity: UserEntity): UserInsert {
    return {
      ...(entity.id ? { id: entity.id } : {}),
      name: entity.name,
      email: entity.email,
      passwordHash: entity.password,
      cpf: entity.cpf ?? null,
      role: entity.role,
      isActive: entity.isActive,
    };
  }

  toDomainFromPersistence(row: UserSelect): UserEntity {
    return UserBuilder.create()
      .withId(row.id)
      .withName(row.name)
      .withEmail(row.email)
      .withPassword(row.passwordHash)
      .withCpf(row.cpf)
      .withRole(row.role as UserRole)
      .withIsActive(row.isActive)
      .withCreatedAt(row.createdAt)
      .withUpdatedAt(row.updatedAt)
      .build();
  }
}
