import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ListParams, Paginated } from '../models/pagination.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Listado paginado. page, perPage y search viajan al servidor: la
   * busqueda mira toda la tabla y no solo la pagina cargada.
   */
  getClients(params: ListParams = {}): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/clients`, {
      params: buildListParams(params)
    });
  }

  // Obtener un solo cliente (Para la edición)
  getClient(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/clients/${id}`);
  }

  // Crear cliente
  createClient(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/clients`, data);
  }

  // Actualizar cliente
  updateClient(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/clients/${id}`, data);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/clients/${id}`);
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
