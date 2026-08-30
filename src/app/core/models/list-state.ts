import { signal } from '@angular/core';
import { ListParams, PaginationMeta, DEFAULT_PAGE_SIZE, emptyMeta } from './pagination.model';

/**
 * Estado de un listado paginado: pagina actual, tamano, busqueda y resultados.
 *
 * Vive aparte porque los cinco modulos hacian exactamente lo mismo, incluida la
 * gimnasia de desenvolver la respuesta. Tenerlo en un sitio evita que cada
 * pantalla lo resuelva a su manera.
 */
export class ListState<T = any> {
  readonly items = signal<T[]>([]);
  readonly meta = signal<PaginationMeta>(emptyMeta());
  readonly loading = signal(false);

  page = 1;
  perPage = DEFAULT_PAGE_SIZE;
  search = '';

  /** Parametros para la siguiente peticion. */
  params(): ListParams {
    return { page: this.page, perPage: this.perPage, search: this.search };
  }

  /**
   * Vuelca la respuesta del backend.
   *
   * Acepta tanto {status, data:{data, meta}} -que es como responde el panel-
   * como un {data, meta} suelto, por si algun endpoint cambia de envoltorio.
   */
  apply(response: any): void {
    const cuerpo = response?.data?.data !== undefined ? response.data : response;

    this.items.set(Array.isArray(cuerpo?.data) ? cuerpo.data : []);

    if (cuerpo?.meta) {
      this.meta.set(cuerpo.meta);
      // El backend puede corregir per_page si se pidio un valor no permitido;
      // nos quedamos con el suyo para que el selector muestre la verdad.
      this.perPage = cuerpo.meta.per_page ?? this.perPage;
      this.page = cuerpo.meta.current_page ?? this.page;
    } else {
      this.meta.set(emptyMeta(this.perPage));
    }
  }

  /** Deja el listado vacio tras un error, sin dejar el spinner colgado. */
  fail(): void {
    this.items.set([]);
    this.meta.set(emptyMeta(this.perPage));
  }

  goToPage(pagina: number): void {
    this.page = pagina;
  }

  /**
   * Cambiar tamano o busqueda vuelve a la primera pagina: si estabas en la 7 y
   * el filtro deja 2 paginas, la 7 ya no existe y la tabla saldria vacia.
   */
  changePageSize(tamano: number): void {
    this.perPage = tamano;
    this.page = 1;
  }

  changeSearch(termino: string): void {
    this.search = termino;
    this.page = 1;
  }
}
