import { Inject, Injectable } from '@nestjs/common';
import { and, asc, between, count, eq, lte, ne, sql } from 'drizzle-orm';
import {
  NearbyOccurrenceEntity,
  OccurrenceEntity,
  OccurrenceStatusKey,
  type OccurrenceCreatedReadModel,
  type OccurrenceStatusReadModel,
} from '../entities';
import {
  DRIZZLE_PROVIDER,
  type DrizzleDB,
  occurrencesTable,
  occurrenceStatusesTable,
  statusHistoriesTable,
} from '../infra';
import { OccurrenceMapper } from '../mappers';

@Injectable()
export class OccurrencesRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleDB,
    private readonly mapper: OccurrenceMapper,
  ) {}

  async create(
    entity: OccurrenceEntity,
  ): Promise<OccurrenceCreatedReadModel> {
    const data = this.mapper.toPersistence(entity);

    const [inserted] = await this.db
      .insert(occurrencesTable)
      .values(data)
      .returning({
        id: occurrencesTable.id,
        protocol: occurrencesTable.protocol,
      });

    return {
      id: inserted.id,
      protocol: inserted.protocol,
    };
  }

  async findById(id: string): Promise<OccurrenceEntity | null> {
    const [row] = await this.db
      .select({
        occurrence: occurrencesTable,
        status: occurrenceStatusesTable,
      })
      .from(occurrencesTable)
      .leftJoin(
        occurrenceStatusesTable,
        eq(occurrencesTable.statusId, occurrenceStatusesTable.id),
      )
      .where(
        and(eq(occurrencesTable.id, id), eq(occurrencesTable.isActive, true)),
      )
      .limit(1);

    if (!row) {
      return null;
    }

    return this.mapper.toDomainFromPersistence({
      ...row.occurrence,
      status: row.status,
    });
  }

  async findStatusByProtocol(
    protocol: string,
  ): Promise<OccurrenceStatusReadModel | null> {
    const [row] = await this.db
      .select({
        protocol: occurrencesTable.protocol,
        statusKey: occurrenceStatusesTable.key,
        statusName: occurrenceStatusesTable.name,
      })
      .from(occurrencesTable)
      .innerJoin(
        occurrenceStatusesTable,
        eq(occurrencesTable.statusId, occurrenceStatusesTable.id),
      )
      .where(
        and(
          eq(occurrencesTable.protocol, protocol),
          eq(occurrencesTable.isActive, true),
        ),
      )
      .limit(1);

    if (!row) {
      return null;
    }

    return {
      protocol: row.protocol,
      statusKey: row.statusKey,
      statusName: row.statusName,
    };
  }

  async updateStatusWithHistory(params: {
    occurrenceId: string;
    previousStatusId: string;
    newStatusId: string;
    changedByUserId: string;
    isActive?: boolean;
  }): Promise<boolean> {
    const {
      occurrenceId,
      previousStatusId,
      newStatusId,
      changedByUserId,
      isActive = true,
    } = params;

    return this.db.transaction(async (tx) => {
      const [updated] = await tx
        .update(occurrencesTable)
        .set({
          statusId: newStatusId,
          isActive,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(occurrencesTable.id, occurrenceId),
            eq(occurrencesTable.isActive, true),
          ),
        )
        .returning({ id: occurrencesTable.id });

      if (!updated) {
        return false;
      }

      await tx.insert(statusHistoriesTable).values({
        occurrenceId,
        previousStatusId,
        newStatusId,
        changedByUserId,
      });

      return true;
    });
  }

  async softDelete(id: string): Promise<boolean> {
    const [updated] = await this.db
      .update(occurrencesTable)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(
        and(eq(occurrencesTable.id, id), eq(occurrencesTable.isActive, true)),
      )
      .returning({ id: occurrencesTable.id });

    return !!updated;
  }

  async findAll(
    page: number,
    pageSize: number,
    statusKey?: OccurrenceStatusKey,
  ): Promise<{ items: OccurrenceEntity[]; total: number }> {
    const skip = (page - 1) * pageSize;

    const whereConditions = and(
      eq(occurrencesTable.isActive, true),
      statusKey ? eq(occurrenceStatusesTable.key, statusKey) : undefined,
    );

    const [rows, [countResult]] = await Promise.all([
      this.db
        .select({
          occurrence: occurrencesTable,
          status: occurrenceStatusesTable,
        })
        .from(occurrencesTable)
        .innerJoin(
          occurrenceStatusesTable,
          eq(occurrencesTable.statusId, occurrenceStatusesTable.id),
        )
        .where(whereConditions)
        .orderBy(asc(occurrencesTable.createdAt), asc(occurrencesTable.id))
        .limit(pageSize)
        .offset(skip),
      this.db
        .select({ total: count() })
        .from(occurrencesTable)
        .innerJoin(
          occurrenceStatusesTable,
          eq(occurrencesTable.statusId, occurrenceStatusesTable.id),
        )
        .where(whereConditions),
    ]);

    const items = rows.map((row) =>
      this.mapper.toDomainFromPersistence({
        ...row.occurrence,
        status: row.status,
      }),
    );

    return {
      items,
      total: countResult?.total ?? 0,
    };
  }

  async findNearby(
    origin: { id: string; latitude: number; longitude: number },
    radiusMeters: number,
    limit: number,
  ): Promise<NearbyOccurrenceEntity[]> {
    const metersPerDegree = 111_320;
    const deltaLat = radiusMeters / metersPerDegree;
    const deltaLng =
      radiusMeters /
      (metersPerDegree * Math.cos((origin.latitude * Math.PI) / 180));

    // Pré-calcula os limites da caixa delimitadora para evitar erros de parser do TS no between
    const minLat = origin.latitude - deltaLat;
    const maxLat = origin.latitude + deltaLat;
    const minLng = origin.longitude - deltaLng;
    const maxLng = origin.longitude + deltaLng;

    const lat = sql`${occurrencesTable.latitude}::float8`;
    const lng = sql`${occurrencesTable.longitude}::float8`;
    const originLat = sql`${origin.latitude}::float8`;
    const originLng = sql`${origin.longitude}::float8`;

    const distance = sql<number>`6371000 * acos(least(1.0, greatest(-1.0,
      cos(radians(${originLat})) * cos(radians(${lat})) * cos(radians(${lng}) - radians(${originLng}))
      + sin(radians(${originLat})) * sin(radians(${lat}))
    )))`;

    const rows = await this.db
      .select({
        id: occurrencesTable.id,
        latitude: occurrencesTable.latitude,
        longitude: occurrencesTable.longitude,
        createdAt: occurrencesTable.createdAt,
        statusKey: occurrenceStatusesTable.key,
        statusName: occurrenceStatusesTable.name,
        distanceMeters: distance.mapWith(Number),
      })
      .from(occurrencesTable)
      .innerJoin(
        occurrenceStatusesTable,
        eq(occurrencesTable.statusId, occurrenceStatusesTable.id),
      )
      .where(
        and(
          eq(occurrencesTable.isActive, true),
          ne(occurrencesTable.id, origin.id),
          ne(occurrenceStatusesTable.key, OccurrenceStatusKey.REJECTED),
          between(occurrencesTable.latitude, minLat, maxLat),
          between(occurrencesTable.longitude, minLng, maxLng),
          lte(distance, radiusMeters),
        ),
      )
      .orderBy(asc(distance))
      .limit(limit);

    return rows.map((row) => this.mapper.toNearbyDomainFromPersistence(row));
  }
}
