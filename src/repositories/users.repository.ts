import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { UserEntity } from '../entities';
import { DRIZZLE_PROVIDER, type DrizzleDB, usersTable } from '../infra';
import { UserMapper } from '../mappers';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleDB,
    private readonly mapper: UserMapper,
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
    const [row] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }

  async findByCpf(cpf: string): Promise<UserEntity | null> {
    const [row] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.cpf, cpf))
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const [row] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence(row);
  }
}
