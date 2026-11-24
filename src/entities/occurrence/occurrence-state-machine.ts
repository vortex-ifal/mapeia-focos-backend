import { OccurrenceStatusKey } from '../occurrence-status';

export const OCCURRENCE_STATUS_TRANSITIONS: Record<
  OccurrenceStatusKey,
  readonly OccurrenceStatusKey[]
> = {
  [OccurrenceStatusKey.REGISTERED]: [
    OccurrenceStatusKey.UNDER_REVIEW,
    OccurrenceStatusKey.ACCEPTED,
    OccurrenceStatusKey.REJECTED,
  ],
  [OccurrenceStatusKey.UNDER_REVIEW]: [
    OccurrenceStatusKey.ACCEPTED,
    OccurrenceStatusKey.REJECTED,
  ],
  [OccurrenceStatusKey.ACCEPTED]: [
    OccurrenceStatusKey.FORWARDED_FOR_INSPECTION,
  ],
  [OccurrenceStatusKey.FORWARDED_FOR_INSPECTION]: [
    OccurrenceStatusKey.RESOLVED,
  ],
  [OccurrenceStatusKey.REJECTED]: [],
  [OccurrenceStatusKey.RESOLVED]: [],
};

export const PRIORITIZABLE_OCCURRENCE_STATUSES: readonly OccurrenceStatusKey[] =
  [
    OccurrenceStatusKey.ACCEPTED,
    OccurrenceStatusKey.FORWARDED_FOR_INSPECTION,
  ];

export function isFrozenOccurrenceStatus(
  statusKey: string | undefined,
): boolean {
  return Object.entries(OCCURRENCE_STATUS_TRANSITIONS).some(
    ([key, transitions]) => key === statusKey && transitions.length === 0,
  );
}

export function isPriorityAllowedForOccurrenceStatus(
  statusKey: string | undefined,
): boolean {
  return PRIORITIZABLE_OCCURRENCE_STATUSES.some((key) => key === statusKey);
}

export function isOccurrenceStatusTransitionAllowed(
  currentStatusKey: string | undefined,
  newStatusKey: string | undefined,
  route: 'status' | 'assignment' = 'status',
): boolean {
  if (!currentStatusKey || !newStatusKey) {
    return false;
  }

  const allowedStatuses = Object.entries(OCCURRENCE_STATUS_TRANSITIONS).find(
    ([statusKey]) => statusKey === currentStatusKey,
  )?.[1];

  if (!allowedStatuses?.some((statusKey) => statusKey === newStatusKey)) {
    return false;
  }

  return (
    newStatusKey !== OccurrenceStatusKey.FORWARDED_FOR_INSPECTION ||
    route === 'assignment'
  );
}
