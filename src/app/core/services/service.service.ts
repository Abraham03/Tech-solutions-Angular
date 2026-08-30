import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ListParams, Paginated } from '../models/pagination.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Listado paginado. page, perPage y search viajan al servidor: la
   * busqueda mira toda la tabla y no solo la pagina cargada.
   */
  getServices(params: ListParams = {}): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/services`, {
      params: buildListParams(params)
    });
  }

  getService(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/services/${id}`);
  }

  createService(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/services`, data);
  }

  updateService(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/services/${id}`, data);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/services/${id}`);
  }
}

/**
 * Solo se mandan los parametros con valor. Enviar search vacio haria que el
 * backend filtrara por cadena vacia en vez de no filtrar.
 */
function buildListParams(params: ListParams): HttpParams {
  let httpParams = new HttpParams();

  if (params.page) {
    httpParams = httpParams.set('page', params.page);
  }
  if (params.perPage) {
    httpParams = httpParams.set('per_page', params.perPage);
  }
  if (params.search?.trim()) {
    httpParams = httpParams.set('search', params.search.trim());
  }

  return httpParams;
}
