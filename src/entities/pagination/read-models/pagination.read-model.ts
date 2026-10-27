export interface PaginationReadModel<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function createPaginationReadModel<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number,
): PaginationReadModel<T> {
  return {
    data,
    page,
    pageSize,
    total,
    totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
  };
}
