import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { RoleEntity } from '../entities';
import { DRIZZLE_PROVIDER, type DrizzleDB, rolesTable } from '../infra';
import { RoleMapper } from '../mappers';

@Injectable()
export class RolesRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleDB,
    private readonly mapper: RoleMapper,
  ) {}

  async findByName(name: string): Promise<RoleEntity | null> {
    const [row] = await this.db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.name, name))
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }

  async findById(id: string): Promise<RoleEntity | null> {
    const [row] = await this.db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }
}
