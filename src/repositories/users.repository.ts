import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { UserEntity } from '../entities';
import { DRIZZLE_PROVIDER, type DrizzleDB, rolesTable, usersTable } from '../infra';
import { RoleMapper, UserMapper } from '../mappers';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleDB,
    private readonly mapper: UserMapper,
    private readonly roleMapper: RoleMapper,
  ) {}

  async create(entity: UserEntity): Promise<string> {
    const data = this.mapper.toPersistence(entity);

    const [inserted] = await this.db
      .insert(usersTable)
      .values(data)
      .returning({ id: usersTable.id });

    return inserted.id;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const [result] = await this.db
      .select({
        user: usersTable,
        role: rolesTable,
      })
      .from(usersTable)
      .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!result) {
      return null;
    }

    const role = this.roleMapper.toDomainFromPersistence(result.role);
    return this.mapper.toDomainFromPersistence(result.user, role);
  }

  async findByCpf(cpf: string): Promise<UserEntity | null> {
    const [result] = await this.db
      .select({
        user: usersTable,
        role: rolesTable,
      })
      .from(usersTable)
      .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
      .where(eq(usersTable.cpf, cpf))
      .limit(1);

    if (!result) {
      return null;
    }

    const role = this.roleMapper.toDomainFromPersistence(result.role);
    return this.mapper.toDomainFromPersistence(result.user, role);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const [result] = await this.db
      .select({
        user: usersTable,
        role: rolesTable,
      })
      .from(usersTable)
      .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!result) {
      return null;
    }

    const role = this.roleMapper.toDomainFromPersistence(result.role);
    return this.mapper.toDomainFromPersistence(result.user, role);
  }
}
