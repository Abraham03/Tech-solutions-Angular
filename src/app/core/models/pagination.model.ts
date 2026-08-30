/**
 * Forma que devuelve el backend en todos los listados: data + links + meta.
 * Es la misma tanto para los modulos como para las pestanas del dashboard.
 */
export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface Paginated<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

/** Parametros que acepta cualquier listado. */
export interface ListParams {
  page?: number;
  perPage?: number;
  search?: string;
}

/**
 * Tamanos que admite el backend. Estan validados alli contra una lista blanca,
 * asi que mandar cualquier otro valor simplemente cae al de por defecto.
 */
export const PAGE_SIZES = [10, 25, 50, 100] as const;

export const DEFAULT_PAGE_SIZE = 10;

/** Estado inicial, para no repetir el objeto vacio en cada componente. */
export function emptyMeta(perPage = DEFAULT_PAGE_SIZE): PaginationMeta {
  return {
    current_page: 1,
    from: null,
    last_page: 1,
    path: '',
    per_page: perPage,
    to: null,
    total: 0
  };
}
