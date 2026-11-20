import { Inject, Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq } from 'drizzle-orm';
import {
  OccurrenceStatusKey,
  type AgentWorkloadReadModel,
  UserEntity,
} from '../entities';
import {
  assignmentsTable,
  DRIZZLE_PROVIDER,
  type DrizzleDB,
  occurrencesTable,
  occurrenceStatusesTable,
  rolesTable,
  usersTable,
} from '../infra';
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

  async findAgentsWithActiveTasks(): Promise<AgentWorkloadReadModel[]> {
    const latestAssignments = this.db
      .selectDistinctOn([assignmentsTable.occurrenceId], {
        occurrenceId: assignmentsTable.occurrenceId,
        agentId: assignmentsTable.agentId,
      })
      .from(assignmentsTable)
      .orderBy(
        assignmentsTable.occurrenceId,
        desc(assignmentsTable.assignedAt),
        desc(assignmentsTable.id),
      )
      .as('latest_assignments');
    const activeTasksCount = count(occurrenceStatusesTable.id).mapWith(Number);

    return this.db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        activeTasksCount,
      })
      .from(usersTable)
      .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
      .leftJoin(latestAssignments, eq(usersTable.id, latestAssignments.agentId))
      .leftJoin(
        occurrencesTable,
        and(
          eq(latestAssignments.occurrenceId, occurrencesTable.id),
          eq(occurrencesTable.isActive, true),
        ),
      )
      .leftJoin(
        occurrenceStatusesTable,
        and(
          eq(occurrencesTable.statusId, occurrenceStatusesTable.id),
          eq(
            occurrenceStatusesTable.key,
            OccurrenceStatusKey.FORWARDED_FOR_INSPECTION,
          ),
        ),
      )
      .where(and(eq(rolesTable.name, 'agent'), eq(usersTable.isActive, true)))
      .groupBy(usersTable.id, usersTable.name)
      .orderBy(asc(activeTasksCount), asc(usersTable.name));
  }
}
