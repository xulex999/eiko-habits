import type { PaginationMeta, PaginationParams } from '@eiko/shared-types';

export function parsePagination(params: PaginationParams): { skip: number; take: number } {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.min(100, Math.max(1, params.perPage ?? 20));
  return { skip: (page - 1) * perPage, take: perPage };
}

export function buildPaginationMeta(
  total: number,
  params: PaginationParams,
): PaginationMeta {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.min(100, Math.max(1, params.perPage ?? 20));
  return {
    page,
    perPage,
    total,
    totalPages: Math.ceil(total / perPage),
  };
}
