import { Injectable } from '@nestjs/common';
import { RoleBuilder, RoleEntity } from '../entities';
import { RoleInsert, RoleSelect } from '../infra';

@Injectable()
export class RoleMapper {
  toDomainFromPersistence(row: RoleSelect): RoleEntity {
    return RoleBuilder.create()
      .withId(row.id)
      .withName(row.name)
      .build();
  }

  toPersistence(entity: RoleEntity): RoleInsert {
    return {
      ...(entity.id ? { id: entity.id } : {}),
      name: entity.name,
    };
  }
}
