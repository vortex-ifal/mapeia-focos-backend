import { Inject, Injectable } from '@nestjs/common';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import {
  OccurrenceStatusKey,
  UserEntity,
  type AgentAvailabilityReadModel,
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

  async findAgentsWithActiveTaskCounts(): Promise<
    AgentAvailabilityReadModel[]
  > {
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

    const taskCounts = this.db
      .select({
        agentId: latestAssignments.agentId,
        totalActiveTasks: sql<number>`count(*)::int`.as('total_active_tasks'),
      })
      .from(latestAssignments)
      .innerJoin(
        occurrencesTable,
        eq(occurrencesTable.id, latestAssignments.occurrenceId),
      )
      .innerJoin(
        occurrenceStatusesTable,
        eq(occurrencesTable.statusId, occurrenceStatusesTable.id),
      )
      .where(
        and(
          eq(occurrencesTable.isActive, true),
          eq(
            occurrenceStatusesTable.key,
            OccurrenceStatusKey.FORWARDED_FOR_INSPECTION,
          ),
        ),
      )
      .groupBy(latestAssignments.agentId)
      .as('task_counts');

    return this.db
      .select({
        agentId: usersTable.id,
        name: usersTable.name,
        sectorRegion: usersTable.sectorRegion,
        totalActiveTasks: sql<number>`coalesce(${taskCounts.totalActiveTasks}, 0)::int`,
      })
      .from(usersTable)
      .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
      .leftJoin(taskCounts, eq(taskCounts.agentId, usersTable.id))
      .where(and(eq(rolesTable.name, 'agent'), eq(usersTable.isActive, true)))
      .orderBy(asc(usersTable.name));
  }
}
